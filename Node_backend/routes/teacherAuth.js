const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();

// Teacher Signup
router.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password, subject, experience } = req.body;

    try {
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) return res.status(400).json({ message: "Teacher already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({ firstname, lastname, email, password: hashedPassword, subject, experience });
        await newTeacher.save();

        const token = jwt.sign({ id: newTeacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token, role: "teacher" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Teacher Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(400).json({ message: "Teacher not found" });

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: "teacher" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
