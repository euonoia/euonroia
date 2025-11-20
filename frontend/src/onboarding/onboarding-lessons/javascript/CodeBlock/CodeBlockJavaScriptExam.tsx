import React from "react";

type Props = {
  tag: string;
  onClick: (tag: string) => void;
  usedBlocks: string[];
  randomAge?: number;
  lessonComplete?: boolean;
};

const CodeBlockJavascriptExam: React.FC<Props> = ({
  tag,
  onClick,
  usedBlocks = [],
  randomAge = 12,
  lessonComplete = false,
}) => {
  const isUsed = usedBlocks.includes(tag);

  const displayText = () => {
    switch (tag) {
      // JS Basics Sample Blocks
      case "let":
        return `let name = "Student";`;
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

      // Display Blocks
      case "div":
        return `<div id="output">`;
      case "message":
        return `let message = "Hello, " + name + "!<br>";`;
      case "ageCheck":
        return `message += age >= 18 ? "You are an adult!" : "You are a minor!";`;
      case "display":
        return `document.getElementById("output").innerHTML = message;`;

      // Script block
      case "script":
        return `<script>`;

      default:
        return tag;
    }
  };

  return (
    <div
      className={`code-block ${isUsed ? "active" : ""}`}
      onClick={() => onClick(tag)}
      style={{ padding: "12px 14px" }}
    >
      <pre style={{ margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>
        <code>{displayText()}</code>
      </pre>
      {lessonComplete && tag === "comparison" && (
        <span className="hint">(Click to change age!)</span>
      )}
    </div>
  );
};

export default CodeBlockJavascriptExam;
