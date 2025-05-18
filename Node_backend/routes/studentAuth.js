const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// Student Signup
router.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password, RollNO, school } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(400).json({ message: "Student already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({ firstname, lastname, email, password: hashedPassword, RollNO, school });
        await newStudent.save();

        const token = jwt.sign({ id: newStudent._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token, role: "student" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Student Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: "Student not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: "student" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
