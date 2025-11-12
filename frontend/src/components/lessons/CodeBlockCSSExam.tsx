import React from "react";

type CodeBlockCSSExamProps = {
  tag: string;
  onClick: (tag: string) => void;
  isActive: boolean; // we still keep this to control click
  label: string;
};

const CodeBlockCSSExam: React.FC<CodeBlockCSSExamProps> = ({ tag, onClick, isActive, label }) => {
  return (
    <div
      onClick={() => isActive && onClick(tag)}
      style={{
        cursor: isActive ? "pointer" : "default",
        backgroundColor: "#f1f3f5", // removed highlight
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        margin: "0.5rem",
        textAlign: "center",
        minWidth: "60px",
        userSelect: "none",
        fontWeight: 400, // remove bold for active
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        if (isActive) e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {label}
    </div>
  );
};

export default CodeBlockCSSExam;
