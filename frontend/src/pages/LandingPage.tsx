import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLaptopCode, FaGlobe, FaUsers } from "react-icons/fa";
import Header from '../components/header';
import Footer from '../components/footer';
import { useUser } from '../context/UserContext';
import "../styles/pages/LandingPage.css";

const LandingPage: FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const scrollToAbout = () => {
    const s = document.getElementById("about");
    s?.scrollIntoView({ behavior: "smooth" });
  };
  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="app-wrapper">
      <Header />

      <main className="app-main">
        <div className="landing-container">

          <div className="landing-main">

            {/* =======================
                HERO SECTION
            ======================= */}
            <section id="hero" className="hero-section full-screen-section">
              <div className="hero-content">
                <h1>Learn to code, even without a laptop.</h1>
                <p>Start your journey today!</p>

                <div className="hero-buttons">
                <button
                  className="hero-btn"
                  onClick={() => navigate("/lessons/html-basics")}
                >
                  Get Started
                </button>

               <button className="hero-btn hero-btn-outline" onClick={scrollToAbout}>
                About Us
                </button>
              </div>

              </div>
            </section>

            {/* =======================
                FEATURES SECTION
            ======================= */}
            <section id="features" className="features-section-wrapper full-screen-section">
              <div className="features-section-container">
                <div className="features-section">
                  <div className="feature-card">
                    <div className="feature-icon"><FaLaptopCode /></div>
                    <h2>Learn Web Development</h2>
                    <p>Hands-on lessons on HTML, CSS, JavaScript, and more.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon"><FaGlobe /></div>
                    <h2>Access Anywhere</h2>
                    <p>All you need is a device with a browser. No powerful laptop required.</p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon"><FaUsers /></div>
                    <h2>Community Support</h2>
                    <p>Join a growing community of learners</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
