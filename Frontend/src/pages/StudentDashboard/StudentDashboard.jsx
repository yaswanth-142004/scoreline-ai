// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./StudentDashboard.css";
// import StudentNavbar from "../../components/StudentNavbar/StudentNavbar";
// import Result from "../../components/Result/Result";
// import WelcomeStudent from "../../components/WelcomeStudent/WelcomeStudent";  // ✅ Import new component
// import ResultsChart from "../../components/ResultsChart/ResultsChart";
// import FocusSuggestion from "../../components/FocusSuggestion/FocusSuggestion";

// const StudentDashboard = () => {
//     const [studentName, setStudentName] = useState("");
//     const [student, setStudent] = useState(null);
//     const email = localStorage.getItem("email");

//     useEffect(() => {
//         if (!email) {
//             toast.error("No email found. Please login again.");
//             return;
//         }

//         const fetchStudentProfile = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`);
//                 setStudent(res.data);
//                 setStudentName(res.data.firstname);
//             } catch (error) {
//                 toast.error("Failed to fetch student details");
//             }
//         };

//         fetchStudentProfile();
//     }, [email]);

//     return (
//         <div className="dashboard-container">
//             <StudentNavbar className="student-navbar"/>
//             <div className="dashboard-content">
//                 <WelcomeStudent name={studentName} />  {/* ✅ Use new component */}
//                 <div><Result /></div>
//                 <ResultsChart/>
//                 <FocusSuggestion/>
//             </div>
//             <ToastContainer position="top-right" autoClose={3000} />
//         </div>
//     );
// };

// export default StudentDashboard;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StudentDashboard.css";

import StudentNavbar from "../../components/StudentNavbar/StudentNavbar";
import WelcomeStudent from "../../components/WelcomeStudent/WelcomeStudent";
import Result from "../../components/Result/Result";
import ResultsChart from "../../components/ResultsChart/ResultsChart";
import FocusSuggestion from "../../components/FocusSuggestion/FocusSuggestion";
import ParticlesBackground from "../../components/ParticlesBackground";

const StudentDashboard = () => {
    const [studentName, setStudentName] = useState("");
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) {
            toast.error("No email found. Please login again.");
            return;
        }

        const fetchStudentProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`);
                setStudentName(res.data.firstname);
            } catch (error) {
                toast.error("Failed to fetch student details");
            }
        };

        fetchStudentProfile();
    }, [email]);

    return (
        <div className="student-dashboard-container">
            <ParticlesBackground />
            {/* Sidebar */}
            <div className="student-sidebar">
                <StudentNavbar />
            </div>

            {/* Main Content that shifts */}
            <div className="student-dashboard-content">
                <h1>Scoreline_AI</h1>

                <div className="student-top-section">
                    <WelcomeStudent name={studentName} />
                    <ResultsChart />
                </div>

                <div className="student-bottom-section">
                   <div className="result">
                   <Result /></div> 
                    <FocusSuggestion />
                </div>

                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default StudentDashboard;
