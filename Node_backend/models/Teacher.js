const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subject: { type: [String], required: true }, // Store subjects as an array
    experience: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
