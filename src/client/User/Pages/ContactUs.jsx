import React, { useState } from "react";
import "../Styles/ContactUs.css";
import AnimatedSection from "../Components/AnimatedSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState(""); 

  const phoneRegex = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "phone" && phoneRegex.test(value)) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await fetch("https://vgfit-backend.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", phone: "", message: "" });
      } else {
        toast.error("Failed to send message. Try again later.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="contact-container">
      <ToastContainer />
      <div className="contact-section">
        <AnimatedSection>
          <h2>Contact Us</h2>
          <p className="section-description">
            Have any questions or need assistance? Feel free to reach out to us
            using the form below.
          </p>
        </AnimatedSection>
        <form onSubmit={handleSubmit} className="contact-form">
          <AnimatedSection>
            <div className="form-field">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="form-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
              {error && <span className="error-message">{error}</span>}
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Enter your message"
              />
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </AnimatedSection>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
