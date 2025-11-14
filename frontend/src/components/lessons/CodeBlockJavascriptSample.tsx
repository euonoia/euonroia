import React from "react";
import { useUser } from "../../context/UserContext";

type Props = {
  tag: string;
  onClick: (tag: string) => void;
  letUsed?: boolean;
  constUsed?: boolean;
  functionUsed?: boolean;
  consoleUsed?: boolean;
  usedBlocks?: string[];
  randomAge?: number;
  lessonComplete?: boolean;
};

const CodeBlockJavascriptSample: React.FC<Props> = ({
  tag,
  onClick,
  letUsed = false,
  constUsed = false,
  functionUsed = false,
  consoleUsed = false,
  usedBlocks = [],
  randomAge = 12,
  lessonComplete = false,
}) => {
  const { user } = useUser();
  const displayName = user?.name || "Student";

  const isUsed =
    tag === "let" ? letUsed :
    tag === "const" ? constUsed :
    tag === "function" ? functionUsed :
    tag === "console.log" ? consoleUsed :
    usedBlocks.includes(tag);

  const displayText = () => {
    switch (tag) {
      case "let":
        return `let name = "${displayName}";`;
      case "const":
        return `const age = ${randomAge};`;
      case "function":
        return `function greet() { }`;
      case "console.log":
        return `console.log("Hello, " + name + "!");`;
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

export default CodeBlockJavascriptSample;
