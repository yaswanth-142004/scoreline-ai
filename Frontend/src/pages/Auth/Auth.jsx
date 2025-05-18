import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import "./Auth.css"; // Styling file
import ParticlesBackground from "../../components/ParticlesBackground";

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Signup
    const [role, setRole] = useState("student"); // Ensure role is set
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        RollNO: "",
        school: "",
        subject: "",
        experience: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role) {
            toast.error("Please select a role (Student or Teacher)!");
            return;
        }

        try {
            // ✅ Ensure `role` is included in the API URL
            const url = isLogin
                ? `http://localhost:5000/auth/${role}/login` 
                : `http://localhost:5000/auth/${role}/signup`; // Added '/login' for login case

            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : role === "student"
                ? { firstname: formData.firstname, lastname: formData.lastname, email: formData.email, password: formData.password, RollNO: formData.RollNO, school: formData.school }
                : { firstname: formData.firstname, lastname: formData.lastname, email: formData.email, password: formData.password, subject: formData.subject.split(","), experience: formData.experience };

            const res = await axios.post(url, payload);
            console.log("✅ Response from backend:", res.data);
            const rollNo = res.data.RollNO;
            console.log("🚀 Redirecting to:", `/dashboard/student/${rollNo}`);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("teacherName", res.data.teacherName);
            localStorage.setItem("role", role);
            localStorage.setItem("email", formData.email);  // Saving email to localStorage
            if (isLogin) {
                toast.success("Login successful! Redirecting... 🚀");
                setTimeout(() => {
                    navigate(role === "teacher" ? `/dashboard/teacher` : `/dashboard/student`);
                }, 2000);
            } else {
                toast.success("Signup successful! Please login. ✅");
                setIsLogin(true); // Switch to login after signup
            }
        } catch (error) {
            toast.error(error.response?.data?.message || (isLogin ? "Login failed ❌" : "Signup failed ❌"));
        }
    };

    return (
        <div className="auth-container">
            <ParticlesBackground/>
            <div className="auth-left">
                <h1>Welcome to Scoreline AI</h1>
                <p>Your Intelligent Exam & Answer Evaluation Platform.</p>
            </div>
            <div></div>
            <div className={`auth-right ${isLogin ? "login-mode" : "signup-mode"}`}>
                <h2>{isLogin ? "Login" : "Signup"}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
                            <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
                        </>
                    )}

                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

                    <select name="role" onChange={(e) => setRole(e.target.value)} value={role} required>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>

                    {!isLogin && (
                        <>
                            {role === "student" ? (
                                <>
                                    <input type="text" name="RollNO" placeholder="Roll Number" onChange={handleChange} required />
                                    <input type="text" name="school" placeholder="School Name/College Name" onChange={handleChange} required />
                                </>
                            ) : (
                                <>
                                    <input type="text" name="subject" placeholder="Subjects (comma-separated)" onChange={handleChange} required />
                                    <input type="number" name="experience" placeholder="Years of Experience" onChange={handleChange} required />
                                </>
                            )}
                        </>
                    )}

                    <button type="submit">{isLogin ? "Login" : "Signup"}</button>
                </form>

                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Sign up" : "Login"}</span>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Auth;






