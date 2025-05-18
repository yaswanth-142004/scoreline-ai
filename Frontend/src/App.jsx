import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import Upload from "./pages/Upload/Upload";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import Result from "./components/Result/Result";
import TeacherAbout from "./pages/TeacherAbout/TeacherAbout";
import StudentAbout from "./pages/StudentAbout/StudentAbout";
import ResultPage from "./pages/ResultPage/ResultPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to login page by default */}
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/teacher/Upload" element={<Upload />} />
        <Route path="/student/Result" element={<Result />} />
        <Route path="/teacher/About" element={<TeacherAbout />} />
        <Route path="/student/About" element={<StudentAbout />} />
        <Route path="/teacher/Result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
