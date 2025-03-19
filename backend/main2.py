from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, BackgroundTasks, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import tempfile
import os
import io
import json
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time
import uuid
from functools import lru_cache
import uvicorn
from dotenv import load_dotenv
from pydantic import BaseModel, Field, validator

# PDF processing
from pdf2image import convert_from_path
import fitz  # PyMuPDF

# Google Vision
from google.cloud import vision
from google.oauth2 import service_account

# LangChain for evaluation
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

# Load environment variables
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\\Users\\HP\\OneDrive\\Desktop\\scoreline_final\\scoreline-ai\\backend\\key (2).json"
load_dotenv()


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Cache for storing processing results
processing_cache = {}

# Pydantic models for request validation
class OCRRequest(BaseModel):
    question_paper_id: Optional[str] = None
    correct_answers_id: Optional[str] = None
    student_answers_id: Optional[str] = None

class EvaluationRequest(BaseModel):
    ocr_data: Dict[str, List[Dict[str, Any]]] = Field(...)
    
    @validator('ocr_data')
    def validate_ocr_data(cls, v):
        required_keys = ["question_paper", "correct_answers", "student_answers"]
        if not all(key in v for key in required_keys):
            missing = [key for key in required_keys if key not in v]
            raise ValueError(f"Missing required OCR data: {', '.join(missing)}")
        return v

# Initialize FastAPI app
app = FastAPI(
    title="PDF OCR and Evaluation API",
    description="An API for OCR processing and evaluation of PDF documents",
    version="1.0.0"
)

