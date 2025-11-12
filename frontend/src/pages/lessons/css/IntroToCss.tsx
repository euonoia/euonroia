// src/pages/lessons/css/IntroToCSS.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlockCSS from "../../../components/lessons/CodeBlockCSS";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";

const IntroToCSS: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userValid, setUserValid] = useState(false);

  const [selectorAdded, setSelectorAdded] = useState(false);
  const [propertyAdded, setPropertyAdded] = useState(false);
  const [valueAdded, setValueAdded] = useState(false);

  const [descriptions, setDescriptions] = useState({
    selector: "",
    property: "",
    value: "",
  });

  // --- Check JWT cookie on mount ---
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
  }, []);

  if (checkingAuth) return <div>Checking authentication...</div>;
  if (!userValid) return null;

  const handleBlockClick = (tag: string) => {
    if (tag === "selector" && !selectorAdded) {
      setSelectorAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        selector: "Selectors target the HTML elements you want to style.",
      }));
      return;
    }

    if (tag === "property" && !propertyAdded) {
      setPropertyAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        property: "Properties define what aspect of the element you want to change (e.g., color, font-size).",
      }));
      return;
    }

    if (tag === "value" && !valueAdded) {
      setValueAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        value: "Values specify how the property should be changed (e.g., red, 16px).",
      }));
      return;
    }
  };

const buildCssOutput = (): string | null => {
  if (!selectorAdded && !propertyAdded && !valueAdded) return null;

  const lines: string[] = [];

  if (selectorAdded) {
    lines.push(`/* ${descriptions.selector} */`);
    lines.push("p {");
  }

  if (propertyAdded) {
    if (valueAdded) {
      // When both property and value are added
      lines.push(
        `  /* ${descriptions.property} */`,
        `  color: red; /* ${descriptions.value} */`
      );
    } else {
      // Only property added so far
      lines.push(`  /* ${descriptions.property} */`, "  color:");
    }
  } else if (valueAdded) {
    // Edge case: value added before property
    lines.push(`  /* ${descriptions.value} */`, "  red;");
  }

  if (selectorAdded) lines.push("}");

  return lines.join("\n");
};

  const cssOutput = buildCssOutput();

  const handleNextLesson = () => {
    navigate("/lessons/css-sample"); // or your next CSS lesson route
  };

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1 className="lesson-title">Intro to CSS</h1>
            <p className="lesson-description">
              Tap the blocks to learn how CSS styles HTML elements.
            </p>

            <h2 className="section-title">CSS STRUCTURE</h2>
            <div className="code-blocks">
              {["selector", "property", "value"].map((tag) => (
                <CodeBlockCSS
                  key={tag}
                  tag={tag}
                  onClick={handleBlockClick}
                  selectorAdded={selectorAdded}
                  propertyAdded={propertyAdded}
                  valueAdded={valueAdded}
                />
              ))}
            </div>
          </div>

          <div className="lesson-right">
            <h3 className="output-title">CSS Output:</h3>
            <pre>{cssOutput || "Click the blocks to build a simple CSS rule"}</pre>
          </div>

          <div className="next-btn-container">
            <button
              className="next-btn"
              onClick={handleNextLesson}
              disabled={!selectorAdded || !propertyAdded || !valueAdded}
            >
              Next Lesson
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntroToCSS;
