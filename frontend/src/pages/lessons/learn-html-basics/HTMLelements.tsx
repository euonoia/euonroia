import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from '../../../components/lessons/CodeBlock';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import "../../../styles/pages/lessons/LessonPage.css";
import VerifyToken from '../../../components/auth/VerifyToken';

const HTMLelementsContent: React.FC = () => {
  const navigate = useNavigate();

  // Blocks
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);

  const [descriptions, setDescriptions] = useState({
    headings: '',
    paragraphs: '',
    links: '',
    images: '',
  });

  // --- BLOCK HANDLING ---
  const handleBlockClick = (tag: string) => {
    switch(tag) {
      case 'headings':
        setHeadingsAdded(true);
        setDescriptions(prev => ({ ...prev, headings: 'Click to add headings.' }));
        break;
      case 'paragraphs':
        setParagraphsAdded(true);
        setDescriptions(prev => ({ ...prev, paragraphs: 'Click to add paragraphs.' }));
        break;
      case 'links':
        setLinksAdded(true);
        setDescriptions(prev => ({ ...prev, links: 'Click to add links.' }));
        break;
      case 'images':
        setImagesAdded(true);
        setDescriptions(prev => ({ ...prev, images: 'Click to add an image.' }));
        break;
    }
  };

  const buildHtmlOutput = () => {
    const lines: string[] = [];
    lines.push('<!DOCTYPE html>');
    lines.push('<html>');
    lines.push('    <head>');
    lines.push('        <meta charset="UTF-8" />');
    lines.push('        <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    lines.push('        <title>Euonroia</title>');
    lines.push('    </head>');
    lines.push('    <body>');
    if (headingsAdded) lines.push('        <h1>This is heading 1</h1><h2>This is heading 2</h2><h3>This is heading 3</h3>');
    if (paragraphsAdded) lines.push('        <p>This is a paragraph.</p><p>This is another paragraph.</p>');
    if (linksAdded) lines.push('        <a href="https://euonroia.onrender.com///">This is a link</a>');
    if (imagesAdded) lines.push('        <img src="example.jpg" alt="example.com" width="104" height="142">');
    lines.push('    </body>');
    lines.push('</html>');
    return lines.join('\n');
  };

  const htmlOutput = buildHtmlOutput();

  const handleNextLesson = () => {
    navigate('/lessons/html-exam');
  };

  return (
    <div className="lesson-container">
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1 className="lesson-title">Learn HTML: Headings, Paragraphs, Links & Images</h1>
            <p className="lesson-description">
              Tap on the blocks to build your HTML structure.
            </p>
            <div className="code-blocks">
              {['headings','paragraphs','links','images'].map(tag => (
                <CodeBlock
                  key={tag}
                  tag={tag}
                  onClick={handleBlockClick}
                  headingsAdded={headingsAdded}
                  paragraphsAdded={paragraphsAdded}
                  linksAdded={linksAdded}
                  imagesAdded={imagesAdded}
                  doctypeAdded={true}
                  htmlAdded={true}
                  headAdded={true}
                  bodyAdded={true}
                />
              ))}
            </div>
          </div>
          <div className="lesson-right">
            <h3>HTML Output:</h3>
            <pre>{htmlOutput}</pre>
          </div>
          <div className="next-btn-container">
            <button className="next-btn" onClick={handleNextLesson}>READY FOR EXAM?</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const HTMLelements: React.FC = () => {
  return (
    <VerifyToken>
      <HTMLelementsContent />
    </VerifyToken>
  );
};

export default HTMLelements;
