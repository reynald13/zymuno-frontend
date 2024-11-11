import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/ResultPage.css";

const ResultPage = ({ onResetRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useParams(); // Extract role from URL
  const [matchingScore, setMatchingScore] = useState(null);
  const [error, setError] = useState(null);

  // Function to get the correct background image based on matchingScore
  const getBackgroundImage = (score) => {
    if (score < 60) return "/assets/result-1.png";
    if (score >= 70 && score <= 80) return "/assets/result-2.png";
    if (score > 80 && score <= 90) return "/assets/result-3.png";
    return ""; // Fallback if no score or score is undefined
  };

  useEffect(() => {
    const sessionId = location.state?.sessionId;

    if (!sessionId) {
      console.error("Session ID missing. Redirecting to home.");
      setError("Session ID is missing. Redirecting to the home page...");
      setTimeout(() => navigate(`/${role}`), 3000); // Redirect back to role
      return;
    }

    const fetchMatchingScore = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/sessions/results/${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results.");
        }

        const data = await response.json();
        setMatchingScore(data.matchingScore);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("An error occurred. Redirecting to the home page...");
        setTimeout(() => navigate(`/${role}`), 3000); // Redirect back to role
      }
    };

    fetchMatchingScore();
  }, [location.state, navigate, role]);

  const handleGoBack = () => {
    if (onResetRole) {
      onResetRole();
    }
    navigate(`/${role}`); // Go back to the role path
  };

  // Determine background image URL
  const backgroundImage =
    matchingScore !== null ? getBackgroundImage(matchingScore) : "";

  return (
    <div
      className="result-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <Header />
      <div className="result-content">
        {error ? (
          <p className="error-message">{error}</p>
        ) : matchingScore !== null ? (
          <>
          </>
        ) : (
          <p>Loading your results...</p>
        )}
        {!error && (
          <button className="back-button" onClick={handleGoBack}>
            Terima Kasih!
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
