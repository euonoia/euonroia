import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import axios from "../../../../utils/axiosClient";
import Header from "../../../../components/header";
import CodeBlockJavascriptExam from "../CodeBlock/CodeBlockJavaScriptExam";
import "../../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../../context/ThemeContext";
import { useUser } from "../../../../context/UserContext";

const JavaScriptExamContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const [usedBlocks, setUsedBlocks] = useState<string[]>([]);
  const [randomAge, setRandomAge] = useState(Math.floor(Math.random() * 20) + 10);
  const [output, setOutput] = useState<string | null>(null);
  const [message, setMessage] = useState("Tap the blocks to build a JavaScript program!");
  const [showCongrats, setShowCongrats] = useState(false);

  const allRequiredBlocks = [
    "let", "const", "function", "console.log",
    "if", "comparison", "console-adult", "else", "console-minor",
    "div", "message", "ageCheck", "display",
    "script"
  ];

  const lessonComplete = allRequiredBlocks.every((b) => usedBlocks.includes(b));

  const handleBlockClick = (block: string) => {
    if (!usedBlocks.includes(block)) setUsedBlocks((prev) => [...prev, block]);
    if (block === "comparison" || block === "ageCheck") setRandomAge(Math.floor(Math.random() * 30) + 1);
  };

  const buildFullHTMLOutput = (): string => {
    const displayName = user?.name || "Student";
    const bodyContent = usedBlocks.includes("div") ? "  <div id=\"output\"></div>\n" : "";

    if (!usedBlocks.includes("script")) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset='UTF-8'>
    <title>JS Exam</title>
  </head>
  <body>
${bodyContent}  </body>
</html>`;
    }

    let scriptContent = "";
    if (usedBlocks.includes("let")) scriptContent += `    let name = "${displayName}";\n`;
    if (usedBlocks.includes("const")) scriptContent += `    const age = ${randomAge};\n`;
    if (usedBlocks.includes("function")) scriptContent += `    function greet() {\n    }\n`;
    if (usedBlocks.includes("console.log")) scriptContent += `    console.log("Hello, " + name + "!");\n`;

    if (usedBlocks.includes("if")) {
      const condition = usedBlocks.includes("comparison") ? `age >= ${randomAge}` : "";
      scriptContent += `    if (${condition}) {\n`;
      if (usedBlocks.includes("console-adult")) scriptContent += `      console.log("You are an adult!");\n`;
      if (usedBlocks.includes("else")) {
        scriptContent += `    } else {\n`;
        if (usedBlocks.includes("console-minor")) scriptContent += `      console.log("You are a minor!");\n`;
      }
      scriptContent += `    }\n`;
    }

    if (usedBlocks.includes("message")) scriptContent += `    let message = "Hello, " + name + "!<br>";\n`;
    if (usedBlocks.includes("ageCheck")) scriptContent += `    message += age >= 18 ? "You are an adult!" : "You are a minor!";\n`;
    if (usedBlocks.includes("display")) scriptContent += `    document.getElementById("output").innerHTML = message;\n`;
    if (usedBlocks.includes("function")) scriptContent += `    greet();\n`;

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset='UTF-8'>
    <title>JS Exam</title>
  </head>
  <body>
${bodyContent}  <script>
${scriptContent}  </script>
  </body>
</html>`;
  };

  const fullHTML = buildFullHTMLOutput();

  useEffect(() => {
  if (!lessonComplete || !user || loading) return;
  setShowCongrats(true);

  const logs: string[] = [];
  const displayName = user.name || "Student";

  if (usedBlocks.includes("let") && usedBlocks.includes("const") &&
      usedBlocks.includes("function") && usedBlocks.includes("console.log")) {
    logs.push(`Hello, ${displayName}!`);
  }

  if (lessonComplete && usedBlocks.includes("if") && usedBlocks.includes("comparison")) {
    if (randomAge >= 18 && usedBlocks.includes("console-adult")) logs.push("You are an adult!");
    else if (randomAge < 18 && usedBlocks.includes("console-minor")) logs.push("You are a minor!");
  }

  setOutput(logs.length > 0 ? logs.join("\n") : null);

  const saveExam = async () => {
    try {
      // Call backend endpoint (JS output not sent anymore)
      await axios.post("/api/lessons/javascript/quizzes");

      console.log("JS Exam marked completed successfully");
    } catch (err: any) {
      console.error("Failed to save JS exam:", err.response?.data || err.message);
    }

    // Confetti animation
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  saveExam();
}, [lessonComplete, usedBlocks, randomAge, user, loading]);


  if (loading) return <div>Loading user data...</div>;

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1 className="lesson-title">JavaScript Exam</h1>
            <p className="lesson-description">{message}</p>

            <h2 className="section-title">JS Blocks</h2>
            <div className="code-blocks">
              {allRequiredBlocks.map((block) => (
                <CodeBlockJavascriptExam
                  key={block}
                  tag={block}
                  onClick={handleBlockClick}
                  usedBlocks={usedBlocks}
                  randomAge={randomAge}
                  lessonComplete={lessonComplete}
                />
              ))}
            </div>
          </div>

          <div className="lesson-right">
            <h3 className="output-title">HTML + JS Preview</h3>
            <pre className="code-display">{fullHTML}</pre>

            <h4>Console Output</h4>
            {output && (
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "1rem",
                  minHeight: "50px",
                  backgroundColor: "#f9f9f9",
                  whiteSpace: "pre-wrap",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#2b9348",
                  textAlign: "center",
                }}
              >
                {output}
              </div>
            )}
          </div>
        </div>
        {showCongrats && (
          <div className="congrats-overlay" onClick={() => navigate('/dashboard')}>
            <div className="congrats-box">
              🎉 Congratulations! You completed the JavaScript Exam! 🎉
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Tap anywhere to return to dashboard</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JavaScriptExamContent;
