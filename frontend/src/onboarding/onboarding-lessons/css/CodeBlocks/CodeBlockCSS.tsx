import React from "react";

type CodeBlockCSSProps = {
  tag: string;
  onClick: (tag: string) => void;
  onDoubleClick?: (tag: string) => void;
  selectorAdded?: boolean;
  pAdded?: boolean;
  h1Added?: boolean;
  styleAdded?: boolean;
  propertyAdded?: boolean;
  valueAdded?: boolean;
  fontSizeAdded?: boolean;
  description?: string;
  lessonComplete?: boolean;
};

const CodeBlockCSS: React.FC<CodeBlockCSSProps> = ({
  tag,
  onClick,
  onDoubleClick,
  selectorAdded = false,
  pAdded = false,
  h1Added = false,
  styleAdded = false,
  propertyAdded = false,
  valueAdded = false,
  fontSizeAdded = false,
  description,
  lessonComplete = false,
}) => {
  const labels: Record<string, string> = {
    style: "<style>",
    selector: "<p>",
    p: "<p>",
    h1: "<h1>",
    property: "color:",
    value: "red",
    fontsize: "font-size",
  };

  const isAdded =
    (tag === "style" && styleAdded) ||
    (tag === "selector" && selectorAdded) ||
    (tag === "p" && pAdded) ||
    (tag === "h1" && h1Added) ||
    (tag === "property" && propertyAdded) ||
    (tag === "value" && valueAdded) ||
    (tag === "fontsize" && fontSizeAdded);

  const handleDoubleClick = () => {
    if (onDoubleClick) onDoubleClick(tag);
  };

  return (
    <div
      className={`code-block ${isAdded ? "active" : ""}`}
      onClick={() => onClick(tag)}
      onDoubleClick={handleDoubleClick}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: (description || labels[tag] || tag).replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        }}
      ></span>
      {lessonComplete && tag === "value" && <span className="hint">(Click to change color!)</span>}
      {lessonComplete && tag === "fontsize" && <span className="hint">(Click to change font size!)</span>}
    </div>
  );
};

export default CodeBlockCSS;
