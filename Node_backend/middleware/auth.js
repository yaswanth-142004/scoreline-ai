const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = express.Router();

// 🔹 Student Signup
router.post("/student/signup", async (req, res) => {
    const { firstname, lastname, email, password, school, RollNO } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(400).json({ message: "Student already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ firstname, lastname, email, password: hashedPassword, RollNO, school });
        await newStudent.save();

        const token = jwt.sign({ id: newStudent._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({
  token,
  role: "student",
  RollNO: newStudent.RollNO,
  firstname: newStudent.firstname
});


    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Teacher Signup
router.post("/teacher/signup", async (req, res) => {
    const { firstname, lastname, email, password, subject, experience } = req.body;

    try {
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) return res.status(400).json({ message: "Teacher already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({ firstname, lastname, email, password: hashedPassword, subject, experience });
        await newTeacher.save();

        const token = jwt.sign({ id: newTeacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ token, role: "teacher" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Student Login
router.post("/student/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: "Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: "student" ,RollNO: student.RollNO,
            firstname: student.firstname,});

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 Teacher Login
router.post("/teacher/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(400).json({ message: "Teacher not found" });

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: "teacher",teacherName:teacher.firstname });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;








