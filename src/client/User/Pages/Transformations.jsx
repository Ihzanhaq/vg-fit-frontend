import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Transformations.css";

const Transformations = () => {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        const response = await axios.get(
          "https://vgfit-backend.onrender.com/api/transformations"
        );
        setTransformations(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load transformations");
        setLoading(false);
      }
    };

    fetchTransformations();
  }, []);

  const openImageOverlay = (transformation, isBeforeImage) => {
    setSelectedImage({
      url: isBeforeImage
        ? `https://vgfit-backend.onrender.com${transformation.beforeImage}`
        : `https://vgfit-backend.onrender.com${transformation.afterImage}`,
      name: transformation.name,
      type: isBeforeImage ? "Before" : "After",
    });
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedImage(null);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-transformations">
      {/* Image Overlay */}
      {isOverlayOpen && selectedImage && (
        <div className="image-overlay" onClick={closeOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeOverlay}>
              &times;
            </button>
            <div className="overlay-image-container">
              <img
                src={selectedImage.url}
                alt={`${selectedImage.name} ${selectedImage.type}`}
                className="overlay-image"
              />
            </div>
            <div className="overlay-caption">
              <h3>{selectedImage.name}</h3>
              <p>{selectedImage.type} Transformation</p>
            </div>
          </div>
        </div>
      )}

      <div className="transformations-container">
        <div className="transformations-header">
          <h1>VG-FIT Transformations</h1>
          <p>Real Members. Real Results.</p>
        </div>

        <div className="transformations-grid">
          {transformations.map((transformation) => (
            <div key={transformation._id} className="transformation-card">
              <div className="image-comparison">
                <div
                  className="image-wrapper before"
                  onClick={() => openImageOverlay(transformation, true)}
                >
                  <img
                    src={`https://vgfit-backend.onrender.com${transformation.beforeImage}`}
                    alt={`${transformation.name} before transformation`}
                  />
                  <div className="image-label">Before</div>
                </div>
                <div
                  className="image-wrapper after"
                  onClick={() => openImageOverlay(transformation, false)}
                >
                  <img
                    src={`https://vgfit-backend.onrender.com${transformation.afterImage}`}
                    alt={`${transformation.name} after transformation`}
                  />
                  <div className="image-label">After</div>
                </div>
              </div>
              <div className="transformation-details">
                <h3>{transformation.name}</h3>
                <p className="duration">{transformation.duration} Journey</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transformations;
