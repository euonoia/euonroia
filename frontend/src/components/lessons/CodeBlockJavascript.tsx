import React from "react";
import { useUser } from "../../context/UserContext";

type Props = {
  tag: string;
  onClick: (tag: string) => void;
  letUsed: boolean;
  constUsed: boolean;
  functionUsed: boolean;
  consoleUsed: boolean;
};

const CodeBlockJavascript: React.FC<Props> = ({ tag, onClick, letUsed, constUsed, functionUsed, consoleUsed }) => {
  const { user } = useUser();
  const displayName = user?.name || "Student";

  const isActive =
    (tag === "let" && letUsed) ||
    (tag === "const" && constUsed) ||
    (tag === "function" && functionUsed) ||
    (tag === "console.log" && consoleUsed);

  const displayText = () => {
    switch (tag) {
      case "let":
        return `let name = "${displayName}";`;
      case "const":
        return `const age = 20;`;
      case "function":
        return `function greet() { return "Hello, ${displayName}!"; }`;
      case "console.log":
        return `console.log(greet());`;
      default:
        return tag;
    }
  };

  return (
    <div className={`code-block ${isActive ? "active" : ""}`} onClick={() => onClick(tag)}>
      {displayText()}
    </div>
  );
};

export default CodeBlockJavascript;
