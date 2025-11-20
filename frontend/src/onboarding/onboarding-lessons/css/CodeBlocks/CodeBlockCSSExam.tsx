import React from "react";

type CodeBlockCSSExamProps = {
  tag: string;
  onClick: (tag: string) => void;
  isActive: boolean;
  label: string;
};

const CodeBlockCSSExam: React.FC<CodeBlockCSSExamProps> = ({ tag, onClick, isActive, label }) => {
  return (
    <div
      className={`code-block ${isActive ? "active" : ""}`}
      onClick={() => isActive && onClick(tag)}
    >
      {label}
    </div>
  );
};

export default CodeBlockCSSExam;
