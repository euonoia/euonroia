import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate
import CodeBlock from '../../../components/lessons/CodeBlock'; // Correct import path
import Header from '../../../components/header';  // Import Header from your components
import Footer from '../../../components/footer';  // Import Footer if necessary
import "../../../styles/pages/lessons/LessonPage.css";

const HTMLelements: React.FC = () => {
  const navigate = useNavigate();  // Hook for navigation
  
  // Track which elements have been added
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);

  // Track descriptions for each section
  const [descriptions, setDescriptions] = useState({
    headings: '',
    paragraphs: '',
    links: '',
    images: '',
  });

  // Handle block click to add description and update state
  const handleBlockClick = (tag: string) => {
    if (tag === 'headings') {
      setHeadingsAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        headings: 'Click to add headings.',
      }));
    }

    if (tag === 'paragraphs') {
      setParagraphsAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        paragraphs: 'Click to add paragraphs.',
      }));
    }

    if (tag === 'links') {
      setLinksAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        links: 'Click to add links.',
      }));
    }

    if (tag === 'images') {
      setImagesAdded(true);
      setDescriptions((prev) => ({
        ...prev,
        images: 'Click to add an image.',
      }));
    }
  };

  // Build the formatted HTML string based on the flags
  const buildHtmlOutput = (): string | null => {
    const lines: string[] = [];

    lines.push('<!DOCTYPE html>');
    lines.push('<html>');
    
    // Add the head content if the head is added
    if (headingsAdded) {
      lines.push('    <head>');
      lines.push('        <meta charset="UTF-8" />');
      lines.push('        <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
      lines.push('        <title>Euonroia</title>');
      lines.push('    </head>');
    }

    lines.push('    <body>');
    
    // Adding the elements dynamically
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
      lines.push('        <a href="https://euonroia.onrender.com///">This is a link</a>');
    }

    if (imagesAdded) {
      lines.push('        <img src="example.jpg" alt="example.com" width="104" height="142">');
    }

    lines.push('    </body>');
    lines.push('</html>');

    return lines.join('\n');
  };

  const htmlOutput = buildHtmlOutput();

  // Function to handle the Next button click
  const handleNextLesson = () => {
    // Navigate to the next lesson (update the path accordingly)
    navigate('/lessons/html-exam');  // Example: /next-lesson-path -> change this to your actual next lesson route
  };

  return (
    <div className={`lesson-container`}>
      {/* Include Header */}
      <Header />

      <main className="lesson-main">
        <div className="lesson-content">
          {/* Left Section */}
          <div className="lesson-left">
            <h1 className="lesson-title">Learn HTML: Headings, Paragraphs, Links & Images</h1>
            <p className="lesson-description">
              This lesson will show you how to add headings, paragraphs, links, and images to an HTML page. Tap on the blocks to build the structure.
            </p>

            <h2 className="section-title">HTML ELEMENTS</h2>

            {/* Tap-to-Select Code Blocks for HTML structure */}
            <div className="code-blocks">
              <CodeBlock
                tag="headings"
                onClick={handleBlockClick}
                headingsAdded={headingsAdded}
                paragraphsAdded={paragraphsAdded}
                linksAdded={linksAdded}
                imagesAdded={imagesAdded}
                doctypeAdded={false}
                htmlAdded={false}
                headAdded={false}
                bodyAdded={false}
              />
              <CodeBlock
                tag="paragraphs"
                onClick={handleBlockClick}
                headingsAdded={headingsAdded}
                paragraphsAdded={paragraphsAdded}
                linksAdded={linksAdded}
                imagesAdded={imagesAdded}
                doctypeAdded={false}
                htmlAdded={false}
                headAdded={false}
                bodyAdded={false}
              />
              <CodeBlock
                tag="links"
                onClick={handleBlockClick}
                headingsAdded={headingsAdded}
                paragraphsAdded={paragraphsAdded}
                linksAdded={linksAdded}
                imagesAdded={imagesAdded}
                doctypeAdded={false}
                htmlAdded={false}
                headAdded={false}
                bodyAdded={false}
              />
              <CodeBlock
                tag="images"
                onClick={handleBlockClick}
                headingsAdded={headingsAdded}
                paragraphsAdded={paragraphsAdded}
                linksAdded={linksAdded}
                imagesAdded={imagesAdded}
                doctypeAdded={false}
                htmlAdded={false}
                headAdded={false}
                bodyAdded={false}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="lesson-right">
            <div className="html-output">
              <h3>HTML Output:</h3>
              <pre>{htmlOutput || 'Click blocks to build your HTML structure'}</pre>
            </div>

            {/* Next Button */}
            <div className="next-btn-container">
              <button className="next-btn" onClick={handleNextLesson}>READY FOR EXAM?</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HTMLelements;
