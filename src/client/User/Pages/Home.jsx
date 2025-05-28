import React, { useEffect, useRef, useState } from "react";
import "../Styles/Home.css";
import AnimatedSection from "../Components/AnimatedSection";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const videoRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const quoteRef = useRef(null);
  const [teamMembers,setTeamMembers]= useState([])
  const [reviews, setReviews] = useState([]);



  useEffect(()=>{
    axios.get("https://vgfit-backend.onrender.com/api/reviews")
    .then((res)=> setReviews(res.data))
    .catch((err)=> console.log("Failed to load reviews",err));
  },[]);

  useEffect(()=>{
    axios.get("https://vgfit-backend.onrender.com/api/coaches")
    .then((res)=> setTeamMembers(res.data))
    .catch((err) => console.log("Failed to load coaches",err));
  },[])

  const googleMapsLink = "https://g.co/kgs/sqmK1qx";

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + teamMembers.length) % teamMembers.length
    );
  };
  const toggleExpand = (id) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...review, expanded: !review.expanded } : review
      )
    );
  };


  // Video playback logic
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.log("Video play failed:", error);
        });
      }
    };

    playVideo();

    const handleFirstInteraction = () => {
      playVideo();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  // Image parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      if (leftImgRef.current) {
        leftImgRef.current.style.transform = `translateY(${
          -scrollPosition * 0.15
        }px)`;
      }

      if (rightImgRef.current) {
        rightImgRef.current.style.transform = `translateY(${
          scrollPosition * 0.25
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();
  const onHandleClick = (coachId)=>{
    navigate(`/coaches/${coachId}`);
  }
  

  return (
    <div className="home-container">
      {/* Video Background Section */}
      <AnimatedSection>
        <div className="video-background">
          <div className="video-blur-overlay"></div>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
          >
            <source src="/Assets/Videos/gym-home.mp4" type="video/mp4" />
            <img
              src={`${process.env.PUBLIC_URL}/Assets/Images/gym-home-fallback.jpg`}
              alt="Healthy lifestyle background"
            />
          </video>
          <div className="video-text-overlay">
            <h1 className="main-video-text">BE FIT WITH VG FIT</h1>
            <p className="sub-video-text">VG-FIT Fitness Studio by Biju K R</p>
          </div>
        </div>
      </AnimatedSection>

      <section className="vgfit-content-section">
        <div className="vgfit-image-container">
          <div className="vgfit-left-image-wrapper">
            <img
              ref={leftImgRef}
              src="/Assets/Images/vgfit-left.jpg"
              alt="VG-Fit gym facility"
              className="vgfit-left-image"
            />
          </div>
          <div className="vgfit-right-image-wrapper">
            <img
              ref={rightImgRef}
              src="/Assets/Images/vgfit-right.jpg"
              alt="VG-Fit trainer session"
              className="vgfit-right-image"
            />
          </div>
        </div>
        <AnimatedSection>
          <div className="vgfit-text-content">
            <h2>Why Choose VG-Fit?</h2>

            <div className="vgfit-highlight">
              <h3>World-Class Facilities</h3>
              <p>
                Our 10,000 sqft space features cutting-edge equipment, dedicated
                functional zones, and premium amenities to support every fitness
                journey.
              </p>
            </div>

            <div className="vgfit-trainers">
              <h3>Expert Training Team</h3>

              <p>Certified professional coaches</p>
              <p>Personalized program design</p>
              <p>Nutrition guidance included</p>
              <p>24/7 member support</p>
            </div>
          </div>
        </AnimatedSection>
      </section>
      <section>
        <div className="vg-quote">
          <AnimatedSection>
            <p ref={quoteRef}>VG-FIT FITNESS STUDIO</p>
          </AnimatedSection>
        </div>
      </section>
      <AnimatedSection>
        <section className="team-section">
          <h2 className="team-title">BUILD YOUR STRONGEST SELF</h2>

          <div className="team-carousel">
            <button className="carousel-button prev" onClick={prevSlide}>
              &lt;
            </button>
            <AnimatedSection>
              <div className="team-cards-container">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`team-card ${
                      index === currentIndex ? "active" : ""
                    }`}
                    onClick={() => onHandleClick(member.id)}
                  >
                    <div className="team-image-container">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="team-image"
                      />
                    </div>
                    <div className="team-text-content">
                      <h3 className="team-name">{member.name}</h3>
                      <p className="team-role">{member.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <button className="carousel-button next" onClick={nextSlide}>
              &gt;
            </button>
          </div>

          <div className="carousel-dots">
            {teamMembers.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </section>
      </AnimatedSection>
      <AnimatedSection>
        <section className="reviews-section-blue">
          <div className="reviews-header-container">
            <div>
              <h2 className="section-title-blue">Google Reviews</h2>
            </div>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="google-maps-button"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKp1qP0RCeLiSJeV6VAvUd1FyA7CgFOW51hA&s"
                alt="Google Maps"
                className="google-maps-icon"
              />
              View on Google Maps
            </a>
          </div>
          <AnimatedSection>
            <div className="reviews-container-blue">
              {reviews.map((review) => (
                <div key={review.id} className="review-card-blue">
                  <div className="review-rating-blue">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="review-text-blue">
                    {review.expanded
                      ? review.text
                      : `${review.text.substring(0, 100)}`}
                    {review.text.length > 100 && (
                      <button
                        className="read-more-blue"
                        onClick={() => toggleExpand(review.id)}
                      >
                        {review.expanded ? "Read less" : "Read more"}
                      </button>
                    )}
                  </p>
                  <div className="review-footer-blue">
                    <span className="google-icon-blue">Google</span>
                    <span className="review-author-blue">{review.author}</span>
                    <span className="review-date-blue">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Home;
