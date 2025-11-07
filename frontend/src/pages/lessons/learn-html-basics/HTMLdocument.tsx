import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../../../components/lessons/CodeBlock";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import "../../../styles/pages/lessons/LessonPage.css";
import { useTheme } from "../../../context/ThemeContext";

const HTMLdocument: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [doctypeAdded, setDoctypeAdded] = useState(false);
  const [htmlAdded, setHtmlAdded] = useState(false);
  const [headAdded, setHeadAdded] = useState(false);
  const [bodyAdded, setBodyAdded] = useState(false);

  const [descriptions, setDescriptions] = useState({
    doctype: '',
    html: '',
    head: '',
    body: '',
  });

  const handleBlockClick = (tag: string) => {
    if (tag === "DOCTYPE") {
      if (!doctypeAdded) {
        setDoctypeAdded(true);
        setDescriptions((prev) => ({
          ...prev,
          doctype: "<!DOCTYPE html> specifies the document type and version (HTML5).",
        }));
      }
      return;
    }

    if (tag === "html") {
      if (!htmlAdded) {
        setHtmlAdded(true);
        setDescriptions((prev) => ({
          ...prev,
          html: "<html> is the root element of the page.",
        }));
      }
      return;
    }

    if (tag === "head") {
      setHeadAdded(true);
      if (!htmlAdded) setHtmlAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        head: "<head> contains meta-information about the document.",
      }));
      return;
    }

    if (tag === "body") {
      setBodyAdded(true);
      if (!htmlAdded) setHtmlAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        body: "<body> contains the content that is visible to users.",
      }));
      return;
    }
  };

  const buildHtmlOutput = (): string | null => {
    if (!doctypeAdded && !htmlAdded && !headAdded && !bodyAdded) return null;

    const lines: string[] = [];

    if (doctypeAdded) {
      lines.push("<!-- " + descriptions.doctype + " -->");
      lines.push("<!DOCTYPE html>");
    }

    if (htmlAdded) {
      lines.push("<html>");
      lines.push("    <!-- " + descriptions.html + " -->");
    }

    if (headAdded) {
      lines.push("    <head>");
      lines.push("        <!-- " + descriptions.head + " -->");
      lines.push("    </head>");
    }

    if (bodyAdded) {
      lines.push("    <body>");
      lines.push("        <!-- " + descriptions.body + " -->");
      lines.push("    </body>");
    }

    if (htmlAdded) {
      lines.push("</html>");
    }

    return lines.join("\n");
  };

  const htmlOutput = buildHtmlOutput();

  const handleNextLesson = () => {
    navigate("/lessons/html-elements");
  };

  return (
    <div className={`lesson-container ${theme}`}>
      <Header />

      <main className="lesson-main">
        <div className="lesson-content">
          {/* Left Section */}
          <div className="lesson-left">
            <h1 className="lesson-title">Learn HTML Basics</h1>
            <p className="lesson-description">
              In this lesson, you’ll learn about the basic structure of an HTML document. Tap the blocks to build it.
            </p>

            <h2 className="section-title">HTML DOCUMENT STRUCTURE</h2>

            <div className="code-blocks">
              <CodeBlock
                tag="DOCTYPE"
                onClick={handleBlockClick}
                doctypeAdded={doctypeAdded}
                htmlAdded={htmlAdded}
                headAdded={headAdded}
                bodyAdded={bodyAdded}
              />
              <CodeBlock
                tag="html"
                onClick={handleBlockClick}
                doctypeAdded={doctypeAdded}
                htmlAdded={htmlAdded}
                headAdded={headAdded}
                bodyAdded={bodyAdded}
              />
              <CodeBlock
                tag="head"
                onClick={handleBlockClick}
                doctypeAdded={doctypeAdded}
                htmlAdded={htmlAdded}
                headAdded={headAdded}
                bodyAdded={bodyAdded}
              />
              <CodeBlock
                tag="body"
                onClick={handleBlockClick}
                doctypeAdded={doctypeAdded}
                htmlAdded={htmlAdded}
                headAdded={headAdded}
                bodyAdded={bodyAdded}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="lesson-right">
            <div className="html-output">
              <h3 className="output-title">HTML Output:</h3>
              <pre>{htmlOutput || "Click blocks to build your HTML structure"}</pre>
            </div>
          </div>

            <div className="next-btn-container">
              <button
                className="next-btn"
                onClick={handleNextLesson}
                disabled={!doctypeAdded || !htmlAdded || !headAdded || !bodyAdded}
              >
                Next Lesson
              </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default HTMLdocument;
