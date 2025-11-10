import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import CodeBlock from '../../../components/lessons/CodeBlock';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import "../../../styles/pages/lessons/LessonPage.css";

const HTMLexam: React.FC = () => {
  const navigate = useNavigate();

  // Track which blocks have been added
  const [doctypeAdded, setDoctypeAdded] = useState(false);
  const [htmlAdded, setHtmlAdded] = useState(false);
  const [headAdded, setHeadAdded] = useState(false);
  const [bodyAdded, setBodyAdded] = useState(false);
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // Descriptions for each block
  const [descriptions, setDescriptions] = useState({
    doctype: '',
    html: '',
    head: '',
    body: '',
    headings: '',
    paragraphs: '',
    links: '',
    images: '',
  });

  // Error message
  const [errorMessage, setErrorMessage] = useState('');

  const handleBlockClick = (tag: string) => {
    const toggle = (
      current: boolean,
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      descKey: keyof typeof descriptions,
      descText: string
    ) => {
      if (current) {
        setter(false);
        setDescriptions(prev => ({ ...prev, [descKey]: '' }));
      } else {
        setter(true);
        setDescriptions(prev => ({ ...prev, [descKey]: descText }));
      }
    };

    switch(tag) {
      case 'DOCTYPE':
        toggle(doctypeAdded, setDoctypeAdded, 'doctype', '<!DOCTYPE html> specifies the document type and version (HTML5).');
        setErrorMessage('');
        break;
      case 'html':
        if (!doctypeAdded) { setErrorMessage('Error: Add <!DOCTYPE html> first!'); return; }
        toggle(htmlAdded, setHtmlAdded, 'html', '<html> is the root element of the page.');
        setErrorMessage('');
        break;
      case 'head':
        if (!htmlAdded) { setErrorMessage('Error: Add <html> first!'); return; }
        toggle(headAdded, setHeadAdded, 'head', '<head> contains meta-information about the document.');
        setErrorMessage('');
        break;
      case 'body':
        if (!htmlAdded) { setErrorMessage('Error: Add <html> first!'); return; }
        toggle(bodyAdded, setBodyAdded, 'body', '<body> contains the content that is visible to users.');
        setErrorMessage('');
        break;
      case 'headings':
        if (!bodyAdded) { setErrorMessage('Error: Add <body> first!'); return; }
        toggle(headingsAdded, setHeadingsAdded, 'headings', 'Headings are used to structure the content.');
        setErrorMessage('');
        break;
      case 'paragraphs':
        if (!bodyAdded) { setErrorMessage('Error: Add <body> first!'); return; }
        toggle(paragraphsAdded, setParagraphsAdded, 'paragraphs', 'Paragraphs contain blocks of text.');
        setErrorMessage('');
        break;
      case 'links':
        if (!bodyAdded) { setErrorMessage('Error: Add <body> first!'); return; }
        toggle(linksAdded, setLinksAdded, 'links', 'Links allow navigation to other pages.');
        setErrorMessage('');
        break;
      case 'images':
        if (!bodyAdded) { setErrorMessage('Error: Add <body> first!'); return; }
        toggle(imagesAdded, setImagesAdded, 'images', 'Images are embedded using <img> tags.');
        setErrorMessage('');
        break;
    }
  };

  const buildHtmlOutput = (): string => {
    const lines: string[] = [];
    if (!doctypeAdded && !htmlAdded && !bodyAdded) return 'Click blocks to build your HTML structure';
    if (doctypeAdded) {
      lines.push(`<!-- ${descriptions.doctype} -->`);
      lines.push('<!DOCTYPE html>');
    }
    if (htmlAdded) {
      lines.push('<html>');
      if (headAdded) {
        lines.push('    <head>');
        lines.push(`        <!-- ${descriptions.head} -->`);
        lines.push('        <meta charset="UTF-8" />');
        lines.push('        <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
        lines.push('        <title>HTML Exam</title>');
        lines.push('    </head>');
      }
      if (bodyAdded) {
        lines.push('    <body>');
        if (headingsAdded) {
          lines.push('        <h1>This is heading 1</h1>');
          lines.push('        <h2>This is heading 2</h2>');
          lines.push('        <h3>This is heading 3</h3>');
        }
        if (paragraphsAdded) {
          lines.push('        <p>This is a paragraph.</p>');
          lines.push('        <p>This is another paragraph.</p>');
        }
        if (linksAdded) {
          lines.push('        <a href="https://www.example.com">This is a link</a>');
        }
        if (imagesAdded) {
          lines.push('        <img src="example.jpg" alt="Example" width="104" height="142" />');
        }
        lines.push('    </body>');
      }
      lines.push('</html>');
    }
    return lines.join('\n');
  };

  const htmlOutput = buildHtmlOutput();
  const isExamComplete = doctypeAdded && htmlAdded && headAdded && bodyAdded &&
                         headingsAdded && paragraphsAdded && linksAdded && imagesAdded;

  // Show congrats & confetti
  useEffect(() => {
    if (isExamComplete) {
      setShowCongrats(true);

      const duration = 3 * 1000; // 3s
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [isExamComplete]);

  // When congrats overlay is tapped
  const handleCongratsClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="lesson-container">
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          {/* Left side: blocks */}
          <div className="lesson-left">
            <h1 className="lesson-title">HTML Exam: Build Your HTML Document</h1>
            <p className="lesson-description">
              Tap on the blocks to build your HTML structure. Tap again to undo.
            </p>
            <div className="code-blocks">
              {['DOCTYPE','html','head','body','headings','paragraphs','links','images'].map(tag => (
                <CodeBlock
                  key={tag}
                  tag={tag}
                  onClick={() => handleBlockClick(tag)}
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
            {/* Removed Next Lesson Button */}
          </div>

          {/* Right side: HTML output + errors */}
          <div className="lesson-right">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="html-output">
              <h3>HTML Output:</h3>
              <pre>{htmlOutput}</pre>
            </div>
          </div>
        </div>

        {/* Congratulations overlay */}
        {showCongrats && (
          <div className="congrats-overlay" onClick={handleCongratsClick}>
            <div className="congrats-box">
              🎉 Congratulations! You completed the HTML Exam! 🎉
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Tap anywhere to return to the dashboard
              </p>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default HTMLexam;
