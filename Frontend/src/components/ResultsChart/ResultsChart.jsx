import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResultsChart.css"; // ✅ Styles for better UI

// ✅ Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ResultsChart = () => {
  const [marks, setMarks] = useState([]);
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
        } else {
          toast.info("No marks available yet.");
        }
      } catch (error) {
        toast.error("Failed to fetch marks.");
      }
    };

    fetchResults();
  }, []);

  if (marks.length === 0) {
    return <p className="no-data">No data available for visualization.</p>;
  }

  // 📌 Extract subjects and scores
  const subjects = marks.map((item) => item.subject);
  const scores = marks.map((item) => item.marks);

  // ✅ Pie Chart Data
  const pieData = {
    labels: subjects,
    datasets: [
      {
        data: scores,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"],
        hoverBackgroundColor: ["#ff4569", "#2e95d4", "#e6b500", "#37a2a2", "#7f57ff", "#d98e00"],
      },
    ],
  };

  // ✅ Bar Chart Data
  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Marks",
        data: scores,
        backgroundColor: "#36a2eb",
        borderColor: "#2e95d4",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="charts-container">
  <h3>📊 Marks Visualization</h3>
  <div className="chart-wrapper">
    <div className="chart-box pie">
      <h4>Marks Distribution</h4>
      <Pie data={pieData} />
    </div>
    <div className="chart-box">
      <h4>Subject Comparison</h4>
      <Bar data={barData} />
    </div>
  </div>
</div>
  );
};

export default ResultsChart;
