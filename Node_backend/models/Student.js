// const mongoose = require("mongoose");

// const StudentSchema = new mongoose.Schema({
//    firstname: { type: String, required: true },
//    lastname: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     RollNO: { type: String, required: true },  
//     school: { type: String, required: true }, // School Name
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Student", StudentSchema);


const mongoose = require("mongoose");

const SubjectMarksSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  marks: { type: Number, required: true } // 👈 you’re using "marks" now instead of "score"
});

const StudentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  RollNO: { type: String, required: true },
  school: { type: String, required: true },
  marks: [SubjectMarksSchema], // ✅ List of subjects with marks
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", StudentSchema);
