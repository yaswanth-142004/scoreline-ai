import React from "react";
import "./StudentAbout.css";
import StudentNavbar from "../../components/StudentNavbar/StudentNavbar";
import Stars from "../../components/Star";

const StudentAbout = () => {
  return (
    <div className="about-page">
      <Stars/>
      <StudentNavbar />

      <div className="about-container">
        <h1>About Scoreline_AI</h1>

        <p>
          <strong>Scoreline_AI</strong> is your intelligent study buddy that helps you get 
          your answers evaluated instantly using AI!
        </p>

        <p>
          When your teacher uploads your <strong>answer sheet</strong> along with the 
          <strong> question paper</strong> and <strong>marking scheme</strong>, our AI analyzes 
          your response and calculates your score based on the answer’s quality and relevance.
        </p>

        <h2>📚 How It Helps You:</h2>
        <ul>
          <li>⏱️ Know your scores faster – no waiting!</li>
          <li>🧠 Get evaluated fairly using AI</li>
          <li>📈 See how your answers compare to the ideal solution</li>
          <li>🔍 Understand where you lost marks and why</li>
          <li>🧭 Get suggestions to focus on weak topics</li>
        </ul>

        <h2>💡 Why You’ll Love It:</h2>
        <ul>
          <li>⚡ Instant feedback = better preparation</li>
          <li>🎯 Accurate and unbiased scoring</li>
          <li>📝 Motivation to write better answers</li>
          <li>🚀 Improves your performance with every test</li>
        </ul>

        <p className="highlight">
          Scoreline_AI helps you track your academic progress and learn smarter, not harder.
        </p>

        <p className="footer">Built with 💙 to help you grow smarter with AI ✨</p>
      </div>
    </div>
  );
};

export default StudentAbout;
