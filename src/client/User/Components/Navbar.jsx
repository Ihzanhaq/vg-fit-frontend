import React, { useEffect, useState } from "react";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(()=>{
    const handleScrolled = () =>{
      if(window.scrollY>50){
        setIsScrolled(true)
      }
      else{
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll',handleScrolled)
    return ()=> window.removeEventListener('scroll',handleScrolled)
  },[])
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo-container">
        <Link to="/">
          <img
            src="/Assets/Images/vg-fit.png"
            alt="Logo"
            className="logo-img"
          />{" "}
        </Link>
      </div>

      <div className={`nav-content ${isMenuOpen ? "active" : ""}`}>
        <div className="nav-links">
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/coaches" className="nav-link" onClick={closeMenu}>
            Coaches
          </Link>
          <Link to="/transformation" className="nav-link" onClick={closeMenu}>
            Transformations
          </Link>
          <Link to="/celebrations" className="nav-link" onClick={closeMenu}>
            Celebrations
          </Link>
          <Link to="/pricing" className="nav-link" onClick={closeMenu}>
            Pricing
          </Link>
          <Link to="/about" className="nav-link" onClick={closeMenu}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            Contact Us
          </Link>
        </div>
      </div>

      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`bar ${isMenuOpen ? "active" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "active" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "active" : ""}`}></div>
      </button>
    </nav>
  );
};

export default Navbar;
