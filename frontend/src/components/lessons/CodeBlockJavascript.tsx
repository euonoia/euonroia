import React from "react";
import { useUser } from "../../context/UserContext"; // ✅ import user context

type CodeBlockJavascriptProps = {
  tag: string; // Block name like "let", "const", "function", etc.
  onClick: (tag: string) => void; // Callback when a block is clicked/tapped
  letUsed: boolean;
  constUsed: boolean;
  functionUsed: boolean;
  consoleUsed: boolean;
};

const CodeBlockJavascript: React.FC<CodeBlockJavascriptProps> = ({
  tag,
  onClick,
  letUsed,
  constUsed,
  functionUsed,
  consoleUsed,
}) => {
  const { user } = useUser(); // ✅ get current user
  const displayName = user?.name || "Student"; // fallback if no name

  const blockStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "4px",
    backgroundColor: "#f3f3f3",
    transition: "0.2s",
  };

  const activeStyle = {
    border: "1px solid #00c853",
    padding: "10px",
    margin: "5px",
    borderRadius: "4px",
    backgroundColor: "#c8f7c5",
    color: "#0a5300",
  };

  // === let ===
  if (tag === "let" && !letUsed) {
    return (
      <div className="code-block-js" onClick={() => onClick(tag)} style={blockStyle}>
        <span>{`let name = "${displayName}";`}</span>
      </div>
    );
  }

  // === const ===
  if (tag === "const" && !constUsed) {
    return (
      <div className="code-block-js" onClick={() => onClick(tag)} style={blockStyle}>
        <span>{`const age = 20;`}</span>
      </div>
    );
  }

  // === function ===
  if (tag === "function" && !functionUsed) {
    return (
      <div className="code-block-js" onClick={() => onClick(tag)} style={blockStyle}>
        <span>{`function greet() { return "Hello, ${displayName}!"; }`}</span>
      </div>
    );
  }

  // === console.log ===
  if (tag === "console.log" && !consoleUsed) {
    return (
      <div className="code-block-js" onClick={() => onClick(tag)} style={blockStyle}>
        <span>{`console.log(greet());`}</span>
      </div>
    );
  }

  // === Active State (already used blocks) ===
  return (
    <div className="code-block-js" style={activeStyle}>
      {tag === "let" && letUsed ? (
        <span>{`let name = "${displayName}";`}</span>
      ) : tag === "const" && constUsed ? (
        <span>{`const age = 20;`}</span>
      ) : tag === "function" && functionUsed ? (
        <span>{`function greet() { return "Hello, ${displayName}!"; }`}</span>
      ) : tag === "console.log" && consoleUsed ? (
        <span>{`console.log(greet());`}</span>
      ) : (
        <span>{tag}</span>
      )}
    </div>
  );
};

export default CodeBlockJavascript;
