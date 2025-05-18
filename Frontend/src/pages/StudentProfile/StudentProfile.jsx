import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import "./StudentProfile.css";
import StudentNavbar from "../../components/StudentNavbar/StudentNavbar";
import ParticlesBackground1 from "../../components/ParticlesBackground1";
import Stars from "../../components/Star";

const StudentProfile = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        RollNO: "",
        school: ""
    });

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) {
            toast.error("Please login again.");
            navigate("/");
            return;
        }

        const fetchStudentProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`);
                setStudent(res.data);
                setFormData(res.data);
            } catch (error) {
                toast.error("Failed to fetch student details");
            }
        };

        fetchStudentProfile();
    }, [email, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/students/profile?email=${encodeURIComponent(email)}`, formData);
            toast.success("Profile updated successfully!");
            setStudent(formData);
            setEditMode(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (!student) return <p>Loading...</p>;

    return (
        <div className="dashboard-container">
            <Stars/>
            <StudentNavbar />
            <div className="profile-container">
                <FaUserCircle className="profile-icon" />
                <h2>Your Profile</h2>
                {!editMode ? (
                    <div className="profile-details">
                        <p><strong>First Name:</strong> {student.firstname}</p>
                        <p><strong>Last Name:</strong> {student.lastname}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Roll No:</strong> {student.RollNO}</p>
                        <p><strong>School:</strong> {student.school}</p>
                        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
                        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
                        <input type="email" name="email" value={formData.email} disabled />
                        <input type="text" name="RollNO" value={formData.RollNO} onChange={handleChange} disabled />
                        <input type="text" name="school" value={formData.school} onChange={handleChange} required />
                        <div className="button-group">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    </form>
                )}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default StudentProfile;
