import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Add your styling for the animation

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirect to login page or desired route after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div className="home-page">
      <div className="loading-animation">
        {/* Add your animation or spinner here */}
        <div className="spinner"></div>
        <p>Loading the Quiz App...</p>
      </div>
    </div>
  );
};

export default HomePage;