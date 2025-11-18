// src/pages/lessons/javascript/JavaScriptConditions.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlockJavascriptConditions from "./CodeBlock/CodeBlockJavascriptConditions";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import VerifyToken from "../../../components/auth/VerifyToken";
import axios from "../../../utils/axiosClient";

const JavaScriptConditionsContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const [usedBlocks, setUsedBlocks] = useState<string[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [randomAge, setRandomAge] = useState(18);

  const [descriptions, setDescriptions] = useState({
    if: "",
    comparison: "",
    "console-adult": "",
    else: "",
    "console-minor": "",
    close: "",
  });

  const requiredBlocks = ["if", "comparison", "console-adult", "else", "console-minor", "close"];
  const lessonComplete = requiredBlocks.every((b) => usedBlocks.includes(b));

  if (loading) return <div>Loading user data...</div>;

  // --------------------------
  // Handle tapping blocks
  // --------------------------
  const handleClick = (block: string) => {
    if (!usedBlocks.includes(block)) {
      setUsedBlocks((prev) => [...prev, block]);

      switch (block) {
        case "if":
          setDescriptions((prev) => ({ ...prev, if: "Start an if statement" }));
          break;
        case "comparison":
          setDescriptions((prev) => ({ ...prev, comparison: "Check the age" }));
          break;
        case "console-adult":
          setDescriptions((prev) => ({ ...prev, "console-adult": "Print adult message" }));
          break;
        case "else":
          setDescriptions((prev) => ({ ...prev, else: "Otherwise" }));
          break;
        case "console-minor":
          setDescriptions((prev) => ({ ...prev, "console-minor": "Print minor message" }));
          break;
        case "close":
          setDescriptions((prev) => ({ ...prev, close: "Close the block" }));
          break;
      }
    }

    if (block === "comparison" && lessonComplete) {
      setRandomAge(Math.floor(Math.random() * 30) + 1);
    }
  };

  // --------------------------
  // Update output
  // --------------------------
  useEffect(() => {
    if (lessonComplete) {
      setOutput(randomAge >= 18 ? "You are an adult!" : "You are a minor!");
    } else {
      setOutput(null);
    }
  }, [usedBlocks, randomAge, lessonComplete]);

  // --------------------------
  // Build code preview
  // --------------------------
  const buildCodePreview = () => {
    const lines: string[] = [];
    const ageForDisplay = lessonComplete ? randomAge : 18;

    if (usedBlocks.includes("if")) {
      lines.push(`// ${descriptions.if}`);
      let condition = "";
      if (usedBlocks.includes("comparison")) {
        lines.push(`// ${descriptions.comparison}`);
        condition = `age >= ${ageForDisplay}`;
      }
      lines.push(`if (${condition}) {`);
    }

    if (usedBlocks.includes("console-adult")) {
      lines.push(`// ${descriptions["console-adult"]}`);
      lines.push(`  console.log("You are an adult!");`);
    }

    if (usedBlocks.includes("else")) {
      lines.push(`// ${descriptions.else}`);
      lines.push(`} else {`);
    }

    if (usedBlocks.includes("console-minor")) {
      lines.push(`// ${descriptions["console-minor"]}`);
      lines.push(`  console.log("You are a minor!");`);
    }

    if (usedBlocks.includes("close")) {
      lines.push(`// ${descriptions.close}`);
      lines.push(`}`);
    }

    return lines.join("\n");
  };

  const fullCode = buildCodePreview();

  // --------------------------
  // Save progress to backend
  // --------------------------
  useEffect(() => {
    if (lessonComplete && user) {
      const saveProgress = async () => {
        try {
          await axios.post("/api/lessons/progress", {
            lessonId: "js-conditions",
            completedBlocks: usedBlocks,
          });

          // Optionally, update milestones or badges
          await axios.post("/api/badgesEarned", {
            lessonId: "js-conditions",
          });

          console.log("Progress & badges updated!");
        } catch (err) {
          console.error("Failed to save progress:", err);
        }
      };

      saveProgress();
    }
  }, [lessonComplete, user, usedBlocks]);

  const handleNextLesson = () => navigate("/lessons/js-sample");

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h1 className="lesson-title">JavaScript Conditions</h1>
            <p className="lesson-description">
              Learn how JavaScript makes decisions using if / else!
            </p>

            <h2 className="section-title">Tap the Blocks:</h2>
            <div className="code-blocks">
              {requiredBlocks.map((block) => (
                <CodeBlockJavascriptConditions
                  key={block}
                  tag={block}
                  onClick={handleClick}
                  usedBlocks={usedBlocks}
                  randomAge={lessonComplete ? randomAge : 18}
                  lessonComplete={lessonComplete}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">Code Output:</h3>
            <pre className="code-display">
              {fullCode || "Tap the blocks to build your if/else example"}
            </pre>

            {output && (
              <div
                className="live-preview"
                style={{
                  border: "1px solid var(--border-color, #ccc)",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginTop: "1rem",
                  backgroundColor: "var(--bg-secondary, #f9f9f9)",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2b9348",
                }}
              >
                {output}
              </div>
            )}
          </div>

          {/* NEXT BUTTON */}
          <div className="next-btn-container">
            <button className="next-btn" onClick={handleNextLesson} disabled={!lessonComplete}>
              Next Lesson
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const JavaScriptConditions: React.FC = () => (
  <VerifyToken>
    <JavaScriptConditionsContent />
  </VerifyToken>
);

export default JavaScriptConditions;
