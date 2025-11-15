import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CodeBlockCSS from "../../../components/lessons/CodeBlockCSS";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import VerifyToken from "../../../components/auth/VerifyToken";

const CSSMultipleElementsContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Block states
  const [pAdded, setPAdded] = useState(false);
  const [h1Added, setH1Added] = useState(false);
  const [styleAdded, setStyleAdded] = useState(false);
  const [propertyAdded, setPropertyAdded] = useState(false);
  const [colorAdded, setColorAdded] = useState(false);
  const [fontSizeAdded, setFontSizeAdded] = useState(false);

  // Dynamic CSS values
  const [colorValue, setColorValue] = useState("red");
  const [fontSizeValue, setFontSizeValue] = useState("20px");

  const colors = ["red", "blue", "green", "orange"];
  const fontSizes = ["15px", "20px", "24px", "30px"];

  // ✅ Check if lesson is complete
  const requiredBlocks = [pAdded, h1Added, styleAdded, propertyAdded, colorAdded, fontSizeAdded];
  const lessonComplete = requiredBlocks.every(Boolean);

  const handleBlockClick = (tag: string) => {
    switch (tag) {
      case "p":
        setPAdded(true);
        break;
      case "h1":
        setH1Added(true);
        break;
      case "style":
        setStyleAdded(true);
        break;
      case "property":
        setPropertyAdded(true);
        break;
      case "value":
        setColorAdded(true);
        setColorValue((prev) => {
          const currentIndex = colors.indexOf(prev);
          return colors[(currentIndex + 1) % colors.length];
        });
        break;
      case "fontsize":
        setFontSizeAdded(true);
        setFontSizeValue((prev) => {
          const currentIndex = fontSizes.indexOf(prev);
          return fontSizes[(currentIndex + 1) % fontSizes.length];
        });
        break;
      default:
        break;
    }
  };

  // Build output
  const buildOutput = (): string => {
    const lines: string[] = [];
    const indent = (n: number) => "  ".repeat(n);

    lines.push("<!DOCTYPE html>");
    lines.push("<html>");
    lines.push(`${indent(1)}<head>`);
    lines.push(`${indent(2)}<meta charset="UTF-8" />`);
    lines.push(`${indent(2)}<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);
    lines.push(`${indent(2)}<title>Euonroia</title>`);

    if (styleAdded && (pAdded || h1Added)) {
      lines.push(`${indent(2)}<style>`);

      const targets = [
        { tag: "h1", added: h1Added },
        { tag: "p", added: pAdded },
      ];

      targets.forEach(({ tag, added }) => {
        if (!added) return;
        lines.push(`${indent(3)}${tag} {`);
        if (propertyAdded && colorAdded) lines.push(`${indent(4)}color: ${colorValue};`);
        if (fontSizeAdded) lines.push(`${indent(4)}font-size: ${fontSizeValue};`);
        lines.push(`${indent(3)}}`);
        lines.push("");
      });

      lines.push(`${indent(2)}</style>`);
    }

    lines.push(`${indent(1)}</head>`);
    lines.push(`${indent(1)}<body>`);

    if (h1Added) lines.push(`${indent(2)}<h1>Hello, Student!</h1>`);
    if (pAdded) lines.push(`${indent(2)}<p>This is a styled paragraph.</p>`);

    lines.push(`${indent(1)}</body>`);
    lines.push("</html>");
    return lines.join("\n");
  };

  const htmlOutput = buildOutput();
  const handleNextLesson = () => navigate("/lessons/css-exam");

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h2 className="lesson-title">Styling Multiple Elements with CSS</h2>
            <p className="lesson-description">
              Tap the blocks to style multiple elements with CSS!
            </p>

            <h2 className="section-title">CSS MULTIPLE ELEMENTS STRUCTURE</h2>
            <div className="code-blocks">
              {["p", "h1", "style", "property", "value", "fontsize"].map((tag) => (
                <CodeBlockCSS
                  key={tag}
                  tag={tag}
                  onClick={handleBlockClick}
                  pAdded={pAdded}
                  h1Added={h1Added}
                  styleAdded={styleAdded}
                  propertyAdded={propertyAdded}
                  valueAdded={colorAdded}
                  fontSizeAdded={fontSizeAdded}
                  lessonComplete={lessonComplete}
                />
              ))}
            </div>
            <br />
             <div className="next-btn-container">
            <button
              className="next-btn"
              onClick={handleNextLesson}
              disabled={!lessonComplete}
            >
              READY FOR EXAM?
            </button>
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">HTML Output (Code):</h3>
            <pre className="code-display">{htmlOutput}</pre>
            <div
              className="live-preview"
              style={{
                border: "1px solid var(--border-color, #ccc)",
                borderRadius: "10px",
                padding: "1rem",
                marginTop: "1rem",
                backgroundColor: "var(--bg-secondary, #f9f9f9)",
                textAlign: "center",
                minHeight: "120px",
              }}
              dangerouslySetInnerHTML={{
                __html: `
                  ${styleAdded ? `<style>
                    ${h1Added ? `h1 { ${propertyAdded && colorAdded ? `color: ${colorValue}; font-size: ${fontSizeValue};` : ""} }` : ""}
                    ${pAdded ? `p { ${propertyAdded && colorAdded ? `color: ${colorValue}; font-size: ${fontSizeValue};` : ""} }` : ""}
                  </style>` : ""}
                  ${h1Added ? `<h1>Hello, Student!</h1>` : ""}
                  ${pAdded ? `<p>This is a styled paragraph.</p>` : ""}
                `,
              }}
            />
          </div>
        </div>
      </main>
      
    </div>
  );
};

const CSSMultipleElements: React.FC = () => (
  <VerifyToken>
    <CSSMultipleElementsContent />
  </VerifyToken>
);

export default CSSMultipleElements;
