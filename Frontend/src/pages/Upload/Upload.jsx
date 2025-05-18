import React, { useState } from "react";
import "./Upload.css";
import { FaFileUpload } from "react-icons/fa";
import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [markingScheme, setMarkingScheme] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [aiGeneratedScore, setAiGeneratedScore] = useState(null); // AI Score
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "question") setQuestionPaper(file);
    else if (type === "answer") setAnswerSheet(file);
    else if (type === "marking") setMarkingScheme(file);
  };












  // const handleTriggerAI = async () => {
  //   if (!questionPaper || !answerSheet || !markingScheme) {
  //     toast.warn("Please upload all required files 📄");
  //     return;
  //   }
  
  //   setIsAnalyzing(true);
  //   setAiGeneratedScore(null);
  
  //   const formData = new FormData();
  //   formData.append("question_paper", questionPaper);
  //   formData.append("correct_answers", markingScheme);
  //   formData.append("student_answers", answerSheet);
  
  //   try {
  //     // 🔹 1. OCR Extraction
  //     const ocrResponse = await fetch("http://192.168.0.203:8000/ocr", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (!ocrResponse.ok) throw new Error("OCR failed");
  //     const ocrData = await ocrResponse.json();
  
  //     // 🔹 2. Evaluation Call
  //     const evalResponse = await fetch("http://192.168.0.203:8000/evaluate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(ocrData),
  //     });
  //     if (!evalResponse.ok) throw new Error("Evaluation failed");
  //     const evalData = await evalResponse.json();
  
  //     // 🔹 3. Total Marks Calculation from Each Question
  //     const questions = evalData.evaluation?.per_question_evaluations || [];
  //     let totalObtained = 0;
  //     let totalMax = 0;
  
  //     questions.forEach((q) => {
  //       if (q?.marks_awarded) {
  //         const [obtained, max] = q.marks_awarded.split("/").map(Number);
  //         totalObtained += obtained || 0;
  //         totalMax += max || 0;
  //       }
  //     });
  
  //     const totalMarks = `${totalObtained}/${totalMax}`;
  //     setAiGeneratedScore(totalMarks);
  //     toast.success("AI analysis complete 🎯");
  //   } catch (error) {
  //     console.error("❌ Error during AI evaluation:", error);
  //     toast.error("AI evaluation failed ❌");
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };





  const handleTriggerAI = async () => {
    if (!questionPaper || !answerSheet || !markingScheme) {
      toast.warn("Please upload all required files 📄");
      return;
    }
  
    setIsAnalyzing(true);
    setAiGeneratedScore(null);
  
    const formData = new FormData();
    formData.append("question_paper", questionPaper);
    formData.append("correct_answers", markingScheme);
    formData.append("student_answers", answerSheet);
  
    try {
      // 🔹 1. OCR Request
      const ocrResponse = await fetch("http://10.1.87.135:8000/ocr", {
        method: "POST",
        body: formData,
      });
      if (!ocrResponse.ok) throw new Error("OCR failed");
      const ocrData = await ocrResponse.json();
  
      // 🔹 2. Evaluation Request
      const evalResponse = await fetch("http://10.1.87.135:8000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ocrData),
      });
      if (!evalResponse.ok) throw new Error("Evaluation failed");
      const evalData = await evalResponse.json();
  
      // 🔹 3. Calculate Total Marks
      const questions = evalData.evaluation?.per_question_evaluations || [];
      let totalObtained = 0;
      let totalMax = 0;
  
      questions.forEach((q) => {
        if (q?.marks_awarded) {
          const [obtained, max] = q.marks_awarded.split("/").map(Number);
          totalObtained += obtained || 0;
          totalMax += max || 0;
        }
      });
  
      const totalMarks = `${totalObtained}/${totalMax}`;
      setAiGeneratedScore(totalMarks);
      setScore(totalObtained.toString()); // ✅ Auto-fill right section with obtained score
  
      // 🔹 4. Save to localStorage for Result Page
      localStorage.setItem("latestEvaluation", JSON.stringify(evalData));
      const pdfBlobUrl = URL.createObjectURL(answerSheet);
localStorage.setItem("studentPdfUrl", pdfBlobUrl);
      toast.success("AI analysis complete 🎯");
    } catch (error) {
      console.error("❌ Error during AI evaluation:", error);
      toast.error("AI evaluation failed ❌");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  
  
  
  // 🔹 Upload Marks Logic
  const handleUploadScore = () => {
    if (!studentName || !rollNo || !subject || !score) {
      toast.warn("Please fill all student fields 📝");
      return;
    }

    const marksData = [{ subject, marks: Number(score) }];
    fetch(`http://localhost:5000/api/students/uploadMarks/${rollNo}`, {
      method: "PUT",
      body: JSON.stringify({ marks: marksData }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Upload failed");
        return response.json();
      })
      .then((data) => {
        console.log("Marks uploaded:", data);
        toast.success("Score uploaded successfully ✅");

        // Clear fields
        setStudentName("");
        setRollNo("");
        setSubject("");
        setScore("");
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to upload score ❌");
      });
  };

  return (
    <div className="main-container">
      <TeachersNavbar />

      <div className="upload-container">
        {/* Left Section */}
        <div className="upload-section">
        <div className="ai-grid-overlay"></div>
          <h2>Upload Section</h2>
          <label>Question Paper</label>
          <input type="file" onChange={(e) => handleFileChange(e, "question")} />

          <label>Answer Sheet</label>
          <input type="file" onChange={(e) => handleFileChange(e, "answer")} />

          <label>Marking Scheme</label>
          <input type="file" onChange={(e) => handleFileChange(e, "marking")} />

          <button onClick={handleTriggerAI}>
            <FaFileUpload /> Trigger AI
          </button>

          {/* AI Score Display */}
          {isAnalyzing ? (
  <div className="ai-score-box loading">
    <div className="loader" />
    <p>Analyzing with Scoreline_AI... 🧠</p>
  </div>
) : aiGeneratedScore && (
  <div className="ai-score-box">
    <h3 className="score" style={{color:"wheat"}}>Scoreline_AI Generated Score: {aiGeneratedScore}</h3>
  </div>
)}

        </div>

        {/* Right Section */}
        <div className="student-details">
          <h2>Enter Marks</h2>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            type="text"
            placeholder="Score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          <button onClick={handleUploadScore} style={{ marginTop: 65 }}>
            Upload and Save Score
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Upload;
