import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaInfoCircle, FaLifeRing, FaSignOutAlt, FaPoll } from "react-icons/fa"; // FaPoll for Result
import "./StudentNavbar.css"; // Import your student CSS
import logo from "../../assets/WhatsApp Image 2025-03-19 at 11.48.03_98917be6.jpg"; // Use your existing logo

const StudentNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/");
    };

    return (
        <div className="sidebar">
            {/* Sidebar Logo */}
            <div className="sidebar-logo">
                <img src={logo} alt="Logo" />
            </div>

            <ul className="nav-list">
                <li>
                    <NavLink to="/dashboard/student" className={({ isActive }) => (isActive ? "active-link" : "")}> 
                        <FaTachometerAlt className="icon" /> <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/student/profile" className={({ isActive }) => (isActive ? "active-link" : "")}> 
                        <FaUser className="icon" /> <span>Profile</span>
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/student/about" className={({ isActive }) => (isActive ? "active-link" : "")}> 
                        <FaInfoCircle className="icon" /> <span>About</span>
                    </NavLink>
                </li>
              
            </ul>

            {/* Footer Logout */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="icon" /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default StudentNavbar;
