import React, { useEffect, useState } from "react";
import "../Styles/CelebrationsPage.css";
import AnimatedSection from "../Components/AnimatedSection";
import axios from "axios";

const Celebrations = () => {

  const [celebrations, setCelebrations] = useState([]);
  useEffect(() => {
    axios
      .get("https://vgfit-backend.onrender.com/api/celebrations")
      .then((res) => setCelebrations(res.data))
      .catch((err) => console.log("Failed to load celebrations"));
  });

    return (
      <div className="celebrations-page">
        {celebrations.map((event, eventIdx) => (
          <div key={eventIdx} className="celebration-section">
            <AnimatedSection>
              <h2 className="celebration-title">{event.title}</h2>
            </AnimatedSection>
            {event.images.map((img, imgIdx) => (
              <div
                key={imgIdx}
                className={`celebration-image-wrapper ${
                  imgIdx % 2 === 0 ? "left" : "right"
                }`}
              >
                <AnimatedSection>
                  <img
                    src={
                      img.startsWith("http")
                        ? img
                        : `https://vgfit-backend.onrender.com${img}`
                    }
                    alt={`${event.title} ${imgIdx + 1}`}
                  />
                </AnimatedSection>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
};

export default Celebrations;
