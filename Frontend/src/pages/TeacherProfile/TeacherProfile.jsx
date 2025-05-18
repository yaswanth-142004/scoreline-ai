import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import React Icon
import "./TeacherProfile.css"; // Styling file
import TeachersNavbar from "../../components/TeachersNavbar/TeachersNavbar";
import ParticlesBackground1 from "../../components/ParticlesBackground1";
import Stars from "../../components/Star";

const TeacherProfile = () => {
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        experience: ""
    });

    // Get token from localStorage for Authorization header
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        // Fetch teacher profile using the JWT token
        const fetchTeacherProfile = async () => {
            try {
                // Sending token in Authorization header
                const res = await axios.get("http://localhost:5000/api/teachers/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setTeacher(res.data); // Set teacher data to state
                setFormData(res.data); // Pre-fill form fields with the fetched teacher data
            } catch (error) {
                toast.error("Failed to fetch teacher details");
            }
        };

        fetchTeacherProfile();
    }, [token, navigate]);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Form Submission for updating profile
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update teacher profile
            await axios.put(`http://localhost:5000/api/teachers/${teacher._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Profile updated successfully!");
            setTeacher(formData); // Update the local state with new data
            setEditMode(false); // Switch to view mode
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (!teacher) return <p>Loading...</p>; // If teacher data is not loaded yet, show loading state

    return (
        <div className="dashboard-container">
            <Stars/>
            <TeachersNavbar />
            <div className="profile-container">
                
                {/* Profile Icon */}
                <FaUserCircle className="profile-icon" />

                <h2>Your Profile</h2>
                {!editMode ? (
                    <div className="profile-details" >
                        <p><strong  className="profilename">First Name:</strong> {teacher.firstname}</p>
                        <p><strong className="profilename">Last Name:</strong> {teacher.lastname}</p>
                        <p><strong className="profilename">Email:</strong> {teacher.email}</p>
                        <p><strong className="profilename">Subjects:</strong> {teacher.subject.join(", ")}</p>
                        <p><strong className="profilename">Experience:</strong> {teacher.experience} years</p>
                        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                        />
                        <div className="button-group">
                            <button type="submit" className="save-btn">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default TeacherProfile;
