import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const TeacherAccuracyGraph = () => {
  const [graphData, setGraphData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Before ScoreLineAI (Physical Work)",
        data: [90, 85, 80, 78, 75],
        borderColor: "orange",
        backgroundColor: "rgba(255, 201, 76, 0.2)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "black",
        borderWidth: 3,
        tension: 0.4,
      },
      {
        label: "After ScoreLineAI (Reduced Workload)",
        data: [75, 60, 50, 40, 30],
        borderColor: "darkgreen",
        backgroundColor: "rgba(0, 255, 136, 0.2)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "black",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGraphData((prevData) => {
        const newBefore = prevData.datasets[0].data.map(val => val - Math.random() * 3);
        const newAfter = prevData.datasets[1].data.map(val => Math.max(10, val - Math.random() * 2));
        return {
          ...prevData,
          datasets: [
            { ...prevData.datasets[0], data: newBefore },
            { ...prevData.datasets[1], data: newAfter },
          ],
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        ticks: { color: "black" },
        grid: { color: "rgba(80, 5, 5, 0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "black" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: { color: "black", font: { size: 12 } },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "650px",
        padding: "10px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #E69A8D, #A3BCE4)",
        borderRadius: "10px",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ color: "black", textAlign: "center", fontSize: "1.1rem", marginBottom: "10px" }}>
        Impact of ScoreLineAI
      </h3>
      <div style={{ width: "100%", height: "250px" }}>
        <Line data={graphData} options={options} />
      </div>
    </div>
  );
};

export default TeacherAccuracyGraph;
