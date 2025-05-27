import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/CoachDetails.css";
import { FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import AnimatedSection from "../Components/AnimatedSection";
import axios from "axios";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coachData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://vgfit-backend.onrender.com/api/coaches")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to load coach", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  const coach = coachData.find((c) => c.id === parseInt(id));
  if (!coach) return <div>Coach not found</div>;

  const currentIndex = coachData.findIndex((c) => c.id === parseInt(id));

  let nextCoach;
  if (coachData.length === 1) {
    nextCoach = coachData[0];
  } else if (currentIndex + 1 < coachData.length) {
    nextCoach = coachData[currentIndex + 1];
  } else {
    nextCoach = coachData[currentIndex - 1];
  }

  const handleClick = () => {
    navigate(`/coaches/${nextCoach.id}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };
  const DetailUrl = `https://vgfit-backend.onrender.com${coach.detailImage}`;
  const nextDetail = `https://vgfit-backend.onrender.com${nextCoach.detailImage}`;


  return (
    <div className="coach-details">
      <AnimatedSection>
        <div className="coach-image-container">
          <img src={DetailUrl} alt={coach.name} />
          <div className="coach-overlay">
            <h1>{coach.name}</h1>
            <p>{coach.title}</p>
          </div>
        </div>
      </AnimatedSection>

      <div className="coach-details-info">
        <AnimatedSection>
          <div className="coach-info-flex">
            <div className="coach-description">
              <h2>Description</h2>
              <p>{coach.description}</p>
            </div>
            <div className="coach-qualifications">
              <h2>Qualifications</h2>
              <ul>
                {coach.qualifications.map((q, index) => (
                  <li key={index}>
                    <span className="custom-bullet">🌀</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="coach-contact">
            <p>
              <strong>Phone:</strong> {coach.phone}
            </p>
            <a
              href={`https://wa.me/${coach.phone.replace(/\D/g, "")}`}
              className="whatsapp-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              Chat on WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <div className="next-coach-image-container">
          <img src={nextDetail} alt={nextCoach.name} />
          <div className="coach-overlay">
            <p className="next-label">Next</p>
            <h1>{nextCoach.name}</h1>
            <div className="next-button-container">
              <button className="next-round-button" onClick={handleClick}>
                <FiChevronDown />
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

export default CoachDetails;
