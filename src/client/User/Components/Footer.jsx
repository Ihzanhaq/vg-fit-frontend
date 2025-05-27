import React from "react";
import "../Styles/Footer.css";
import { FaInstagram,FaWhatsapp,FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="blue-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img className="footer-img" src="/Assets/Images/vg-fit.png" alt="" />
        </div>

        <div className="footer-links">
          <Link to="/coaches" className="footer-link">
            Coaches
          </Link>
          <Link to="/celebrations" className="footer-link">
            Celebrations
          </Link>
          <Link to="/pricing" className="footer-link">
            Pricing
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>

        <div className="footer-social">
          <a href="https://www.instagram.com" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://web.whatsapp.com" className="social-icon">
            <FaWhatsapp />
          </a>
          <a href="https://www.facebook.com" className="social-icon">
            <FaFacebook />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VG-FIT. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy" className="legal-link">
            Privacy Policy
          </a>
          <a href="/terms" className="legal-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
