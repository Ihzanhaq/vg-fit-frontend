import { useEffect, useState } from "react";
import AnimatedSection from "../Components/AnimatedSection";
import CoachCard from "../Components/CoachCard";
import "../Styles/Coaches.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Coaches = () => {
  
  const navigate = useNavigate();

  const handleCoachClick = (coachId)=>{
    navigate(`/coaches/${coachId}`);
  }

  const [coaches,setCoach] = useState([])

  useEffect(()=>{
    axios.get("https://vgfit-backend.onrender.com/api/coaches")
    .then((res)=>setCoach(res.data))
    .catch((err)=>console.log("Failed to load coaches",err));
  })
  return (
    <div className="coaches-page">
      <h1>Our Coaches</h1>
      <div className="coaches-grid">
        {coaches.map((coach, index) => (
          <div
            key={coach.id}
            className={`coach-container ${index % 2 === 0 ? "left" : "right"}`}
          >
            <AnimatedSection>
              <CoachCard
                coach={coach}
                position={index % 2 === 0 ? "left" : "right"}
                onClick={()=>handleCoachClick(coach.id)}
              />
            </AnimatedSection>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coaches;
