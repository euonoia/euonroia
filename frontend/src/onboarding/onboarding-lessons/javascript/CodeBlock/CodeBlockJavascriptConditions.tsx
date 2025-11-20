import React from "react";

type Props = {
  tag: string;
  onClick: (tag: string) => void;
  usedBlocks: string[];
  randomAge: number;
  lessonComplete: boolean;
};

const CodeBlockJavascriptConditions: React.FC<Props> = ({ tag, onClick, usedBlocks, randomAge, lessonComplete }) => {
  const isUsed = usedBlocks.includes(tag);

  const displayText = () => {
    switch (tag) {
      case "if":
        return `if ( ) {`;
      case "comparison":
        return `age >= ${randomAge}`;
      case "console-adult":
        return `console.log("You are an adult!");`;
      case "else":
        return `} else {`;
      case "console-minor":
        return `console.log("You are a minor!");`;
      case "close":
        return `}`;
      default:
        return tag;
    }
  };

  return (
    <div className={`code-block ${isUsed ? "active" : ""}`} onClick={() => onClick(tag)}>
      {displayText()}
      {lessonComplete && tag === "comparison" && <span className="hint">(Click to change age!)</span>}
    </div>
  );
};

export default CodeBlockJavascriptConditions;
