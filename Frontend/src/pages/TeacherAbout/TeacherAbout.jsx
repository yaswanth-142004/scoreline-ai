import React from "react";
import "./TeacherAbout.css";
import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";
import Stars from "../../components/Star";

const TeacherAbout = () => {
  return (
    <div className="about-page">
      <Stars/>
      <TeachersNavbar />
      

      <div className="about-container">
        
        <h1>About Scoreline_AI</h1>

        <p>
          <strong>Scoreline_AI</strong> is a powerful AI-driven tool designed to simplify
          and speed up the answer sheet evaluation process for teachers.
        </p>

        <p>
          Simply upload the <strong>Question Paper</strong>, <strong>Student’s Answer Sheet</strong>, and the <strong>Marking Scheme</strong>, and Scoreline_AI intelligently analyzes the student's response and generates an accurate score.
        </p>

        <h2>🚀 What It Does:</h2>
        <ul>
          <li>📥 Accepts question paper, student answer sheet, and marking scheme</li>
          <li>🧠 Uses AI to compare and understand the correctness of answers</li>
          <li>✅ Auto-generates marks based on content match</li>
          <li>📊 Lets teachers verify or manually update scores</li>
          <li>📂 Saves evaluated scores securely to the student’s profile</li>
        </ul>

        <h2>🎯 Why Teachers Love It:</h2>
        <ul>
          <li>🕒 Saves hours of manual checking</li>
          <li>📈 Brings consistency to scoring</li>
          <li>🔁 Supports batch uploads</li>
          <li>💡 AI learns and adapts over time</li>
        </ul>

        <p className="highlight">
          Scoreline_AI empowers teachers to focus more on teaching and mentoring — while AI handles the repetitive evaluation part.
        </p>

        <p className="footer">Made with ❤️ for Educators by Team Scoreline_AI</p>
      </div>
    </div>
  );
};

export default TeacherAbout;
