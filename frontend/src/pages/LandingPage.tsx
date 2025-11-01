import { FC } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/pages/LandingPage.css"; 

const LandingPage: FC = () => {
  return (
    <div className="landing-container">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Euonroia</h1>
        <p>Learn to code, even without a laptop. Start your journey today!</p>
        <Link to="/signup" className="btn-primary">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <h2>Learn Web Development</h2>
          <p>Hands-on lessons on HTML, CSS, JavaScript, and more.</p>
        </div>
        <div className="feature-card">
          <h2>Access Anywhere</h2>
          <p>All you need is a device with a browser. No powerful laptop required.</p>
        </div>
        <div className="feature-card">
          <h2>Community Support</h2>
          <p>Join a growing community of learners and mentors to guide you.</p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <Link to="/signup" className="btn-success">
          Join Now
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
