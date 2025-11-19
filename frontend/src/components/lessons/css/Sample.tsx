import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CodeBlockCSS from "./CodeBlocks/CodeBlockCSS";
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

  const buildOutput = (): React.ReactNode[] => {
    const lines: React.ReactNode[] = [];
    
    lines.push(<span key="doctype">{"<!DOCTYPE html>"}</span>);
    lines.push(<br key="br1" />);
    lines.push(<span key="html">{"<html>"}</span>);
    lines.push(<br key="br2" />);
    lines.push(<span key="head">{"  <head>"}</span>);
    lines.push(<br key="br3" />);
    lines.push(<span key="meta">{'    <meta charset="UTF-8" />'}</span>);
    lines.push(<br key="br4" />);
    lines.push(<span key="viewport">{'    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'}</span>);
    lines.push(<br key="br5" />);
    lines.push(<span key="title">{"    <title>Euonroia</title>"}</span>);
    lines.push(<br key="br6" />);
   
    if (styleAdded) {
      lines.push(<br key="br7" />);
      lines.push(
        <span key="style-comment" style={{ color: '#0a5300' }}>
          {`    <!-- ${descriptions.style} -->`}
        </span>
      );
      lines.push(<br key="br7" />);
      lines.push(
        <span key="style-open" style={{ color: '#0a5300' }}>
          {"    <style>"}
        </span>
      );
      lines.push(<br key="br8" />);
      
      if (pAdded && propertyAdded && valueAdded) {
        lines.push(
          <span key="style-rule" style={{ color: '#0a5300' }}>
            {"      p { color: red; }"}
          </span>
        );
      } else if (pAdded && propertyAdded) {
        lines.push(
          <span key="style-rule" style={{ color: '#0a5300' }}>
            {"      p { color: ; }"}
          </span>
        );
      } else if (pAdded) {
        lines.push(
          <span key="style-rule" style={{ color: '#0a5300' }}>
            {"      p { }"}
          </span>
        );
      }
      lines.push(<br key="br9" />);
      lines.push(
        <span key="style-close" style={{ color: '#0a5300' }}>
          {"    </style>"}
        </span>
      );
      lines.push(<br key="br10" />);
    } else {
      lines.push(<span key="head-close">{"  </head>"}</span>);
      lines.push(<br key="br11" />);
    }

    if (!styleAdded) {
      lines.push(<span key="head-close">{"  </head>"}</span>);
      lines.push(<br key="br12" />);
    }

    lines.push(<span key="body">{"  <body>"}</span>);
    lines.push(<br key="br13" />);

    if (pAdded) {
      lines.push(
        <span key="p-comment" style={{ color: '#0a5300' }}>
          {`    <!-- ${descriptions.p} -->`}
        </span>
      );
      lines.push(<br key="br14" />);
      lines.push(
        <span key="p-tag" style={{ color: '#0a5300' }}>
          {`    <p>Hello, ${user?.name || "Student"}!</p>`}
        </span>
      );
      lines.push(<br key="br15" />);
    }

    lines.push(<span key="body-close">{"  </body>"}</span>);
    lines.push(<br key="br16" />);
    lines.push(<span key="html-close">{"</html>"}</span>);

    return lines;
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
              {htmlOutput}
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
