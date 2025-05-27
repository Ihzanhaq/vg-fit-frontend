import React, { useEffect, useState } from "react";
import "../Styles/PageLoader.css";

const PageLoader = () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 1000); // 1s animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-loader ${hide ? "hide" : ""}`}>
      <div className="slide-animation"></div>
    </div>
  );
};

export default PageLoader;
