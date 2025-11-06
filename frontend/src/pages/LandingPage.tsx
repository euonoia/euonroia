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

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="landing-container">
      {/* Hide user info in Header for landing page */}
      <Header hideUser={true} />

      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <p>Learn to code, even without a laptop. Start your journey today!</p>
        </section>

        {/* Features Section */}
        <section className="features-section">
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
            <p>Join a growing community of learners and mentors to guide you.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
