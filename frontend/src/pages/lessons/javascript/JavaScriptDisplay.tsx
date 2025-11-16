import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import CodeBlockJavascriptDisplay from "../../../components/lessons/CodeBlockJavascriptDisplay";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext";
import VerifyToken from "../../../components/auth/VerifyToken";

const JavaScriptDisplayContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser();

  const [usedBlocks, setUsedBlocks] = useState<string[]>([]);
  const [randomAge, setRandomAge] = useState(Math.floor(Math.random() * 20) + 10);

  const allRequiredBlocks: ("div" | "message" | "ageCheck" | "display")[] = [
    "div",
    "message",
    "ageCheck",
    "display",
  ];

  const lessonComplete = allRequiredBlocks.every((b) => usedBlocks.includes(b));

  const handleBlockClick = (block: string) => {
    if (!usedBlocks.includes(block)) setUsedBlocks((prev) => [...prev, block]);
    if (block === "ageCheck") setRandomAge(Math.floor(Math.random() * 30) + 1);
  };

  useEffect(() => {
    const outputDiv = document.getElementById("output");
    if (!outputDiv) return;

    let messageStr = "";
    const displayName = user?.name || "Student";

    if (usedBlocks.includes("message")) messageStr = `Hello, ${displayName}!<br>`;
    if (usedBlocks.includes("ageCheck")) {
      messageStr += randomAge >= 18 ? "You are an adult!" : "You are a minor!";
    }
    if (usedBlocks.includes("display")) outputDiv.innerHTML = messageStr;
  }, [usedBlocks, randomAge, user?.name]);

  const buildFullHTMLOutput = (): string => {
    const displayName = user?.name || "Student";
    let bodyContent = "";
    let scriptContent = `
      let name = "${displayName}";
      const age = ${randomAge};
      function greet() {
        console.log("Hello, " + name + "!");
        if (age >= ${randomAge}) {
          console.log("You are an adult!");
        } else {
          console.log("You are a minor!");
        }`;

    if (usedBlocks.includes("message")) scriptContent += `\n    let message = "Hello, " + name + "!<br>";`;
    if (usedBlocks.includes("ageCheck"))
      scriptContent += `\n    message += age >= 18 ? "You are an adult!" : "You are a minor!";`;
    if (usedBlocks.includes("display"))
      scriptContent += `\n    document.getElementById("output").innerHTML = message;`;

    scriptContent += "\n  }\n  greet();";

    if (usedBlocks.includes("div")) bodyContent += '    <div id="output"></div>\n';

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset='UTF-8'>
    <title>JS Sample</title>
  </head>
  <body>
${bodyContent}    <script>${scriptContent}
    </script>
  </body>
</html>`;
  };

  const fullHTML = buildFullHTMLOutput();
  const handleNextLesson = () => navigate("/lessons/js-exam");

  if (loading) return <div>Loading user data...</div>;

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h1 className="lesson-title">Building a JS Program with Display</h1>
            <p className="lesson-description">Tap the blocks to build your program!</p>

            <h2 className="section-title">JS Blocks</h2>
            <div className="code-blocks">
              {allRequiredBlocks.map((block) => (
                <CodeBlockJavascriptDisplay
                  key={block}
                  tag={block}
                  onClick={handleBlockClick}
                  usedBlocks={usedBlocks}
                />
              ))}
            </div>
            <br />
            <div className="next-btn-container">
            <button className="next-btn" disabled={!lessonComplete} onClick={handleNextLesson}>
              READY FOR EXAM?
            </button>
          </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">HTML + JS Preview</h3>
            <pre className="code-display">{fullHTML}</pre>

            <h4>Output</h4>
            <div
              id="output"
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                minHeight: "50px",
                backgroundColor: "#f9f9f9",
              }}
            ></div>
          </div>
        </div>
      </main>
     
    </div>
  );
};

const JavaScriptDisplay: React.FC = () => (
  <VerifyToken>
    <JavaScriptDisplayContent />
  </VerifyToken>
);

export default JavaScriptDisplay;
