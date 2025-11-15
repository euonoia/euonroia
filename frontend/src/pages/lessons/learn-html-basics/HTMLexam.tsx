import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from 'axios';
import CodeBlock from '../../../components/lessons/CodeBlock';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import "../../../styles/pages/lessons/LessonPage.css";
import VerifyToken from '../../../components/auth/VerifyToken';

const HTMLexamContent: React.FC = () => {
  const navigate = useNavigate();

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

  const [descriptions, setDescriptions] = useState({
    doctype: '', html: '', head: '', body: '', headings: '', paragraphs: '', links: '', images: ''
  });

  const handleBlockClick = (tag: string) => {
    const toggle = (current: boolean, setter: any, descKey: keyof typeof descriptions, descText: string) => {
      setter(!current);
      setDescriptions(prev => ({ ...prev, [descKey]: !current ? descText : '' }));
    };

    switch(tag) {
      case 'DOCTYPE': toggle(doctypeAdded, setDoctypeAdded, 'doctype', '<!DOCTYPE html> specifies the document type.'); break;
      case 'html': if(!doctypeAdded){ setErrorMessage('Add <!DOCTYPE html> first!'); return } toggle(htmlAdded, setHtmlAdded, 'html', '<html> is the root element.'); break;
      case 'head': if(!htmlAdded){ setErrorMessage('Add <html> first!'); return } toggle(headAdded, setHeadAdded, 'head', '<head> contains meta info.'); break;
      case 'body': if(!htmlAdded){ setErrorMessage('Add <html> first!'); return } toggle(bodyAdded, setBodyAdded, 'body', '<body> contains page content.'); break;
      case 'headings': if(!bodyAdded){ setErrorMessage('Add <body> first!'); return } toggle(headingsAdded, setHeadingsAdded, 'headings', 'Headings structure content.'); break;
      case 'paragraphs': if(!bodyAdded){ setErrorMessage('Add <body> first!'); return } toggle(paragraphsAdded, setParagraphsAdded, 'paragraphs', 'Paragraphs hold text.'); break;
      case 'links': if(!bodyAdded){ setErrorMessage('Add <body> first!'); return } toggle(linksAdded, setLinksAdded, 'links', 'Links navigate pages.'); break;
      case 'images': if(!bodyAdded){ setErrorMessage('Add <body> first!'); return } toggle(imagesAdded, setImagesAdded, 'images', 'Images are added with <img>.'); break;
    }

    setErrorMessage('');
  };

  const buildHtmlOutput = (): string => {
    const lines: string[] = [];
    if (!doctypeAdded && !htmlAdded && !bodyAdded) return 'Click blocks to build HTML structure';
    if (doctypeAdded) lines.push(`<!-- ${descriptions.doctype} -->\n<!DOCTYPE html>`);
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
  const isExamComplete = doctypeAdded && htmlAdded && headAdded && bodyAdded && headingsAdded && paragraphsAdded && linksAdded && imagesAdded;

  useEffect(() => {
    if (isExamComplete) {
      setShowCongrats(true);

      // Save to backend
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/lessons/html-basics/quizzes`, { htmlOutput }, { withCredentials: true })
        .then(res => console.log("Quiz saved:", res.data))
        .catch(err => console.error("Failed to save quiz:", err));

      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [isExamComplete, htmlOutput]);

  const handleCongratsClick = () => navigate('/dashboard');

  return (
    <div className="lesson-container">
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1>HTML Exam: Build Your HTML Document</h1>
            <p>Tap blocks to build your HTML structure. Tap again to undo.</p>
            <div className="code-blocks">
              {['DOCTYPE','html','head','body','headings','paragraphs','links','images'].map(tag => (
                <CodeBlock key={tag} tag={tag} onClick={() => handleBlockClick(tag)}
                  doctypeAdded={doctypeAdded} htmlAdded={htmlAdded} headAdded={headAdded} bodyAdded={bodyAdded}
                  headingsAdded={headingsAdded} paragraphsAdded={paragraphsAdded} linksAdded={linksAdded} imagesAdded={imagesAdded} />
              ))}
            </div>
          </div>
          <div className="lesson-right">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="html-output"><pre>{htmlOutput}</pre></div>
          </div>
        </div>
        {showCongrats && (
          <div className="congrats-overlay" onClick={handleCongratsClick}>
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

const HTMLexam: React.FC = () => {
  return (
    <VerifyToken>
      <HTMLexamContent />
    </VerifyToken>
  );
};

export default HTMLexam;
