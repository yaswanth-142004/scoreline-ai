from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
# from pdf2image import convert_from_path
import fitz 
from PIL import Image
from pdf2image import convert_from_path
from google.cloud import vision
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
import json
import uvicorn
import io
from dotenv import load_dotenv 

load_dotenv()


app = FastAPI()

# Enable CORS for React frontend
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text_content = []
    
    for i, page in enumerate(doc):
        text = page.get_text("text")  # Extract text
        text_content.append({"page": i+1, "text": text})

    return text_content
# Initialize Google Vision API client
def initialize_vision_client():
    try:
       # client = vision.ImageAnnotatorClient.from_service_account_file('C:\\Users\\HP\\Downloads\\our-chess-448616-u2-2dc0eb7da594.json')
        client = vision.ImageAnnotatorClient.from_service_account_file('ocrapi.json')
        return client
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Google Vision API client: {e}")

# Perform OCR with Google Vision API
def perform_ocr(client, image_content):
    try:
        image = vision.Image(content=image_content)
        response = client.text_detection(image=image)

        # Check for API errors
        if response.error.message:
            raise RuntimeError(f"Google Vision API Error: {response.error.message}")

        # Extract and return detected text
        if response.text_annotations:
            detected_text = response.text_annotations[0].description
            return detected_text
        else:
            return "No text detected in the image."
    except Exception as e:
        raise RuntimeError(f"Error during text detection: {e}")

# Evaluate answers using Groq API through LangChain
def evaluate_with_groq(question, correct_answer, student_answer):
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            return json.dumps({"error": "API key missing"})

        system_prompt = """You are an academic evaluator. Return JSON strictly using this format:
        {
            "summary_report": {
                "total_marks": "X/Y",
                "overall_feedback": "concise summary"
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
        Return ONLY valid JSON without any formatting or commentary."""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"QUESTION: {question}"),
            HumanMessage(content=f"MODEL ANSWER: {correct_answer}"),
            HumanMessage(content=f"STUDENT ANSWER: {student_answer}")
        ]

        chat = ChatGroq(temperature=0, model_name="llama-3.3-70b-versatile")
        response = chat.invoke(messages).content
        
        # Validate JSON format before returning
        json.loads(response)
        return response

    except json.JSONDecodeError:
        return json.dumps({"error": "Invalid response format from AI model"})
    except Exception as e:
        return json.dumps({"error": str(e)})

@app.get("/")
async def read_root():
    return {"message": "PDF OCR and Evaluation API"}

@app.post("/ocr")
async def ocr_endpoint(
    question_paper: UploadFile = File(...),
    correct_answers: UploadFile = File(...),
    student_answers: UploadFile = File(...)
):
    # Dictionary to store OCR results
    ocr_results = {}
    
    # Initialize Vision API client
    try:
        vision_client = initialize_vision_client()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Process each PDF file
    for pdf_type, pdf_file in [
        ("question_paper", question_paper),
        ("correct_answers", correct_answers),
        ("student_answers", student_answers)
    ]:
        # Create temp file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_file.write(await pdf_file.read())
        temp_file.close()
        
        try:
            # Convert PDF to images using pdf2image
            images = convert_from_path(temp_file.name,poppler_path = r"D:\\poppler-24.08.0\\Library\\bin")
            
            # Extract text from each page with Google Vision API
            text_content = []
            for i, image in enumerate(images):
                # Convert PIL Image to bytes
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='PNG')
                img_byte_arr = img_byte_arr.getvalue()
                
                # Get OCR text from Google Vision
                text = perform_ocr(vision_client, img_byte_arr)
                text_content.append({"page": i+1, "text": text})
            
            # Add to results
            ocr_results[pdf_type] = text_content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing {pdf_type}: {str(e)}")
        finally:
            # Remove temp file
            os.unlink(temp_file.name)
    
    return ocr_results

@app.post("/evaluate")
async def evaluate_answers(ocr_data: dict):
    try:
        # Extract the OCR data
        question_paper = ocr_data.get("question_paper", [])
        correct_answers = ocr_data.get("correct_answers", [])
        student_answers = ocr_data.get("student_answers", [])
        
        # Combine the text content from all pages
        question_text = "\n".join([page["text"] for page in question_paper])
        correct_text = "\n".join([page["text"] for page in correct_answers])
        student_text = "\n".join([page["text"] for page in student_answers])
        
        # Call the Groq evaluation function
        evaluation_result = evaluate_with_groq(
            question=question_text,
            correct_answer=correct_text,
            student_answer=student_text
        )
        
        # Parse the evaluation result to ensure it's valid JSON
        try:
            evaluation_json = json.loads(evaluation_result)
            return {
                "evaluation": evaluation_json,
                "ocr_data": ocr_data
            }
        except json.JSONDecodeError:
            return {
                "evaluation": evaluation_result,  # Return as string if not valid JSON
                "ocr_data": ocr_data
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in evaluation: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


## To run this code use the following command in the terminal
# uvicorn main:app --reload
