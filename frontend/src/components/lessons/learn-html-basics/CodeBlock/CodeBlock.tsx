import React from "react";

type CodeBlockProps = {
  tag: string;
  onClick: (tag: string) => void;

  // highlight state
  isActive?: boolean;

  // optional flags for other lessons
  doctypeAdded?: boolean;
  htmlAdded?: boolean;
  headAdded?: boolean;
  bodyAdded?: boolean;
  headingsAdded?: boolean;
  paragraphsAdded?: boolean;
  linksAdded?: boolean;
  imagesAdded?: boolean;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  tag,
  onClick,
  isActive = false,   // NEW

  headingsAdded = false,
  paragraphsAdded = false,
  linksAdded = false,
  imagesAdded = false,
}) => {
  const isFontActive =
    (tag === "headings" && headingsAdded) ||
    (tag === "paragraphs" && paragraphsAdded) ||
    (tag === "links" && linksAdded) ||
    (tag === "images" && imagesAdded);

  const displayText = () => {
    switch (tag) {
      case "headings": return "<h1>, <h2>, <h3>";
      case "paragraphs": return "<p>";
      case "links": return "<a>";
      case "images": return "<img>";
      case "DOCTYPE": return "<!DOCTYPE html>";
      case "html": return "<html>";
      case "head": return "<head>";
      case "body": return "<body>";
      default: return `<${tag}>`;
    }
  };

  return (
    <div
      className={`code-block ${isActive ? "active" : ""}`}   // NEW highlight class
      onClick={() => onClick(tag)}
    >
      {displayText()}
    </div>
  );
};

export default CodeBlock;
