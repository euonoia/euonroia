import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CodeBlockCSS from "../../../components/lessons/CodeBlockCSS";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import VerifyToken from "../../../components/auth/VerifyToken";

const SampleContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const [styleAdded, setStyleAdded] = useState(false);
  const [pAdded, setPAdded] = useState(false);
  const [propertyAdded, setPropertyAdded] = useState(false);
  const [valueAdded, setValueAdded] = useState(false);

  const [descriptions, setDescriptions] = useState({
    style: "",
    p: "",
    property: "",
    value: "",
  });

  const [message, setMessage] = useState(
    "Tap the blocks to build a simple HTML page that uses the <style> tag."
  );

  // Update message when all blocks are completed
  useEffect(() => {
    if (styleAdded && pAdded && propertyAdded && valueAdded) {
      setMessage("Whooah! It changes me too!");
    }
  }, [styleAdded, pAdded, propertyAdded, valueAdded]);

  const handleBlockClick = (tag: string) => {
    switch (tag) {
      case "style":
        if (!styleAdded) {
          setStyleAdded(true);
          setDescriptions((prev) => ({
            ...prev,
            style: "The <style> tag contains CSS that affects the HTML document.",
          }));
        }
        break;
      case "p":
        if (!pAdded) {
          setPAdded(true);
          setDescriptions((prev) => ({
            ...prev,
            p: "The <p> tag defines a paragraph in HTML.",
          }));
        }
        break;
      case "property":
        if (!propertyAdded) {
          setPropertyAdded(true);
          setDescriptions((prev) => ({
            ...prev,
            property: "CSS properties define what aspect of an element to style.",
          }));
        }
        break;
      case "value":
        if (!valueAdded) {
          setValueAdded(true);
          setDescriptions((prev) => ({
            ...prev,
            value: "Values specify how a property should appear (e.g., red).",
          }));
        }
        break;
    }
  };

  const buildOutput = (): string | null => {
    if (!styleAdded && !pAdded && !propertyAdded && !valueAdded) return null;

    const lines: string[] = [];
    lines.push("<!DOCTYPE html>");
    lines.push("<html>");
    lines.push("  <head>");
    lines.push('    <meta charset="UTF-8" />');
    lines.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    lines.push("    <title>Euonroia</title>");

    if (styleAdded) {
      lines.push(`    <!-- ${descriptions.style} -->`);
      lines.push("    <style>");
      if (pAdded && propertyAdded && valueAdded) {
        lines.push("      p { color: red; }");
      } else if (pAdded && propertyAdded) {
        lines.push("      p { color: ; }");
      } else if (pAdded) {
        lines.push("      p { }");
      }
      lines.push("    </style>");
    }

    lines.push("  </head>");
    lines.push("  <body>");

    if (pAdded) {
      lines.push(`    <!-- ${descriptions.p} -->`);
      lines.push(`    <p>Hello, ${user?.name || "Student"}!</p>`);
    }

    lines.push("  </body>");
    lines.push("</html>");

    return lines.join("\n");
  };

  const htmlOutput = buildOutput();
  const handleNextLesson = () => navigate("/lessons/css-multiple-elements");

  if (loading) return <div>Loading user data...</div>;

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h1 className="lesson-title">Adding CSS Inside the Head</h1>

            <p
              className="lesson-description"
              style={{
                color: styleAdded && pAdded && propertyAdded && valueAdded ? "#e63946" : "inherit",
                fontWeight: styleAdded && pAdded && propertyAdded && valueAdded ? "bold" : "normal",
                transition: "color 0.3s ease",
              }}
            >
              {message}
            </p>

            <h2 className="section-title">CSS IN HEAD STRUCTURE</h2>
            <div className="code-blocks">
              {["style", "p", "property", "value"].map((tag) => (
                <CodeBlockCSS
                  key={tag}
                  tag={tag}
                  onClick={handleBlockClick}
                  styleAdded={styleAdded}
                  pAdded={pAdded}
                  propertyAdded={propertyAdded}
                  valueAdded={valueAdded}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">HTML Output:</h3>
            <pre className="code-display">
              {htmlOutput || "Click the blocks to build a CSS-in-head example"}
            </pre>

            {styleAdded && (
              <div
                className="live-preview"
                style={{
                  border: "1px solid var(--border-color, #ccc)",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginTop: "1rem",
                  backgroundColor: "var(--bg-secondary, #f9f9f9)",
                  textAlign: "center",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    pAdded && propertyAdded && valueAdded
                      ? `<style>p { color:red; }</style><p>Hello, ${user?.name || "Student"}!</p>`
                      : `<p>Hello, ${user?.name || "Student"}!</p>`,
                }}
              ></div>
            )}
          </div>

          {/* NEXT LESSON BUTTON */}
          <div className="next-btn-container">
            <button
              className="next-btn"
              onClick={handleNextLesson}
              disabled={!styleAdded || !pAdded || !propertyAdded || !valueAdded}
            >
              Next Lesson
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const Sample: React.FC = () => (
  <VerifyToken>
    <SampleContent />
  </VerifyToken>
);

export default Sample;
