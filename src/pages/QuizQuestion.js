// src/components/QuizQuestion.js
import React from "react";
import "../styles/QuizQuestion.css";

const QuizQuestion = ({ question, onAnswer, isLoading }) => {
  if (!question) return <p>Loading question...</p>; // Fallback if question is undefined

  return (
    <div className="quiz-container">
      <div className="quiz-question">
        {/* Correct field for question text */}
        <p className="question-text">{question.question}</p>
        <div className="answer-buttons">
          <button
            onClick={() => onAnswer(true)}
            className="answer-button"
            disabled={isLoading}
            aria-label="Answer True"
          >
            Iya
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="answer-button"
            disabled={isLoading}
            aria-label="Answer False"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
