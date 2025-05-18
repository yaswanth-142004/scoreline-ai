import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import "./StudentProgressTracker.css";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StudentProgressTracker = () => {
    const animationOptions = {
        animation: {
            duration: 1500,
            easing: "easeInOutQuart",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#fff",
                    boxWidth: 12,
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const topPerformersData = {
        labels: ["Ankit", "Khushi", "Harsh"],
        datasets: [
            {
                data: [95, 88, 90],
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
            },
        ],
    };

    const studentsNeedingAttentionData = {
        labels: ["Khushi", "Harsh"],
        datasets: [
            {
                label: "Performance (%)",
                data: [50, 60],
                backgroundColor: ["#FF5722", "#FFC107"],
            },
        ],
    };

    const assignmentCompletionRate = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [75, 25],
                backgroundColor: ["#4CAF50", "#FF5722"],
            },
        ],
    };

    return (
        <div className="progress-tracker">
            <h2>📊 Progress Tracker</h2>
            <div className="chart-container">
                <div className="containchart">
                <div className="chart-box small pie" >
                    <h4>Performance</h4>
                    <div className="chart-wrapper ">
                        <Pie data={topPerformersData} options={animationOptions} />
                    </div>
                </div>
                <div className="chart-box small assignment ">
                   
                   
                    <h4>Assignment</h4>
                    <div className="chart-wrapper ">
                        <Doughnut data={assignmentCompletionRate} options={animationOptions} />
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    );
};

export default StudentProgressTracker;
