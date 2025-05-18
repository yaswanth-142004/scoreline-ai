import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaInfoCircle, FaLifeRing, FaSignOutAlt, FaBook } from "react-icons/fa"; // ✅ Import FaBook for Upload
import "./TeachersNavbar.css"; // Import CSS for styling
import logo from "../../assets/WhatsApp Image 2025-03-19 at 11.48.03_98917be6.jpg"; // ✅ Import your logo
import { FaRegChartBar } from "react-icons/fa";

const TeachersNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div className="sidebar">
            {/* ✅ Sidebar Logo */}
            <div className="sidebar-logo">
                <img src={logo} alt="Logo" />
            </div>

            <ul className="nav-list">
                <li>
                    <NavLink to="/dashboard/teacher" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        <FaTachometerAlt className="icon" /> <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/teacher/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        <FaUser className="icon" /> <span>Profile</span>
                    </NavLink>
                </li>
                {/* ✅ New Upload Link */}
                <li>
                    <NavLink to="/teacher/upload" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        <FaBook className="icon" /> <span>Upload</span>
                    </NavLink>
                </li>

                <li>
  <NavLink to="/teacher/result" className={({ isActive }) => (isActive ? "active-link" : "")}>
    <FaRegChartBar className="icon" /> <span>Result</span>
  </NavLink>
</li>

                <li>
                    <NavLink to="/teacher/about" className={({ isActive }) => (isActive ? "active-link" : "")}>
                        <FaInfoCircle className="icon" /> <span>About</span>
                    </NavLink>
                </li>
        
            </ul>

            {/* ✅ Footer (Logout Button) */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="icon" /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default TeachersNavbar;
