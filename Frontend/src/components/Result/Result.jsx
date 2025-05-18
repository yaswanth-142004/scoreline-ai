import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Result.css"; // ✅ Compact Styling

const Result = () => {
  const [marks, setMarks] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please log in again.");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`
        );
        if (res.data && res.data.marks) {
          setMarks(res.data.marks);
        } else {
          toast.info("No marks available yet.");
        }
      } catch (error) {
        toast.error("Failed to fetch marks.");
      }
    };

    fetchResult();
  }, [email]);

  return (
    <div className="result-container">
      <h2>Your Results</h2>

      {marks.length === 0 ? (
        <p className="no-data">No marks available.</p>
      ) : (
        <table className="result-table">
          <thead>
            <tr >
              <th style={{textAlign:"center"}}>Subject</th>
              <th style={{textAlign:"center"}}>Marks</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((subject, index) => (
              <tr key={index}>
                <td>{subject.subject}</td>
                <td>{subject.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Result;
