import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';  // Import Header
import Footer from '../../components/footer';  // Import Footer
import "../../styles/pages/lessons/LessonPage.css";

const Greetings: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has visited before using localStorage
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      // It's their first time visiting, show the greeting
      setIsFirstVisit(true);
      // Set localStorage to remember that the user has visited
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  // Function to handle "Start Lesson" button click
  const handleStartLesson = () => {
    // Redirect to the lesson page after greeting
    navigate('/lessons/html-basics'); // Adjust this to your first lesson route
  };

  return (
    <div className="lesson-container">
      {/* Include Header */}
      <Header />

      <main className="lesson-main">
        <div className="lesson-content">
          {/* Greeting Message */}
          {isFirstVisit && (
            <div className="greeting-message">
              <h1>Welcome to the HTML Learning Journey!</h1>
              <p>
                We're excited to have you here! This will be your first step in learning HTML, and we’ll guide you through the basics.
                Tap the blocks to start building your first HTML document.
              </p>
              <button className="start-btn" onClick={handleStartLesson}>
                Start Your First Lesson
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Greetings;
