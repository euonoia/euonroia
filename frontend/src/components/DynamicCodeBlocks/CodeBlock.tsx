import React from "react";

type QuizOptionProps = {
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
  onClick: () => void;
};

const QuizOption: React.FC<QuizOptionProps> = ({ text, isCorrect, isSelected, onClick }) => {
  return (
    <button
      className={`quiz-option ${isSelected ? (isCorrect ? "correct" : "wrong") : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default QuizOption;
