import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock from '../CodeBlock/CodeBlock';
import Header from '../../../../components/header';
import Footer from '../../../../components/footer';
import '../../../../styles/pages/lessons/LessonPage.css';

const HTMLelementsContent: React.FC = () => {
  const navigate = useNavigate();

  const [headingsAdded, setHeadingsAdded] = useState(false);
  const [paragraphsAdded, setParagraphsAdded] = useState(false);
  const [linksAdded, setLinksAdded] = useState(false);
  const [imagesAdded, setImagesAdded] = useState(false);

  const handleBlockClick = (tag: string) => {
    switch(tag) {
      case 'headings': setHeadingsAdded(true); break;
      case 'paragraphs': setParagraphsAdded(true); break;
      case 'links': setLinksAdded(true); break;
      case 'images': setImagesAdded(true); break;
    }
  };

  const buildHtmlOutput = () => {
    const lines: React.ReactNode[] = [];

    lines.push(<span key="doctype">&lt;!DOCTYPE html&gt;</span>);
    lines.push(<br key="br1" />);
    lines.push(<span key="html">&lt;html&gt;</span>);
    lines.push(<br key="br2" />);
    lines.push(<span key="head">&nbsp;&nbsp;&lt;head&gt;</span>);
    lines.push(<br key="br3" />);
    lines.push(<span key="meta">&nbsp;&nbsp;&nbsp;&nbsp;&lt;meta charset="UTF-8" /&gt;</span>);
    lines.push(<br key="br4" />);
    lines.push(<span key="viewport">&nbsp;&nbsp;&nbsp;&nbsp;&lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;</span>);
    lines.push(<br key="br5" />);
    lines.push(<span key="title">&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Euonroia&lt;/title&gt;</span>);
    lines.push(<br key="br6" />);
    lines.push(<span key="headClose">&nbsp;&nbsp;&lt;/head&gt;</span>);
    lines.push(<br key="br7" />);
    lines.push(<span key="body">&nbsp;&nbsp;&lt;body&gt;</span>);
    lines.push(<br key="br8" />);

    if (headingsAdded) {
      ['h1','h2','h3'].forEach((tag, i) => {
        lines.push(
          <span key={tag} style={{ color: "#0a5300" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;{tag}&gt;This is {tag}&lt;/{tag}&gt;
          </span>
        );
        lines.push(<br key={`br-${i}`} />);
      });
    }

    if (paragraphsAdded) {
      lines.push(
        <span key="paragraphs" style={{ color: '#0a5300' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;This is a paragraph.&lt;/p&gt;&lt;p&gt;This is another paragraph.&lt;/p&gt;
        </span>
      );
      lines.push(<br key="br10" />);
    }

    if (linksAdded) {
      lines.push(
        <span key="links" style={{ color: '#0a5300' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="https://euonroia.onrender.com/"&gt;This is a link&lt;/a&gt;
        </span>
      );
      lines.push(<br key="br11" />);
    }

    if (imagesAdded) {
      lines.push(
        <span key="images" style={{ color: '#0a5300' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="example.jpg" alt="example.com" width="104" height="142" /&gt;
        </span>
      );
      lines.push(<br key="br12" />);
    }

    lines.push(<span key="bodyClose">&nbsp;&nbsp;&lt;/body&gt;</span>);
    lines.push(<br key="br13" />);
    lines.push(<span key="htmlClose">&lt;/html&gt;</span>);

    return lines;
  };

  const htmlOutput = buildHtmlOutput();

  return (
    <div className="lesson-container">
      <Header />
      <main className="lesson-main">
        <div className="lesson-content">
          <div className="lesson-left">
            <h1 className="lesson-title">Learn HTML: Headings, Paragraphs, Links & Images</h1>
            <p className="lesson-description">Tap on the blocks to build your HTML structure.</p>

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
                />
              ))}
            </div>
          </div>

          <div className="lesson-right">
            <h3>HTML Output:</h3>
            <pre>{htmlOutput}</pre>
          </div>

          <div className="next-btn-container">
            <button className="next-btn" onClick={() => navigate('/lessons/html-exam')}>READY FOR EXAM?</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HTMLelementsContent;
