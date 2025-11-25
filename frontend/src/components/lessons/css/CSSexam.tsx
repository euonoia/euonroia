import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import CodeBlockCSSExam from "./CodeBlocks/CodeBlockCSSExam";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";
import confetti from "canvas-confetti";
import axios from "../../../utils/axiosClient";
import VerifyToken from "../../../components/auth/VerifyToken";

const CSSExamContent: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const blankOrder = ["style", "h1", "property", "valueColor", "propertyFont", "valueFont", "p"];
  const blankNumberMap: Record<string, number> = blankOrder.reduce((acc, tag, idx) => {
    acc[tag] = idx + 1;
    return acc;
  }, {} as Record<string, number>);

  const [blanks, setBlanks] = useState<Record<string, boolean>>(
    blankOrder.reduce((acc, tag) => ({ ...acc, [tag]: false }), {})
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [colorValue, setColorValue] = useState("red");
  const [fontSizeValue, setFontSizeValue] = useState("20px");
  const [shuffledBlocks, setShuffledBlocks] = useState(blankOrder);
  const [showCongrats, setShowCongrats] = useState(false);

  const colors = ["red", "blue", "green", "orange"];
  const fontSizes = ["15px", "20px", "24px", "30px"];

  useEffect(() => setShuffledBlocks([...blankOrder].sort(() => Math.random() - 0.5)), []);

  const handleBlockClick = (tag: string) => {
    if (tag !== blankOrder[activeIndex] || blanks[tag]) return;

    setBlanks(prev => ({ ...prev, [tag]: true }));

    if (tag === "valueColor") setColorValue(prev => colors[(colors.indexOf(prev) + 1) % colors.length]);
    if (tag === "valueFont") setFontSizeValue(prev => fontSizes[(fontSizes.indexOf(prev) + 1) % fontSizes.length]);

    setShuffledBlocks(prev => prev.filter(b => b !== tag));
    setActiveIndex(prevIdx => prevIdx + 1);
  };

  const showValue = (tag: string, correctValue: string) => blanks[tag] ? correctValue : blankNumberMap[tag].toString();
  const highlightStyle = "background-color:#fff3cd; border-radius:3px; padding:0 2px;";

  const buildSkeletonOutput = () => {
    const userName = "Student";
    const currentTag = blankOrder[activeIndex];

    const highlight = (tag: string, content: string) =>
      `<span style="${currentTag === tag ? highlightStyle : ""}">${content}</span>`;

    const h1Content = blanks.h1 ? `Hello, ${userName}` : "2";
    const pContent = blanks.p ? "This is a styled paragraph" : "7";

    const h1TagDisplay = blanks.h1 ? `&lt;h1&gt;${h1Content}&lt;/h1&gt;` : `&lt;2&gt;${h1Content}&lt;/2&gt;`;
    const pTagDisplay = blanks.p ? `&lt;p&gt;${pContent}&lt;/p&gt;` : `&lt;7&gt;${pContent}&lt;/7&gt;`;

    return `
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;Euonroia&lt;/title&gt;
    &lt;${highlight("style", showValue("style", "style"))}&gt;
      ${highlight("h1", showValue("h1", "h1"))} {
        ${highlight("property", showValue("property", "color"))}: ${highlight("valueColor", showValue("valueColor", colorValue))};
        ${highlight("propertyFont", showValue("propertyFont", "font-size"))}: ${highlight("valueFont", showValue("valueFont", fontSizeValue))};
      }
      ${highlight("p", showValue("p", "p"))} {
        ${highlight("property", showValue("property", "color"))}: ${highlight("valueColor", showValue("valueColor", colorValue))};
        ${highlight("propertyFont", showValue("propertyFont", "font-size"))}: ${highlight("valueFont", showValue("valueFont", fontSizeValue))};
      }
    &lt;/${highlight("style", showValue("style", "style"))}&gt;
  &lt;/head&gt;
  &lt;body&gt;
    ${h1TagDisplay}
    ${pTagDisplay}
  &lt;/body&gt;
&lt;/html&gt;
    `;
  };

  const buildLivePreview = () => {
    const userName = "Student";
    const h1Content = blanks.h1 ? `<h1 style="color: ${colorValue}; font-size: ${fontSizeValue};">Hello, ${userName}</h1>` : "";
    const pContent = blanks.p ? `<p style="color: ${colorValue}; font-size: ${fontSizeValue};">This is a styled paragraph</p>` : "";
    return `${h1Content}${pContent}`;
  };

  const isExamComplete = activeIndex >= blankOrder.length;

  useEffect(() => {
    if (!isExamComplete) return;
    setShowCongrats(true);

    const saveExam = async () => {
      try {
        const htmlOutput = buildSkeletonOutput();
        await axios.post("/api/lessons/css-basics/quizzes", { htmlOutput });
        console.log("CSS exam saved successfully");
      } catch (err: any) {
        console.error("Failed to save CSS exam:", err.response?.data || err.message);
      }

      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    };

    saveExam();
  }, [isExamComplete]);

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h2 className="lesson-title">CSS Quiz</h2>
            <p className="lesson-description">Answer the highlighted numbers</p>
            <div className="code-blocks" style={{ display: "flex", flexWrap: "wrap" }}>
              {shuffledBlocks.map(tag => {
                const labelMap: Record<string, string> = {
                  style: "style", h1: "h1", p: "p",
                  property: "color", valueColor: colorValue,
                  propertyFont: "font-size", valueFont: fontSizeValue
                };
                return (
                  <CodeBlockCSSExam
                    key={tag}
                    tag={tag}
                    label={labelMap[tag]}
                    isActive={blankOrder[activeIndex] === tag}
                    onClick={handleBlockClick}
                  />
                );
              })}
            </div>
            <button
              className="next-btn"
              onClick={() => navigate("/dashboard")}
              disabled={!isExamComplete}
              style={{ marginTop: "1rem" }}
            >
              FINISH EXAM
            </button>
          </div>

          <div className="lesson-right">
            <h3 className="output-title">HTML Output (Skeleton)</h3>
            <pre className="code-display" dangerouslySetInnerHTML={{ __html: buildSkeletonOutput() }} />
            <h3 className="output-title">Live Preview</h3>
            <div className="live-preview" dangerouslySetInnerHTML={{ __html: buildLivePreview() }} />
          </div>

        </div>
      </main>
      {showCongrats && (
        <div className="congrats-overlay" onClick={() => navigate('/dashboard')}>
          <div className="congrats-box">
            🎉 Congratulations! You completed the CSS Exam! 🎉
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Tap anywhere to return to dashboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CSSExam: React.FC = () => (
  <VerifyToken>
    <CSSExamContent />
  </VerifyToken>
);

export default CSSExam;
