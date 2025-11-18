import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import CodeBlockJavascriptSample from "./CodeBlock/CodeBlockJavascriptSample";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import VerifyToken from "../../../components/auth/VerifyToken";

const SampleContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const [usedBlocks, setUsedBlocks] = useState<string[]>([]);
  const [randomAge, setRandomAge] = useState(Math.floor(Math.random() * 20) + 10);
  const [output, setOutput] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("Tap the blocks to build a simple JavaScript program!");

  const allRequiredBlocks = [
    "let", "const", "function", "console.log",
    "if", "comparison", "console-adult", "else", "console-minor", "close",
  ];

  const lessonComplete = allRequiredBlocks.every((b) => usedBlocks.includes(b));

  const handleBlockClick = (block: string) => {
    if (!usedBlocks.includes(block)) setUsedBlocks((prev) => [...prev, block]);
    if (block === "comparison") setRandomAge(Math.floor(Math.random() * 30) + 1);
  };

  // Update live output
  useEffect(() => {
    const displayName = user?.name || "Student";
    const logs: string[] = [];

    if (usedBlocks.includes("let") && usedBlocks.includes("const") &&
        usedBlocks.includes("function") && usedBlocks.includes("console.log")) {
      logs.push(`Hello, ${displayName}!`);
    }

    if (lessonComplete && usedBlocks.includes("if") && usedBlocks.includes("comparison")) {
      if (randomAge >= 12 && usedBlocks.includes("console-adult")) logs.push("You are an adult!");
      else if (usedBlocks.includes("else") && usedBlocks.includes("console-minor")) logs.push("You are a minor!");
    }

    setOutput(logs.length > 0 ? logs.join("\n") : null);
  }, [usedBlocks, randomAge, lessonComplete, user?.name]);

  const buildFullHTMLOutput = (): string => {
    const lines: string[] = [];
    const displayName = user?.name || "Student";
    const ageForDisplay = randomAge;

    lines.push("<!DOCTYPE html>");
    lines.push("<html>");
    lines.push("  <head>");
    lines.push("    <meta charset='UTF-8'>");
    lines.push("    <title>JS Sample</title>");
    lines.push("  </head>");
    lines.push("  <body>");
    lines.push("    <script>");

    if (usedBlocks.includes("let")) lines.push(`      let name = "${displayName}";`);
    if (usedBlocks.includes("const")) lines.push(`      const age = ${ageForDisplay};`);
    if (usedBlocks.includes("function")) {
      lines.push("      function greet() {");
      if (usedBlocks.includes("console.log")) lines.push(`        console.log("Hello, " + name + "!");`);
      if (usedBlocks.includes("if")) {
        const condition = usedBlocks.includes("comparison") ? `age >= ${ageForDisplay}` : "";
        lines.push(`        if (${condition}) {`);
        if (usedBlocks.includes("console-adult")) lines.push(`          console.log("You are an adult!");`);
        if (usedBlocks.includes("else")) lines.push("        } else {");
        if (usedBlocks.includes("console-minor")) lines.push(`          console.log("You are a minor!");`);
        if (usedBlocks.includes("close")) lines.push("        }");
      }
      lines.push("      }");
    }

    if (usedBlocks.includes("function")) lines.push("      greet(); // calls the greet function");

    lines.push("    </script>");
    lines.push("  </body>");
    lines.push("</html>");

    return lines.join("\n");
  };

  const fullHTML = buildFullHTMLOutput();

  const handleNextLessonClick = () => setShowModal(true);
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/lessons/js-display");
  };

  if (loading) return <div>Loading user data...</div>;

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h1 className="lesson-title">Building a JS Program with Conditions</h1>
            <p className="lesson-description">{message}</p>

            <h2 className="section-title">JS Blocks</h2>
            <div className="code-blocks">
              {allRequiredBlocks.map((block) => (
                <CodeBlockJavascriptSample
                  key={block}
                  tag={block}
                  onClick={handleBlockClick}
                  usedBlocks={usedBlocks}
                  randomAge={randomAge}
                  lessonComplete={lessonComplete}
                />
              ))}
            </div>
             <div className="next-btn-container">
            <button
              className="next-btn"
              onClick={handleNextLessonClick}
              disabled={!lessonComplete}
            >
              Next Lesson
            </button>
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">HTML</h3>
            <pre className="code-display">{fullHTML}</pre>

            <h4>Console</h4>
            {output && (
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginTop: "1rem",
                  backgroundColor: "#f9f9f9",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2b9348",
                  whiteSpace: "pre-wrap",
                }}
              >
                {output}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "500px",
              textAlign: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Notice</h2>
            <p>
              You just learned how to write JavaScript inside HTML. <br />
              Before, the program only showed messages in the console. <br />
              Now, we will see the messages appear directly on the web page!
            </p>
            <button
              onClick={handleModalConfirm}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#2b9348",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Sample: React.FC = () => (
  <VerifyToken>
    <SampleContent />
  </VerifyToken>
);

export default Sample;
