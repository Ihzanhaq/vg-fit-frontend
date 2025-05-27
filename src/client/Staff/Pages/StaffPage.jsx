import React, { useEffect, useState } from "react";
import "../Styles/StaffPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import ManagePricing from "./ManagePricing";
import ManageCelebrations from "./ManageCelebrations";
import ManageCoach from "./ManageCoach";
import StaffContact from "./StafffContact";
import ManageStaff from "./ManageStaff";
import ManageTransformations from "./ManageTransformations";

const StaffPage = () => {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("staffActiveSection") || "pricing";
  });
  useEffect(() => {
    localStorage.setItem("staffActiveSection", activeSection);
  }, [activeSection]);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/staff");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/staff");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "pricing":
        return <ManagePricing />;
      case "celebrations":
        return <ManageCelebrations />;
      case "coaches":
        return <ManageCoach />;
      case "messages":
        return <StaffContact />;
      case "staff":
        return <ManageStaff />;
      case "transformations":
        return <ManageTransformations />;

      default:
        return <h2>Welcome to Staff Panel</h2>;
    }
  };

  return (
    <div className="staff-page">
      {/* Hamburger */}
      <button
        className="hamburger-staff"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="bar-staff"></div>
        <div className="bar-staff"></div>
        <div className="bar-staff"></div>
      </button>

      {/* Sidebar */}
      <aside
        className={`staff-sidebar ${isMenuOpen ? "active" : "not-active"}`}
      >
        <button
          onClick={() => {
            setActiveSection("pricing");
            setIsMenuOpen(false);
          }}
        >
          Pricing
        </button>
        <button
          onClick={() => {
            setActiveSection("celebrations");
            setIsMenuOpen(false);
          }}
        >
          Celebrations
        </button>
        <button
          onClick={() => {
            setActiveSection("coaches");
            setIsMenuOpen(false);
          }}
        >
          Coaches
        </button>
        <button
          onClick={() => {
            setActiveSection("messages");
            setIsMenuOpen(false);
          }}
        >
          Messages
        </button>
        <button
          onClick={() => {
            setActiveSection("staff");
            setIsMenuOpen(false);
          }}
        >
          Staff
        </button>
        <button
          onClick={() => {
            setActiveSection("transformations");
            setIsMenuOpen(false);
          }}
        >
          Transformations
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="staff-content">{renderSection()}</main>
    </div>
  );
};

export default StaffPage;
