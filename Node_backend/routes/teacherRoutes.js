const express = require("express");
const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Fetch Teacher Profile using JWT Token
router.get("/profile", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const teacher = await Teacher.findById(decoded.id); // Get teacher from MongoDB using decoded ID

        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        res.json(teacher); // Return teacher profile
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Update Teacher Profile
router.put("/:id", async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });
        res.json({ message: "Profile updated successfully", updatedTeacher });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
