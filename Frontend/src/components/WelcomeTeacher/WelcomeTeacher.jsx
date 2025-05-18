import React from "react";
import "./WelcomeTeacher.css";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const WelcomeTeacher = ({ teacherName }) => {
    return (
        <div className="welcome-container">
            <h2>{getGreeting()}, {teacherName || "Teacher"}!</h2>
            <h3>Keep your face to the sunshine and you cannot see a shadow</h3>
        </div>
    );
};

export default WelcomeTeacher;
