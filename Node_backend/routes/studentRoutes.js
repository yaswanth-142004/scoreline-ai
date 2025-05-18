// const express = require("express");
// const router = express.Router();
// const Student = require("../models/Student");

// // Fetch student profile by roll number
// router.get("/profile/:rollNo", async (req, res) => {
//   try {
//     const student = await Student.findOne({ RollNO: req.params.rollNo }).select("-password");
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.json(student); // Return student profile including marks
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update student details (to edit profile)
// router.put("/profile/:rollNo", async (req, res) => {
//   try {
//     const student = await Student.findOneAndUpdate(
//       { RollNO: req.params.rollNo },
//       { $set: req.body },
//       { new: true }
//     );
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.json({ message: "Profile updated successfully", student });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Upload marks for a student (by roll number)
// router.put("/uploadMarks/:rollNo", async (req, res) => {
//     const { rollNo } = req.params;
//     const { marks } = req.body;
  
//     // ⛔ Check if marks is actually an array
//     if (!Array.isArray(marks)) {
//       return res.status(400).json({ message: "Invalid marks format. Must be an array." });
//     }
  
//     try {
//       const student = await Student.findOne({ RollNO: rollNo });
  
//       if (!student) {
//         return res.status(404).json({ message: "Student not found" });
//       }
  
//       marks.forEach((subjectMark) => {
//         const existingSubject = student.marks.find(
//           (subject) => subject.subject === subjectMark.subject
//         );
  
//         if (existingSubject) {
//           existingSubject.marks = subjectMark.marks;
//         } else {
//           student.marks.push({
//             subject: subjectMark.subject,
//             marks: subjectMark.marks,
//           });
//         }
//       });
  
//       await student.save();
//       res.json({ message: "Marks uploaded successfully", student });
//     } catch (error) {
//       console.error("❌ Error uploading marks:", error);
//       res.status(500).json({ message: "Error uploading marks", error: error.message });
//     }
//   });
  

// module.exports = router;


const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Fetch student profile by roll number
// router.get("/profile/:rollNo", async (req, res) => {
//   try {
//     const student = await Student.findOne({ RollNO: req.params.rollNo }).select("-password");
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.json(student);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// ✅ Fetch student profile by email (alternative)
router.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const student = await Student.findOne({ email }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// // ✅ Update student profile by roll number
// router.put("/profile/:rollNo", async (req, res) => {
//   try {
//     const student = await Student.findOneAndUpdate(
//       { RollNO: req.params.rollNo },
//       { $set: req.body },
//       { new: true }
//     );
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.json({ message: "Profile updated successfully", student });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });



// ✅ Update student profile by email
router.put("/profile", async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const student = await Student.findOneAndUpdate(
        { email },
        { $set: req.body },
        { new: true }
      );
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json({ message: "Profile updated successfully", student });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

// ✅ Upload or update marks for a student by roll number
router.put("/uploadMarks/:rollNo", async (req, res) => {
  const { rollNo } = req.params;
  const { marks } = req.body;

  if (!Array.isArray(marks)) {
    return res.status(400).json({ message: "Invalid marks format. Must be an array." });
  }

  try {
    const student = await Student.findOne({ RollNO: rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    marks.forEach((subjectMark) => {
      const existingSubject = student.marks.find(
        (subject) => subject.subject === subjectMark.subject
      );

      if (existingSubject) {
        existingSubject.marks = subjectMark.marks;
      } else {
        student.marks.push({
          subject: subjectMark.subject,
          marks: subjectMark.marks,
        });
      }
    });

    await student.save();
    res.json({ message: "Marks uploaded successfully", student });
  } catch (error) {
    console.error("❌ Error uploading marks:", error);
    res.status(500).json({ message: "Error uploading marks", error: error.message });
  }
});

module.exports = router;