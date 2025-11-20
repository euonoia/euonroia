import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import CodeBlockCSS from "./CodeBlocks/CodeBlockCSS";
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

  const lessonComplete = [pAdded, h1Added, styleAdded, propertyAdded, colorAdded, fontSizeAdded].every(Boolean);

  // Single click handler for all blocks
  const handleBlockClick = (tag: string) => {
    switch (tag) {
      case "p": setPAdded(true); break;
      case "h1": setH1Added(true); break;
      case "style": setStyleAdded(true); break;
      case "property": setPropertyAdded(true); break;
      case "value": 
        setColorAdded(true);
        setColorValue(prev => colors[(colors.indexOf(prev) + 1) % colors.length]);
        break;
      case "fontsize": 
        setFontSizeAdded(true);
        setFontSizeValue(prev => fontSizes[(fontSizes.indexOf(prev) + 1) % fontSizes.length]);
        break;
    }
  };

  const buildOutput = (): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    const indent = (n: number) => "  ".repeat(n);

    lines.push(<span key="doctype">{"<!DOCTYPE html>"}</span>, <br key="br1" />);
    lines.push(<span key="html">{"<html>"}</span>, <br key="br2" />);
    lines.push(<span key="head">{`${indent(1)}<head>`}</span>, <br key="br3" />);
    lines.push(<span key="meta">{`${indent(2)}<meta charset="UTF-8" />`}</span>, <br key="br4" />);
    lines.push(<span key="viewport">{`${indent(2)}<meta name="viewport" content="width=device-width, initial-scale=1.0" />`}</span>, <br key="br5" />);
    lines.push(<span key="title">{`${indent(2)}<title>Euonroia</title>`}</span>, <br key="br6" />);

    if (styleAdded && (pAdded || h1Added)) {
      lines.push(<span key="style-open" style={{ color: '#0a5300' }}>{`${indent(2)}<style>`}</span>, <br key="br7" />);
      const targets = [{ tag: "h1", added: h1Added }, { tag: "p", added: pAdded }];
      targets.forEach(({ tag, added }, idx) => {
        if (!added) return;
        lines.push(<span key={`selector-${idx}`} style={{ color: '#0a5300' }}>{`${indent(3)}${tag} {`}</span>, <br key={`br-${idx}-1`} />);
        if (propertyAdded) {
          lines.push(
            <span key={`color-${idx}`} style={{ color: '#0a5300' }}>
              {`${indent(4)}color${colorAdded ? `: ${colorValue};` : ": ;"}`}
            </span>, <br key={`br-${idx}-2`} />
          );
        }
        if (fontSizeAdded) {
          lines.push(
            <span key={`fontsize-${idx}`} style={{ color: '#0a5300' }}>
              {`${indent(4)}font-size: ${fontSizeValue};`}
            </span>, <br key={`br-${idx}-3`} />
          );
        }
        lines.push(<span key={`close-${idx}`} style={{ color: '#0a5300' }}>{`${indent(3)}}`}</span>, <br key={`br-${idx}-4`} />);
      });
      lines.push(<span key="style-close" style={{ color: '#0a5300' }}>{`${indent(2)}</style>`}</span>, <br key="br8" />);
    }

    lines.push(<span key="head-close">{`${indent(1)}</head>`}</span>, <br key="br9" />);
    lines.push(<span key="body">{`${indent(1)}<body>`}</span>, <br key="br10" />);
    if (h1Added) lines.push(<span key="h1">{`${indent(2)}<h1>Hello, Student!</h1>`}</span>, <br key="br11" />);
    if (pAdded) lines.push(<span key="p">{`${indent(2)}<p>This is a styled paragraph.</p>`}</span>, <br key="br12" />);
    lines.push(<span key="body-close">{`${indent(1)}</body>`}</span>, <br key="br13" />);
    lines.push(<span key="html-close">{"</html>"}</span>);

    return lines;
  };

  const htmlOutput = buildOutput();
  const handleNextLesson = () => navigate("/lessons/css-exam");

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h2 className="lesson-title">Styling Multiple Elements with CSS</h2>
            <p className="lesson-description">
              Tap the blocks to style multiple elements with CSS!
            </p>
            <h2 className="section-title">CSS MULTIPLE ELEMENTS STRUCTURE</h2>
            <div className="code-blocks">
              {["p", "h1", "style", "property", "value", "fontsize"].map(tag => (
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
          </div>
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
                    ${h1Added ? `h1 { ${propertyAdded ? `color${colorAdded ? `: ${colorValue};` : ": ;"}` : ""} ${fontSizeAdded ? `font-size: ${fontSizeValue};` : ""} }` : ""}
                    ${pAdded ? `p { ${propertyAdded ? `color${colorAdded ? `: ${colorValue};` : ": ;"}` : ""} ${fontSizeAdded ? `font-size: ${fontSizeValue};` : ""} }` : ""}
                  </style>` : ""}
                  ${h1Added ? `<h1>Hello, Student!</h1>` : ""}
                  ${pAdded ? `<p>This is a styled paragraph.</p>` : ""}
                `,
              }}
            />
          </div>
            <div className="next-btn-container">
              <button className="next-btn" onClick={handleNextLesson} disabled={!lessonComplete}>
                READY FOR EXAM?
              </button>
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
