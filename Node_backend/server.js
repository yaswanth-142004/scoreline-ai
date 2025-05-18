require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const teacherAuthRoutes = require("./routes/teacherAuth");
const studentAuthRoutes = require("./routes/studentAuth");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
 // Added teacherRoutes to handle profile fetching

const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Use the routes for teacher and student authentication
app.use("/auth/teacher", teacherAuthRoutes); // Teacher authentication routes
app.use("/auth/student", studentAuthRoutes); // Student authentication routes

// Use the routes for teacher profile management
app.use("/api/teachers", teacherRoutes); // Routes for teacher's profile CRUD (view, update, etc.)
app.use("/api/students", studentRoutes);

// Default route to check if the server is running
app.get("/", (req, res) => {
    res.send("🚀 Server is up and running!");
});

// Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
