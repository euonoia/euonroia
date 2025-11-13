import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlockJavascript from "../../../components/lessons/CodeBlockJavascript";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import { useUser } from "../../../context/UserContext"; // ✅ Import your user context
import axios from "axios";

const JavaScriptBasics: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading } = useUser(); // ✅ Get logged-in user

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userValid, setUserValid] = useState(false);

  const [letUsed, setLetUsed] = useState(false);
  const [constUsed, setConstUsed] = useState(false);
  const [functionUsed, setFunctionUsed] = useState(false);
  const [consoleUsed, setConsoleUsed] = useState(false);

  const [outputMessage, setOutputMessage] = useState<string | null>(null);

  const [descriptions, setDescriptions] = useState({
    let: "",
    const: "",
    function: "",
    console: "",
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        setUserValid(true);
      } catch {
        setUserValid(false);
        navigate("/");
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyToken();
  }, [navigate]);

  if (checkingAuth || loading) return <div>Checking authentication...</div>;
  if (!userValid) return null;

  const handleBlockClick = (block: string) => {
    if (block === "let" && !letUsed) {
      setLetUsed(true);
      setDescriptions((prev) => ({
        ...prev,
        let: "let declares a variable that can be reassigned.",
      }));
    }

    if (block === "const" && !constUsed) {
      setConstUsed(true);
      setDescriptions((prev) => ({
        ...prev,
        const: "const declares a variable that cannot be reassigned.",
      }));
    }

    if (block === "function" && !functionUsed) {
      setFunctionUsed(true);
      setDescriptions((prev) => ({
        ...prev,
        function: "Functions are reusable blocks of code that perform a task.",
      }));
    }

    if (block === "console.log" && !consoleUsed) {
      setConsoleUsed(true);
      setDescriptions((prev) => ({
        ...prev,
        console: "console.log() prints information to the browser console.",
      }));

      // ✅ Simulate JS output using logged-in user's name
      setTimeout(() => {
        const name = user?.name || "Student";
        const age = 20;
        const greet = () => `Hello, ${name}! You are ${age} years old.`;
        setOutputMessage(greet());
      }, 400);
    }
  };

  const buildJsOutput = (): string | null => {
    if (!letUsed && !constUsed && !functionUsed && !consoleUsed) return null;

    const nameValue = user?.name || "Student"; // ✅ Use user name in code text
    const lines: string[] = [];

    if (letUsed) {
      lines.push(`// ${descriptions.let}`);
      lines.push(`let name = "${nameValue}";`);
      lines.push("");
    }

    if (constUsed) {
      lines.push(`// ${descriptions.const}`);
      lines.push(`const age = 20;`);
      lines.push("");
    }

    if (functionUsed) {
      lines.push(`// ${descriptions.function}`);
      lines.push(`function greet() {`);
      lines.push(`  return "Hello, " + name + "! You are " + age + " years old.";`);
      lines.push(`}`);
      lines.push("");
    }

    if (consoleUsed) {
      lines.push(`// ${descriptions.console}`);
      lines.push(`console.log(greet());`);
    }

    return lines.join("\n");
  };

  const jsOutput = buildJsOutput();

  const handleNextLesson = () => {
    navigate("/lessons/js-maintenance");
  };

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* LEFT SIDE */}
          <div className="lesson-left">
            <h1 className="lesson-title">Learn JavaScript Basics</h1>
            <p className="lesson-description">
              Tap the blocks to learn how JavaScript works — variables, constants, functions, and output!
            </p>

            <h2 className="section-title">JAVASCRIPT FUNDAMENTALS</h2>
            <div className="code-blocks">
              {["let", "const", "function", "console.log"].map((block) => (
                <CodeBlockJavascript
                  key={block}
                  tag={block}
                  onClick={handleBlockClick}
                  letUsed={letUsed}
                  constUsed={constUsed}
                  functionUsed={functionUsed}
                  consoleUsed={consoleUsed}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lesson-right">
            <h3 className="output-title">JavaScript Output:</h3>
            <pre className="code-display">
              {jsOutput || "Tap the blocks to build your JavaScript example"}
            </pre>

            {consoleUsed && (
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
                {outputMessage || "Running..."}
              </div>
            )}
          </div>

          {/* NEXT LESSON BUTTON */}
          <div className="next-btn-container">
            <button
              className="next-btn"
              onClick={handleNextLesson}
              disabled={!letUsed || !constUsed || !functionUsed || !consoleUsed}
            >
              Next Lesson
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JavaScriptBasics;
