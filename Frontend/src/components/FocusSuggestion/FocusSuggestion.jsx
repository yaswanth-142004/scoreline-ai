import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FocusSuggestion.css"; // ✅ Add styles for better appearance

const FocusSuggestion = () => {
  const [marks, setMarks] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please log in again.");
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`
        );
        if (res.data && res.data.marks) {
          setMarks(res.data.marks);
          analyzeWeakSubjects(res.data.marks);
        } else {
          toast.info("No marks available yet.");
        }
      } catch (error) {
        toast.error("Failed to fetch marks.");
      }
    };

    fetchResults();
  }, []);

  const analyzeWeakSubjects = (marks) => {
    const threshold = 40; // 📌 Define passing marks threshold
    const weak = marks.filter((subject) => subject.marks < threshold);
    setWeakSubjects(weak);
  };

  return (
    <div className="focus-suggestion-container">
      <h4>📌 Focus Areas</h4>
      {weakSubjects.length === 0 ? (
        <p className="success-msg">🎉 Great job! You're doing well in all subjects.</p>
      ) : (
        <>
          <p className="advice-msg">You need to focus more on the following subjects:</p>
          <ul className="weak-subject-list">
            {weakSubjects.map((subject, index) => (
              <li key={index} className="weak-subject">
                {subject.subject} - {subject.marks} marks
              </li>
            ))}
          </ul>
          <p className="tip-msg">🔹 Try revising concepts, solving past papers, and asking for help!</p>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FocusSuggestion;
