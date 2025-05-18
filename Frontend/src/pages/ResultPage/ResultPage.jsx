// import React, { useEffect, useState } from "react";
// import "./ResultPage.css";
// import { toast } from "react-toastify";
// import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";

// const ResultPage = () => {
//   const [evaluationData, setEvaluationData] = useState(null);
//   const [studentPdfUrl, setStudentPdfUrl] = useState(null);

//   useEffect(() => {
//     // Load evaluation result
//     const savedData = localStorage.getItem("latestEvaluation");
//     const pdfUrl = localStorage.getItem("studentPdfUrl");

//     if (savedData) {
//       setEvaluationData(JSON.parse(savedData));
//     } else {
//       toast.error("No evaluation data found.");
//     }

//     if (pdfUrl) {
//       setStudentPdfUrl(pdfUrl);
//     } else {
//       toast.warn("No student PDF uploaded.");
//     }
//   }, []);

//   if (!evaluationData || !evaluationData.evaluation) {
//     return <div className="result-loader">Loading Evaluation Summary...</div>;
//   }

//   const summary_report = evaluationData.evaluation.summary_report || {};
//   const per_question_evaluations = evaluationData.evaluation.per_question_evaluations || [];

//   return (
//     <div className="ai-result-container">
//         <TeachersNavbar/>
//       {/* Top Section: Overall Summary */}
//       <div className="ai-summary-box">
//         <h2>🧾 Evaluation Summary</h2>
//         <p><strong>Total Marks:</strong> {summary_report.total_marks}</p>
//         <p><strong>Feedback:</strong> {summary_report.overall_feedback}</p>
//       </div>

//       <div className="ai-result-content">
//         {/* Left Section: Per Question Evaluation */}
//         <div className="ai-questions-section">
//           <h3>📌 Per-Question Breakdown</h3>
//           {per_question_evaluations.map((q, index) => (
//             <div key={index} className="ai-question-box">
//               <p><strong>Q{index + 1}:</strong> {q.question}</p>
//               <p><strong>Marks Awarded:</strong> {q.marks_awarded}</p>
//               {q.justifications.improvement_suggestions.length > 0 && (
//                 <p className="ai-improvements">
//                   💡 Suggestions: {q.justifications.improvement_suggestions.join(", ")}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Right Section: PDF Viewer */}
//         <div className="ai-pdf-section">
//           <h3>📄 Student Answer Sheet</h3>
//           {studentPdfUrl ? (
//             <iframe
//               src={studentPdfUrl}
//               title="Student Answer Sheet"
//               width="100%"
//               height="600px"
//               frameBorder="0"
//             ></iframe>
//           ) : (
//             <p>No answer sheet uploaded.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;


// import React, { useEffect, useState } from "react";
// import "./ResultPage.css";
// import { toast } from "react-toastify";
// import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";

// const ResultPage = () => {
//   const [evaluationData, setEvaluationData] = useState(null);
//   const [studentPdfUrl, setStudentPdfUrl] = useState(null);

//   useEffect(() => {
//     const savedData = localStorage.getItem("latestEvaluation");
//     const pdfUrl = localStorage.getItem("studentPdfUrl");

//     if (savedData) {
//       setEvaluationData(JSON.parse(savedData));
//     } else {
//       toast.error("No evaluation data found.");
//     }

//     if (pdfUrl) {
//       setStudentPdfUrl(pdfUrl);
//     } else {
//       toast.warn("No student PDF uploaded.");
//     }
//   }, []);

//   if (!evaluationData || !evaluationData.evaluation) {
//     return <div className="result-loader">Loading Evaluation Summary...</div>;
//   }

//   const summary_report = evaluationData.evaluation.summary_report || {};
//   const per_question_evaluations = evaluationData.evaluation.per_question_evaluations || [];

//   return (
//     <div className={`ai-result-wrapper ${isSidebarOpen ? "sidebar-expanded" : ""}`}>
//   <TeachersNavbar />
//       <div className="ai-result-container">
//         {/* Top Section: Overall Summary */}
//         <div className="ai-summary-box">
//           <h2>🧾 Evaluation Summary</h2>
//           <p><strong>Total Marks:</strong> {summary_report.total_marks}</p>
//           <p><strong>Feedback:</strong> {summary_report.overall_feedback}</p>
//         </div>

//         <div className="ai-result-content">
//           {/* Left Section: Per Question Evaluation */}
//           <div className="ai-questions-section">
//             <h3>📌 Per-Question Breakdown</h3>
//             {per_question_evaluations.map((q, index) => (
//               <div key={index} className="ai-question-box">
//                 <p><strong>Q{index + 1}:</strong> {q.question}</p>
//                 <p><strong>Marks Awarded:</strong> {q.marks_awarded}</p>
//                 {q.justifications.improvement_suggestions.length > 0 && (
//                   <p className="ai-improvements">
//                     💡 Suggestions: {q.justifications.improvement_suggestions.join(", ")}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Right Section: PDF Viewer */}
//           <div className="ai-pdf-section">
//             <h3>📄 Student Answer Sheet</h3>
//             {studentPdfUrl ? (
//               <iframe
//                 src={studentPdfUrl}
//                 title="Student Answer Sheet"
//                 width="100%"
//                 height="600px"
//                 frameBorder="0"
//               ></iframe>
//             ) : (
//               <p>No answer sheet uploaded.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default ResultPage;



import React, { useEffect, useState } from "react";
import "./ResultPage.css";
import { toast } from "react-toastify";
import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";
import Stars from "../../components/Star";
import { ZIndex } from "tsparticles-engine";

const ResultPage = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [studentPdfUrl, setStudentPdfUrl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // simulate sidebar state

  useEffect(() => {
    const savedData = localStorage.getItem("latestEvaluation");
    const pdfUrl = localStorage.getItem("studentPdfUrl");

    if (savedData) {
      setEvaluationData(JSON.parse(savedData));
    } else {
      toast.error("No evaluation data found.");
    }

    if (pdfUrl) {
      setStudentPdfUrl(pdfUrl);
    } else {
      toast.warn("No student PDF uploaded.");
    }
  }, []);

  if (!evaluationData || !evaluationData.evaluation) {
    return <div className="result-loader">Loading Evaluation Summary...</div>;
  }

  const summary_report = evaluationData.evaluation.summary_report || {};
  const per_question_evaluations = evaluationData.evaluation.per_question_evaluations || [];

  return (
    <div className={`ai-result-wrapper ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <Stars/>
<TeachersNavbar />

      <div className="ai-result-container">
        
        {/* Top Section: Overall Summary */}
        <div className="ai-summary-box">
          <h2>🧾 Evaluation Summary</h2>
          <p><strong>Total Marks:</strong> {summary_report.total_marks}</p>
          <p><strong>Feedback:</strong> {summary_report.overall_feedback}</p>
        </div>

        <div className="ai-result-content">
          {/* Left Section: Per Question Evaluation */}
          <div className="ai-questions-section">
            <h3>📌 Per-Question Breakdown</h3>
            {per_question_evaluations.map((q, index) => (
              <div key={index} className="ai-question-box">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <p><strong>Marks Awarded:</strong> {q.marks_awarded}</p>
                {q.justifications.improvement_suggestions.length > 0 && (
                  <p className="ai-improvements">
                    💡 Suggestions: {q.justifications.improvement_suggestions.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Section: PDF Viewer */}
          <div className="ai-pdf-section">
            <h3>📄 Student Answer Sheet</h3>
            {studentPdfUrl ? (
              <iframe
                src={studentPdfUrl}
                title="Student Answer Sheet"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            ) : (
              <p>No answer sheet uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
