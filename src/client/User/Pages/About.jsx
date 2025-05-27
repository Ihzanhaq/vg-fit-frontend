import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/About.css";
import AnimatedSection from "../Components/AnimatedSection";

const About = () => {
  const [staff, setStaff] = useState([]);
  const [currentStaffIndex, setCurrentStaffIndex] = useState(0);

  useEffect(() => {
    axios
      .get("https://vgfit-backend.onrender.com/api/staff")
      .then((res) => setStaff(res.data))
      .catch((err) => console.log("Failed to load coaches", err));
  }, []);

  const nextStaff = () => {
    setCurrentStaffIndex((prev) =>
      prev === staff.length - 1 ? 0 : prev + 1
    );
  };

  const prevStaff = () => {
    setCurrentStaffIndex((prev) =>
      prev === 0 ? staff.length - 1 : prev - 1
    );
  };

  return (
    <div className="about-page">
      {/* Header Section */}
      <AnimatedSection>
        <div className="about-header">
          <h1>About VG-FIT</h1>
          <p className="about-subtitle">
            Your premier fitness destination since 2015
          </p>
        </div>
      </AnimatedSection>

      {/* Description Section */}
      <AnimatedSection>
        <div className="about-description">
          <div className="description-text">
            <h2>Our Mission</h2>
            <p>
              At VG-FIT, we're dedicated to helping you achieve your fitness
              goals through personalized training, state-of-the-art equipment,
              and a supportive community environment. Founded by Victor Garcia,
              our gym has transformed thousands of lives through our unique
              approach to health and wellness.
            </p>
            <p>
              Whether you're a beginner or an experienced athlete, our team of
              certified professionals is here to guide you every step of the
              way.
            </p>
          </div>
          <div className="description-image">
            <img
              src="/Assets/Images/vgfit-left.jpg"
              alt="VG-FIT Gym Interior"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Staff Carousel */}
      <AnimatedSection>
        <div className="staff-section">
          <h2>Meet Our Team</h2>
          <div className="staff-carousel-container">
            <div className="staff-carousel">
              <button className="carousel-button prev" onClick={prevStaff}>
                &lt;
              </button>

              <div className="staff-card">
                {staff.length > 0 && (
                  <>
                    <img
                      src={`https://vgfit-backend.onrender.com${staff[currentStaffIndex].image}`}
                      alt={staff[currentStaffIndex].name}
                    />
                    <div className="staff-info">
                      <h3>{staff[currentStaffIndex].name}</h3>
                      <p className="staff-role">
                        {staff[currentStaffIndex].role}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button className="carousel-button next" onClick={nextStaff}>
                &gt;
              </button>
            </div>
          </div>
          <div className="carousel-dots">
            {staff.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentStaffIndex ? "active" : ""}`}
                onClick={() => setCurrentStaffIndex(index)}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>
      
      {/* Gym Timings */}
      <AnimatedSection>
        <div className="timings-section">
          <h2>Opening Hours</h2>
          <div className="timings-card">
            <div className="timings-days">
              <p>Monday - Friday</p>
              <p>Saturday</p>
              <p>Sunday</p>
            </div>
            <div className="timings-hours">
              <p>5:00 AM - 11:00 PM</p>
              <p>7:00 AM - 9:00 PM</p>
              <p>8:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* New Branch Section */}
      <AnimatedSection>
        <div className="new-branch">
          <div className="branch-image">
            <img
              src="/Assets/Images/gym-home-fallback.jpg"
              alt="VG-FIT New Branch Under Construction"
            />
            <div className="construction-badge">COMING SOON</div>
          </div>
          <div className="branch-info">
            <h2>Expanding Our Reach</h2>
            <p>
              We're excited to announce our second location in the downtown
              area, currently under construction and scheduled to open in early
              2024.
            </p>
            <p>The new 15,000 sqft facility will feature:</p>
            <ul>
              <li>Olympic-sized swimming pool</li>
              <li>Expanded group fitness studios</li>
              <li>Premium recovery lounge</li>
              <li>On-site sports nutrition bar</li>
            </ul>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default About;
