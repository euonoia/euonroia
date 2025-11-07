import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from '../../../components/lessons/CodeBlock'; // Correct import path
import Header from '../../../components/header'; // Import Header
import Footer from '../../../components/footer'; // Import Footer
import "../../../styles/pages/lessons/LessonPage.css";

const HTMLexam: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  
  // Track which top-level pieces have been added
  const [doctypeAdded, setDoctypeAdded] = useState(false);
  const [htmlAdded, setHtmlAdded] = useState(false);
  const [headAdded, setHeadAdded] = useState(false);
  const [bodyAdded, setBodyAdded] = useState(false);
  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);

  // Track descriptions for each section
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

  // Handle block click to add description and update state
  const handleBlockClick = (tag: string) => {
    switch (tag) {
      case 'DOCTYPE':
        if (!doctypeAdded) {
          setDoctypeAdded(true);
          setDescriptions(prev => ({
            ...prev,
            doctype: '<!DOCTYPE html> specifies the document type and version (HTML5).'
          }));
        }
        break;
      case 'html':
        if (!htmlAdded) {
          setHtmlAdded(true);
          setDescriptions(prev => ({
            ...prev,
            html: '<html> is the root element of the page.'
          }));
        }
        break;
      case 'head':
        if (!headAdded) {
          setHeadAdded(true);
          setDescriptions(prev => ({
            ...prev,
            head: '<head> contains meta-information about the document.'
          }));
        }
        break;
      case 'body':
        if (!bodyAdded) {
          setBodyAdded(true);
          setDescriptions(prev => ({
            ...prev,
            body: '<body> contains the content that is visible to users.'
          }));
        }
        break;
      case 'headings':
        if (!headingsAdded) {
          setHeadingsAdded(true);
          setDescriptions(prev => ({
            ...prev,
            headings: 'Headings are used to structure the content and make it more readable.'
          }));
        }
        break;
      case 'paragraphs':
        if (!paragraphsAdded) {
          setParagraphsAdded(true);
          setDescriptions(prev => ({
            ...prev,
            paragraphs: 'Paragraphs contain blocks of text to explain or describe content.'
          }));
        }
        break;
      case 'links':
        if (!linksAdded) {
          setLinksAdded(true);
          setDescriptions(prev => ({
            ...prev,
            links: 'Links allow users to navigate to other pages or resources.'
          }));
        }
        break;
      case 'images':
        if (!imagesAdded) {
          setImagesAdded(true);
          setDescriptions(prev => ({
            ...prev,
            images: 'Images are embedded in the page using the <img> tag.'
          }));
        }
        break;
      default:
        break;
    }
  };

  // Build the formatted HTML string based on the flags
  const buildHtmlOutput = (): string | null => {
    const lines: string[] = [];

    if (doctypeAdded) lines.push('<!-- ' + descriptions.doctype + ' -->');
    if (doctypeAdded) lines.push('<!DOCTYPE html>');

    if (htmlAdded) {
      lines.push('<html>');
      if (headAdded) {
        lines.push('    <head>');
        lines.push('        <!-- ' + descriptions.head + ' -->');
        lines.push('        <meta charset="UTF-8" />');
        lines.push('        <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
        lines.push('        <title>HTML Exam</title>');
        lines.push('    </head>');
      }
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

    if (htmlAdded) {
      lines.push('</html>');
    }

    return lines.join('\n');
  };

  const htmlOutput = buildHtmlOutput();

  // Function to handle the Next Lesson button click
  const handleNextLesson = () => {
    // Navigate to the next lesson (update the path accordingly)
    navigate('/next-lesson-path'); // Example: /next-lesson-path -> change this to your actual next lesson route
  };

  return (
    <div className="lesson-container">
      {/* Include Header */}
      <Header />

      <main className="lesson-main">
        <div className="lesson-content">
          {/* Left Section */}
          <div className="lesson-left">
            <h1 className="lesson-title">HTML Exam: Build Your HTML Document</h1>
            <p className="lesson-description">
              This is a final exam to test your knowledge of HTML document structure and elements. Tap on the blocks to build your HTML structure.
            </p>

            {/* Tap-to-Select Code Blocks for HTML structure */}
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
              <CodeBlock 
                tag="headings" 
                onClick={handleBlockClick} 
                headingsAdded={headingsAdded} 
                doctypeAdded={false} 
                htmlAdded={false} 
                headAdded={false} 
                bodyAdded={false} 
              />
              <CodeBlock 
                tag="paragraphs" 
                onClick={handleBlockClick} 
                paragraphsAdded={paragraphsAdded} 
                doctypeAdded={false} 
                htmlAdded={false} 
                headAdded={false} 
                bodyAdded={false} 
              />
              <CodeBlock 
                tag="links" 
                onClick={handleBlockClick} 
                linksAdded={linksAdded} 
                doctypeAdded={false} 
                htmlAdded={false} 
                headAdded={false} 
                bodyAdded={false} 
              />
              <CodeBlock 
                tag="images" 
                onClick={handleBlockClick} 
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
              <button className="next-btn" onClick={handleNextLesson}>Next Lesson</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HTMLexam;
