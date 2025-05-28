import React, { useState } from "react";
import "../Styles/CoachCard.css"; // Make sure your CSS is styled well

const CoachCard = ({ coach, position, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = position === "left";

  const imageUrl = coach.image
  return (
    <div
      className={`coach-card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {isLeft ? (
        <>
          <img
            src={imageUrl}
            alt={coach.name}
            className="coach-image"
          />
          <div className="coach-info">
            <h3>{coach.name}</h3>
            <p className="title">{coach.title}</p>
          </div>
        </>
      ) : (
        <>
          <div className="coach-info" style={{ marginRight: "20px" }}>
            <h3>{coach.name}</h3>
            <p className="title">{coach.title}</p>
          </div>
          <img
            src={imageUrl}
            alt={coach.name}
            className="coach-image"
          />
        </>
      )}
    </div>
  );
};
export default CoachCard
