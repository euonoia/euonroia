import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode, FaMobileAlt, FaSmile } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import "../../styles/onboarding/welcomeScreen.css";

interface Slide {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const slides: Slide[] = [
    {
      icon: <FaSmile size={64} color="var(--accent)" />,
      title: "Welcome to Euonroia",
      description:
        "Learning to code shouldn’t feel scary — here, it’s fun and interactive. Let’s get started!",
    },
    {
      icon: <FaLaptopCode size={64} color="var(--accent)" />,
      title: "Small Steps, Big Wins",
      description:
        "Tap, explore, and build with small steps. Progress feels rewarding at every tap!",
    },
    {
      icon: <FaMobileAlt size={64} color="var(--accent)" />,
      title: "Learn Anywhere",
      description:
        "Mobile-first learning that fits your schedule. Code wherever inspiration strikes!",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState<string>(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  // Listen to theme changes dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const logoSrc = theme === "dark" ? "/Euonroia_Dark.png" : "/Euonroia_Light.png";

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => (prev + 1) % slides.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
    trackMouse: true,
  });

  return (
    <section className="welcome-hero" {...handlers}>
      <div className="welcome-container">
        {/* LEFT COLUMN */}
        <div className="left-column">
          <div className="slide-section">
            <div className="slide-card">
              <div className="slide-header">
                <h2 className="slide-title">
                  {slides[currentSlide].title.split(" ").map((word, idx) =>
                    ["Euonroia", "Wins", "Anywhere"].includes(word) ? (
                      <span key={idx} className="highlight">{word}</span>
                    ) : (
                      <span key={idx}>{word} </span>
                    )
                  )}
                </h2>
                <div className="slide-icon">{slides[currentSlide].icon}</div>
              </div>
              <p className="slide-description">{slides[currentSlide].description}</p>
            </div>
          </div>

          {/* Dots below the slide */}
          <div className="slide-dots">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="logo-section">
          <img src={logoSrc} alt="Euonroia Logo" className="euonroia-logo" />
          {currentSlide === slides.length - 1 && (
            <button
              className="continue-button"
              onClick={() => navigate("/onboarding")}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
