import React from "react";
import { Question } from "../types/types"; // Assuming this path is correct


type QuestionCardProps = {
    question: Question;
    onAnswer: (choiceIndex: number) => void;
    disabled: boolean; // Added for interactivity improvement
};


export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
    return (
        <div className="card-container">
            <div className="text-secondary">Question</div>
            
            {/* Using custom text classes */}
            <div className="text-lg font-bold mt-1">{question.prompt}</div>


            <div className="grid-gap-2 mt-3">
                {question.choices.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => onAnswer(i)}
                        className="choice-button"
                        disabled={disabled} // Disable buttons during damage animation
                    >
                        {String.fromCharCode(65 + i)}. {c}
                    </button>
                ))}
            </div>
        </div>
    );
}