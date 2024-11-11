import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuizQuestion from "../pages/QuizQuestion";
import "../styles/QuizPage.css";

const QuizPage = ({ role, sessionId, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [polling, setPolling] = useState(false); // Track polling status
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false); // State to control the spinner

  // Restore state on refresh
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const storedSessionId = sessionStorage.getItem("sessionId");
    const storedUserId = sessionStorage.getItem("userId");

    if (!role && storedRole) {
      navigate(`/${storedRole}`, { replace: true });
    }

    if (!sessionId && storedSessionId) {
      sessionStorage.setItem("sessionId", storedSessionId);
    }

    if (!userId && storedUserId) {
      sessionStorage.setItem("userId", storedUserId);
    }
  }, [role, sessionId, userId, navigate]);

  // Utility: Shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch and randomize questions
  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const preResponse = await fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/questions?role=${role.toLowerCase()}&type=pre-question`
      );
      const mainResponse = await fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/api/questions?role=${role.toLowerCase()}&type=main-question`
      );

      if (!preResponse.ok || !mainResponse.ok) {
        throw new Error("Failed to fetch questions.");
      }

      const preQuestions = await preResponse.json();
      const mainQuestions = await mainResponse.json();

      const combinedQuestions = [
        ...shuffleArray(preQuestions.questions || []),
        ...shuffleArray(mainQuestions.questions || []),
      ];

      if (combinedQuestions.length === 0) {
        setApiError("No questions available.");
      }

      setQuestions(combinedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      setApiError("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!sessionId || !userId) {
      navigate("/", { replace: true });
    } else {
      fetchQuestions();
    }
  }, [fetchQuestions, sessionId, userId, navigate]);

  // Submit answers to the backend
  const submitAnswers = async (allAnswers) => {
    try {
      if (!sessionId || !userId || allAnswers.length === 0) {
        throw new Error("Session ID, User ID, and answers are required.");
      }

      // Activate the spinner
      setIsSubmitting(true);

      const payload = {
        sessionId,
        userId,
        answers: allAnswers.map((q) => ({
          questionId: q._id,
          answer: q.answer,
        })),
      };

      console.log("Submitting answers payload:", payload);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit answers.");
      }

      const data = await response.json();
      console.log("Answers submitted successfully:", data);

      if (data.data?.matchingScore !== undefined) {
        const matchingScore =
          data.session?.matchingScore || data.data.matchingScore;

        // Add a slight delay for spinner effect
        setTimeout(() => {
          navigate(`/${role}/result`, {
            state: { matchingScore, sessionId },
          });
        }, 4000); // Delay navigation by 2 seconds
      } else {
        setPolling(true); // Start polling for session status
      }
    } catch (error) {
      console.error("Error submitting answers:", error.message);
      setApiError(error.message);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false); // Deactivate the spinner after delay
      }, 4000); // Ensure the spinner stays visible for at least 2 seconds
      setIsLoading(false); // Stop other loading states if applicable
    }
  };

  // Poll session status
  const pollSessionStatus = useCallback(async () => {
    try {
      setIsPolling(true); // Show the spinner
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/sessions/${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session status.");
      }

      const data = await response.json();

      if (data.success && data.session?.status === "completed") {
        const matchingScore = data.session.matchingScore || 0; // Default to 0 if undefined
        navigate(`/${role}/result`, {
          state: { matchingScore, sessionId },
        });
        setPolling(false); // Stop polling
      }
    } catch (error) {
      console.error("Error polling session status:", error.message);
    } finally {
      setIsPolling(false);
    } // Hide the spinner
  }, [sessionId, navigate, role]);

  useEffect(() => {
    let intervalId;
    if (polling) {
      intervalId = setInterval(pollSessionStatus, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [polling, pollSessionStatus]);

  // Handle answer selection
  const handleAnswer = async (answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = answer;
    setQuestions(updatedQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit all answers once all questions are answered
      const allAnswers = updatedQuestions.filter((q) => q.answer !== undefined);
      await submitAnswers(allAnswers);
    }
  };

  // Dynamic background class
  const backgroundClass = `${role.toLowerCase()}-${
    questions[currentQuestionIndex]?.type === "main-question" ? "main" : "pre"
  }-quest-bg`;

  return (
    <div className={`quiz-container ${backgroundClass}`}>
      {isSubmitting && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {isPolling && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {apiError && (
        <div className="error-banner">
          <p>{apiError}</p>
          <button onClick={() => setApiError("")}>Dismiss</button>
        </div>
      )}
      {isLoading ? (
        <div className="spinner">Loading...</div>
      ) : questions.length > 0 ? (
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          role={role}
          isMainQuestion={
            questions[currentQuestionIndex]?.type === "main-question"
          }
        />
      ) : (
        <p>No questions available. Please try again later.</p>
      )}
    </div>
  );
};

export default QuizPage;
