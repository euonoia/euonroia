import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from '../../../../utils/axiosClient';
import CodeBlock from '../CodeBlock/CodeBlock';
import Header from '../../../../components/header';
import '../../../../styles/pages/lessons/LessonPage.css';
import { useUser } from '../../../../context/UserContext';
import { shuffleArray } from '../utils/shuffleArray';

const HTMLexamContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [doctypeAdded, setDoctypeAdded] = useState(false);
  const [htmlAdded, setHtmlAdded] = useState(false);
  const [headAdded, setHeadAdded] = useState(false);
  const [bodyAdded, setBodyAdded] = useState(false);
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [descriptions, setDescriptions] = useState({
    doctype: '', html: '', head: '', body: '', headings: '', paragraphs: '', links: '', images: ''
  });

  const [availableBlocks, setAvailableBlocks] = useState(() =>
    shuffleArray(['DOCTYPE', 'html', 'head', 'body', 'headings', 'paragraphs', 'links', 'images'])
  );

  const handleBlockClick = (tag: string) => {
    setActiveTag(tag);
    const addBlock = (
      descKey: keyof typeof descriptions,
      descText: string,
      setter: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      setDescriptions(prev => ({ ...prev, [descKey]: descText }));
      setter(true);
      setAvailableBlocks(prev => prev.filter(block => block !== tag));
    };

    switch(tag) {
      case 'DOCTYPE':
        addBlock('doctype', '<!DOCTYPE html> specifies the document type.', setDoctypeAdded);
        break;
      case 'html':
        if (!doctypeAdded) { setErrorMessage('Add <!DOCTYPE html> first!'); return; }
        addBlock('html', '<html> is the root element.', setHtmlAdded);
        break;
      case 'head':
        if (!htmlAdded) { setErrorMessage('Add <html> first!'); return; }
        addBlock('head', '<head> contains meta info.', setHeadAdded);
        break;
      case 'body':
        if (!htmlAdded) { setErrorMessage('Add <html> first!'); return; }
        addBlock('body', '<body> contains page content.', setBodyAdded);
        break;
      case 'headings':
        if (!bodyAdded) { setErrorMessage('Add <body> first!'); return; }
        addBlock('headings', 'Headings structure content.', setHeadingsAdded);
        break;
      case 'paragraphs':
        if (!bodyAdded) { setErrorMessage('Add <body> first!'); return; }
        addBlock('paragraphs', 'Paragraphs hold text.', setParagraphsAdded);
        break;
      case 'links':
        if (!bodyAdded) { setErrorMessage('Add <body> first!'); return; }
        addBlock('links', 'Links navigate pages.', setLinksAdded);
        break;
      case 'images':
        if (!bodyAdded) { setErrorMessage('Add <body> first!'); return; }
        addBlock('images', 'Images are added with <img>.', setImagesAdded);
        break;
    }

    setErrorMessage('');
  };

  const buildHtmlOutput = (): string => {
    const lines: string[] = [];
    if (!doctypeAdded && !htmlAdded && !bodyAdded) return 'Click blocks to build HTML structure';
    if (doctypeAdded) { lines.push(`<!-- ${descriptions.doctype} -->`); lines.push('<!DOCTYPE html>'); }
    if (htmlAdded) {
      lines.push('<html>');
      if (headAdded) {
        lines.push('  <head>');
        lines.push(`    <!-- ${descriptions.head} -->`);
        lines.push('    <meta charset="UTF-8" />');
        lines.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
        lines.push('    <title>HTML Exam</title>');
        lines.push('  </head>');
      }
      if (bodyAdded) {
        lines.push('  <body>');
        if (headingsAdded) lines.push('    <h1>Heading 1</h1>\n    <h2>Heading 2</h2>');
        if (paragraphsAdded) lines.push('    <p>Paragraph</p>');
        if (linksAdded) lines.push('    <a href="#">Link</a>');
        if (imagesAdded) lines.push('    <img src="example.jpg" alt="Example" />');
        lines.push('  </body>');
      }
      lines.push('</html>');
    }
    return lines.join('\n');
  };

  const htmlOutput = buildHtmlOutput();
  const isExamComplete =
    doctypeAdded && htmlAdded && headAdded && bodyAdded &&
    headingsAdded && paragraphsAdded && linksAdded && imagesAdded;

  // ✅ POST exam and badge only when user exists & exam complete
  useEffect(() => {
    if (!isExamComplete || !user || loading) return;
    setShowCongrats(true);

    const saveExam = async () => {
      try {
        // Use axiosClient → automatically sends CSRF + cookies
        await axios.post(`/api/lessons/html-basics/quizzes`, { htmlOutput });

        await axios.post(`/api/badges/check`, { uid: user.uid, badgeId: "first_lesson" });

        console.log("Exam saved and badge awarded successfully");
      } catch (err: any) {
        console.error("Failed to save exam or award badge:", err.response?.data || err.message);
      }

      // Confetti
      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    };

    saveExam();
  }, [isExamComplete, htmlOutput, user, loading]);

  return (
    <div className="lesson-container">
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1>HTML Exam: Build Your HTML Document</h1>
            <p>Tap blocks to build your HTML structure.</p>
            <div className="code-blocks">
              {availableBlocks.map(tag => (
                <CodeBlock
                  key={tag}
                  tag={tag}
                  onClick={() => handleBlockClick(tag)}
                  isActive={activeTag === tag}
                  doctypeAdded={doctypeAdded}
                  htmlAdded={htmlAdded}
                  headAdded={headAdded}
                  bodyAdded={bodyAdded}
                  headingsAdded={headingsAdded}
                  paragraphsAdded={paragraphsAdded}
                  linksAdded={linksAdded}
                  imagesAdded={imagesAdded}
                />
              ))}
            </div>
          </div>

          <div className="lesson-right">
            <h3 className="output-title">HTML Output:</h3>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <pre className="html-output">{htmlOutput}</pre>
          </div>
        </div>

        {showCongrats && (
          <div className="congrats-overlay" onClick={() => navigate('/dashboard')}>
            <div className="congrats-box">
              🎉 Congratulations! You completed the HTML Exam! 🎉
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Tap anywhere to return to dashboard</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HTMLexamContent;