# Enable CORS for React frontend
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://yourproductiondomain.com"  # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Environment validation at startup
@app.on_event("startup")
async def validate_environment():
    required_env_vars = ["GOOGLE_APPLICATION_CREDENTIALS", "GROQ_API_KEY"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please set these variables in your .env file or environment")
        # Continue running but log the warning

# Function to get Vision API client - cached for better performance
@lru_cache(maxsize=1)
def get_vision_client():
    try:
        # Get credentials file path from environment
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        if not credentials_path:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set")
            
        if not os.path.exists(credentials_path):
            raise FileNotFoundError(f"Google Cloud credentials file not found at: {credentials_path}")
            
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        client = vision.ImageAnnotatorClient(credentials=credentials)
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Google Vision API client: {e}")
        raise RuntimeError(f"Vision API client initialization failed: {e}")

# Function to extract text directly from PDF using PyMuPDF (faster than OCR for text-based PDFs)
def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text_content = []
        
        for i, page in enumerate(doc):
            text = page.get_text("text")
            # If the page contains meaningful text (not just whitespace or a few characters)
            if len(text.strip()) > 20:
                text_content.append({"page": i+1, "text": text, "extraction_method": "pdf_native"})
            else:
                # Return empty text to indicate OCR might be needed
                text_content.append({"page": i+1, "text": "", "extraction_method": "pdf_native_empty"})
                
        return text_content
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return []

# Perform OCR with Google Vision API
async def perform_ocr(image_bytes, page_num):
    try:
        client = get_vision_client()
        image = vision.Image(content=image_bytes)
        
        # Configure text detection feature with language hints
        features = [vision.Feature(type_=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)]
        
        # Make the API request
        response = client.document_text_detection(image=image)
        
        # Check for API errors
        if response.error.message:
            logger.error(f"Google Vision API Error on page {page_num}: {response.error.message}")
            raise RuntimeError(f"Google Vision API Error: {response.error.message}")
            
        # Extract detected text
        if response.text_annotations:
            detected_text = response.text_annotations[0].description
            return {"page": page_num, "text": detected_text, "extraction_method": "ocr"}
        else:
            logger.warning(f"No text detected on page {page_num}")
            return {"page": page_num, "text": "", "extraction_method": "ocr_empty"}
            
    except Exception as e:
        logger.error(f"Error during OCR text detection on page {page_num}: {e}")
        return {"page": page_num, "text": f"OCR Error: {str(e)}", "extraction_method": "ocr_error"}

# Process PDF with mixed strategy (native extraction + OCR where needed)
async def process_pdf(pdf_path, file_type):
    try:
        # First try to extract text directly from PDF
        text_content = extract_text_from_pdf(pdf_path)
        
        # Check if any pages need OCR because they returned empty text
        ocr_needed = [page["page"] for page in text_content if not page["text"].strip()]
        
        if ocr_needed:
            logger.info(f"OCR needed for {file_type} on pages: {ocr_needed}")
            
            # Convert only the pages that need OCR
            images = convert_from_path(pdf_path, first_page=min(ocr_needed), last_page=max(ocr_needed),poppler_path = r"D:\\poppler-24.08.0\\Library\\bin")
            
            # Create a mapping from converted image index to original page number
            page_mapping = {i: page_num for i, page_num in enumerate(ocr_needed)}
            
            # Process images with OCR concurrently
            ocr_tasks = []
            for i, image in enumerate(images):
                original_page = page_mapping.get(i)
                if original_page is None:
                    continue
                    
                # Convert PIL Image to bytes
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                img_bytes = img_byte_arr.getvalue()
                
                # Add OCR task
                ocr_tasks.append(perform_ocr(img_bytes, original_page))
            
            # Wait for all OCR tasks to complete
            ocr_results = await asyncio.gather(*ocr_tasks)
            
            # Replace empty pages with OCR results
            for ocr_result in ocr_results:
                page_idx = ocr_result["page"] - 1
                if page_idx < len(text_content):
                    text_content[page_idx] = ocr_result
        
        return text_content
        
    except Exception as e:
        logger.error(f"Error processing {file_type}: {e}")
        raise RuntimeError(f"Error processing {file_type}: {str(e)}")

# Evaluate answers using Groq API through LangChain
async def evaluate_with_groq(question, correct_answer, student_answer):
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            logger.error("GROQ_API_KEY is not set")
            return json.dumps({"error": "API key missing"})

        # Enhanced system prompt with clearer scoring guidelines
        system_prompt = """You are an academic evaluator. Return JSON strictly using this format:
        {
            "summary_report": {
                "total_marks": "X/Y",
                "overall_feedback": "concise summary with specific feedback"
            },
            "per_question_evaluations": [{
                "question": "question text",
                "marks_awarded": "X/Y",
                "justifications": {
                    "strengths": ["list", "of", "strengths"],
                    "weaknesses": ["list", "of", "weaknesses"],
                    "improvement_suggestions": ["list", "of", "suggestions"]
                }
            }]
        }
        
        Evaluation guidelines:
        - Be specific about where points were earned or lost
        - Compare student answers directly with model answers
        - Include only factual observations
        - Provide actionable improvement suggestions
        
        Return ONLY valid JSON without any formatting or commentary."""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"QUESTION: {question}"),
            HumanMessage(content=f"MODEL ANSWER: {correct_answer}"),
            HumanMessage(content=f"STUDENT ANSWER: {student_answer}")
        ]

        # Use Llama 3 for more comprehensive evaluation
        chat = ChatGroq(
            temperature=0.1,  # Slightly higher for better language variety
            model_name="llama-3.3-70b-versatile",
            groq_api_key=groq_api_key
        )
        
        response = chat.invoke(messages).content
        
        # Validate JSON format before returning
        try:
            json_response = json.loads(response)
            return json_response
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON response from LLM: {response}")
            return {"error": "Invalid response format from AI model"}
            
    except Exception as e:
        logger.error(f"Error in evaluation with Groq: {e}")
        return {"error": str(e)}

# Root endpoint
@app.get("/")
async def read_root():
    return {
        "message": "PDF OCR and Evaluation API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    status = {
        "status": "healthy",
        "timestamp": time.time()
    }
    
    # Check environment variables
    env_check = {
        "google_credentials": bool(os.getenv("GOOGLE_APPLICATION_CREDENTIALS")),
        "groq_api_key": bool(os.getenv("GROQ_API_KEY"))
    }
    
    # Test Vision API connection
    try:
        client = get_vision_client()
        env_check["vision_api"] = "connected"
    except Exception as e:
        env_check["vision_api"] = f"error: {str(e)}"
        status["status"] = "degraded"
    
    status["environment"] = env_check
    return status

