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
};

const CodeBlockCSS: React.FC<CodeBlockCSSProps> = React.memo(
  ({
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
  }) => {
    const labels: Record<string, string> = {
      style: "<style>",
      element: "p",
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
        className="code-block"
        onClick={() => onClick(tag)}
        onDoubleClick={handleDoubleClick}
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          margin: "5px",
          cursor: "pointer",
          borderRadius: "6px",
          backgroundColor: isAdded ? "#d1ffd6" : "#f8f8f8",
          fontFamily: "monospace",
          textAlign: "center",
          transition: "all 0.3s ease",
          color: "inherit",
        }}
      >
        <span
          style={{ color: "inherit" }}
          dangerouslySetInnerHTML={{
            __html: (description || labels[tag] || tag)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;"),
          }}
        ></span>
      </div>
    );
  }
);

export default CodeBlockCSS;
