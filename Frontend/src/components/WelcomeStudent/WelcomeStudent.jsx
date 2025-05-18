import React from "react";
import "./WelcomeStudent.css";

const WelcomeStudent = ({ name }) => {
    return (
        <div className="welcome-container">
            <h2>Welcome, {name || "Student"}! 🎓</h2>
            <p className="quote">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today." – Malcolm X</p>
        </div>
    );
};

export default WelcomeStudent;
