import React from "react";

type CodeBlockProps = {
  tag: string;
  onClick: (tag: string) => void;
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
  doctypeAdded = false,
  htmlAdded = false,
  headAdded = false,
  bodyAdded = false,
  headingsAdded = false,
  paragraphsAdded = false,
  linksAdded = false,
  imagesAdded = false,
}) => {
  const isAdded =
    (tag === "DOCTYPE" && doctypeAdded) ||
    (tag === "html" && htmlAdded) ||
    (tag === "head" && headAdded) ||
    (tag === "body" && bodyAdded) ||
    (tag === "headings" && headingsAdded) ||
    (tag === "paragraphs" && paragraphsAdded) ||
    (tag === "links" && linksAdded) ||
    (tag === "images" && imagesAdded);

  const displayText = () => {
    switch (tag) {
      case "DOCTYPE":
        return "<!DOCTYPE html>";
      case "html":
        return "<html>";
      case "head":
        return "<head>";
      case "body":
        return "<body>";
      case "headings":
        return "<h1>, <h2>, <h3>";
      case "paragraphs":
        return "<p>";
      case "links":
        return "<a>";
      case "images":
        return "<img>";
      default:
        return `<${tag}>`;
    }
  };

  return (
    <div className={`code-block ${isAdded ? "active" : ""}`} onClick={() => onClick(tag)}>
      {displayText()}
    </div>
  );
};

export default CodeBlock;
