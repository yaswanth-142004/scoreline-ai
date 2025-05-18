import React, { useEffect, useState } from "react";
import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TeacherDashboard.css";
import WelcomeTeacher from "../../components/WelcomeTeacher/WelcomeTeacher";
import TeacherAccuracyGraph from "../../components/TeacherAccuracyGraph/TeacherAccuracyGraph";
import UpcomingEvents from "../../components/UpcomingEvents/UpcomingEvents";
import StudentProgressTracker from "../../components/StudentProgressTracker/StudentProgressTracker";
import ParticlesBackground from "../../components/ParticlesBackground";

const TeacherDashboard = () => {
    const [teacherName, setTeacherName] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            toast.error("Please login again.");
            return;
        }

        const fetchTeacherName = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/teachers/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeacherName(res.data.firstname);
            } catch (error) {
                toast.error("Failed to fetch teacher details");
            }
        };

        fetchTeacherName();
    }, [token]);

    return (
        <div className="dashboard-container">
            <ParticlesBackground/>
            {/* Sidebar */}
            
            <div className="sidebar">
                <TeachersNavbar />
            </div>

            {/* Main Content that Moves with Sidebar */}
            <div className="dashboard-content">
                <h1>Scoreline_AI</h1>
                <div className="top-section">
                    <WelcomeTeacher teacherName={teacherName} />
                    
                    <TeacherAccuracyGraph />
                </div>

                <div className="bottom-section">
                    <StudentProgressTracker/>
                    <UpcomingEvents />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
