import React from "react";

type Props = {
  tag: "div" | "message" | "ageCheck" | "display";
  onClick: (tag: string) => void;
  usedBlocks: string[];
};

const CodeBlockJavascriptDisplay: React.FC<Props> = ({ tag, onClick, usedBlocks }) => {
  const isUsed = usedBlocks.includes(tag);

  const displayText = () => {
    switch (tag) {
      case "div":
        return `<div id="output">`;
      case "message":
        return `let message = "Hello, " + name + "!<br>";`;
      case "ageCheck":
        return `message += age >= 18 ? "You are an adult!" : "You are a minor!";`;
      case "display":
        return `document.getElementById("output").innerHTML = message;`;
      default:
        return tag;
    }
  };

  return (
    <div
      className={`code-block ${isUsed ? "active" : ""}`}
      onClick={() => onClick(tag)}
      style={{ padding: "12px 14px" }} // extra consistent padding
    >
      <pre className="code-pre">
        <code className="code-text">{displayText()}</code>
      </pre>
    </div>
  );
};

export default CodeBlockJavascriptDisplay;