# Upload endpoint for document processing
@app.post("/upload")
async def upload_document(
    file_type: str = Query(..., description="Type of document (question_paper, correct_answers, student_answers)"),
    file: UploadFile = File(..., description="PDF file to upload")
):
    if file_type not in ["question_paper", "correct_answers", "student_answers"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        # Generate a unique ID for this document
        doc_id = str(uuid.uuid4())
        
        # Create temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_file.write(await file.read())
        temp_file.close()
        
        # Store the file path in the cache
        processing_cache[doc_id] = {
            "file_path": temp_file.name,
            "file_type": file_type,
            "status": "uploaded",
            "timestamp": time.time()
        }
        
        return {
            "document_id": doc_id,
            "file_type": file_type,
            "status": "uploaded",
            "next_step": f"Process document with POST /process/{doc_id}"
        }
        
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Process document endpoint
@app.post("/process/{doc_id}")
async def process_document(
    doc_id: str,
    background_tasks: BackgroundTasks
):
    if doc_id not in processing_cache:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document_info = processing_cache[doc_id]
    
    if document_info["status"] == "processed":
        return {
            "document_id": doc_id,
            "file_type": document_info["file_type"],
            "status": "already_processed",
            "next_step": "Use this ID in OCR or evaluation endpoints"
        }
    
    try:
        # Update status
        processing_cache[doc_id]["status"] = "processing"
        
        # Process in background
        def process_in_background():
            try:
                # Run the processing in the event loop
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                # Process the PDF
                result = loop.run_until_complete(
                    process_pdf(document_info["file_path"], document_info["file_type"])
                )
                
                # Store result in cache
                processing_cache[doc_id]["result"] = result
                processing_cache[doc_id]["status"] = "processed"
                
                # Close the loop
                loop.close()
                
            except Exception as e:
                logger.error(f"Background processing failed for {doc_id}: {e}")
                processing_cache[doc_id]["status"] = "error"
                processing_cache[doc_id]["error"] = str(e)
        
        # Add the task to background processing
        background_tasks.add_task(process_in_background)
        
        return {
            "document_id": doc_id,
            "file_type": document_info["file_type"],
            "status": "processing",
            "next_step": f"Check status with GET /status/{doc_id}"
        }
        
    except Exception as e:
        logger.error(f"Error initiating document processing: {e}")
        processing_cache[doc_id]["status"] = "error"
        processing_cache[doc_id]["error"] = str(e)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Get document status endpoint
@app.get("/status/{doc_id}")
async def get_document_status(doc_id: str):
    if doc_id not in processing_cache:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document_info = processing_cache[doc_id]
    
    response = {
        "document_id": doc_id,
        "file_type": document_info["file_type"],
        "status": document_info["status"],
        "timestamp": document_info["timestamp"]
    }
    
    if document_info["status"] == "error" and "error" in document_info:
        response["error"] = document_info["error"]
    
    if document_info["status"] == "processed":
        # Don't return the full result here, just metadata
        response["pages"] = len(document_info["result"])
        response["next_step"] = "Use this ID in OCR or evaluation endpoints"
    
    return response

# Enhanced OCR endpoint
@app.post("/ocr", response_model=Dict)
async def ocr_endpoint(
    request: OCRRequest = Body(...),
    question_paper: Optional[UploadFile] = File(None),
    correct_answers: Optional[UploadFile] = File(None),
    student_answers: Optional[UploadFile] = File(None)
):
    # Initialize result dictionary
    ocr_results = {}
    temp_files = []
    
    try:
        # Check if using document IDs from previous uploads
        using_ids = any([
            request.question_paper_id,
            request.correct_answers_id,
            request.student_answers_id
        ])
        
        # Check if using direct file uploads
        using_files = any([question_paper, correct_answers, student_answers])
        
        if not using_ids and not using_files:
            raise HTTPException(
                status_code=400, 
                detail="Either document IDs or files must be provided"
            )
        
        # Process each document based on IDs or direct uploads
        document_types = ["question_paper", "correct_answers", "student_answers"]
        ids = [request.question_paper_id, request.correct_answers_id, request.student_answers_id]
        files = [question_paper, correct_answers, student_answers]
        
        ocr_tasks = []
        
        for doc_type, doc_id, file in zip(document_types, ids, files):
            # Use document ID if provided
            if doc_id:
                if doc_id not in processing_cache:
                    raise HTTPException(status_code=404, detail=f"Document ID not found: {doc_id}")
                
                doc_info = processing_cache[doc_id]
                
                if doc_info["status"] != "processed":
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Document {doc_id} is not processed yet. Current status: {doc_info['status']}"
                    )
                
                # Use cached results
                ocr_results[doc_type] = doc_info["result"]
                continue
            
            # Use direct file upload if provided
            if file:
                if not file.filename.lower().endswith('.pdf'):
                    raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
                
                # Create temp file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
                temp_files.append(temp_file.name)
                temp_file.write(await file.read())
                temp_file.close()
                
                # Add task to process the PDF
                ocr_tasks.append((process_pdf(temp_file.name, doc_type), doc_type))
        
        # Execute all processing tasks concurrently
        if ocr_tasks:
            task_results = await asyncio.gather(*[task[0] for task in ocr_tasks])
            
            # Update results with task outputs
            for i, result in enumerate(task_results):
                doc_type = ocr_tasks[i][1]
                ocr_results[doc_type] = result
        
        return ocr_results
        
    except Exception as e:
        logger.error(f"Error in OCR endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
    
    finally:
        # Clean up temporary files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except Exception as e:
                logger.warning(f"Failed to delete temp file {temp_file}: {e}")

# Evaluation endpoint
@app.post("/evaluate")
async def evaluate_answers(request: EvaluationRequest):
    try:
        # Extract the OCR data
        ocr_data = request.ocr_data
        question_paper = ocr_data.get("question_paper", [])
        correct_answers = ocr_data.get("correct_answers", [])
        student_answers = ocr_data.get("student_answers", [])
        
        # Validate OCR data content
        if not question_paper or not correct_answers or not student_answers:
            return JSONResponse(
                status_code=400,
                content={"error": "OCR data is incomplete. All three document types must contain data."}
            )
        
        # Combine the text content from all pages
        question_text = "\n".join([page["text"] for page in question_paper])
        correct_text = "\n".join([page["text"] for page in correct_answers])
        student_text = "\n".join([page["text"] for page in student_answers])
        
        # Validate text content
        if not question_text.strip() or not correct_text.strip() or not student_text.strip():
            return JSONResponse(
                status_code=400,
                content={
                    "error": "One or more documents contain no text. Please check OCR results.",
                    "empty_documents": [
                        name for name, text in [
                            ("question_paper", question_text), 
                            ("correct_answers", correct_text), 
                            ("student_answers", student_text)
                        ] if not text.strip()
                    ]
                }
            )
        
        # Call the Groq evaluation function
        evaluation_result = await evaluate_with_groq(
            question=question_text,
            correct_answer=correct_text,
            student_answer=student_text
        )
        
        # Handle potential errors from the evaluation
        if isinstance(evaluation_result, dict) and "error" in evaluation_result:
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Evaluation service error",
                    "details": evaluation_result["error"]
                }
            )
        
        return {
            "evaluation": evaluation_result,
            "metadata": {
                "question_length": len(question_text),
                "correct_answer_length": len(correct_text),
                "student_answer_length": len(student_text),
                "timestamp": time.time()
            }
        }
            
    except Exception as e:
        logger.error(f"Error in evaluation: {e}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


# Scheduled cleanup of expired cache entries (for a real app, you'd want a better solution)
@app.on_event("startup")
async def setup_cache_cleanup():
    async def cleanup_cache():
        while True:
            try:
                current_time = time.time()
                expired_ids = []
                
                # Find expired entries (older than 1 hour)
                for doc_id, info in processing_cache.items():
                    if current_time - info["timestamp"] > 3600:  # 1 hour
                        expired_ids.append(doc_id)
                        # Delete temp file if it exists
                        if "file_path" in info and os.path.exists(info["file_path"]):
                            try:
                                os.unlink(info["file_path"])
                            except Exception as e:
                                logger.warning(f"Failed to delete temp file for {doc_id}: {e}")
                
                # Remove expired entries
                for doc_id in expired_ids:
                    del processing_cache[doc_id]
                    
                if expired_ids:
                    logger.info(f"Cleaned up {len(expired_ids)} expired cache entries")
                    
            except Exception as e:
                logger.error(f"Error in cache cleanup: {e}")
                
            await asyncio.sleep(300)  # Check every 5 minutes
    
    # Start the cleanup task
    asyncio.create_task(cleanup_cache())


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)