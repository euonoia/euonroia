import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/policy/PoliciesPage.css";

const PoliciesPage: React.FC = () => {
  const location = useLocation();

  // Helper to mark active tab
  const isActive = (path: string) => location.pathname.endsWith(path);

  return (
    <div className="policies-page">
      <Header />

      <main className="policies-main">
        <h1>Policies & Terms</h1>
        <p>Read our policies and terms below:</p>

        {/* Tab navigation */}
        <div className="policies-tabs">
          <Link to="privacy" className={isActive("privacy") ? "active" : ""}>
            Privacy Policy
          </Link>
          <Link to="terms" className={isActive("terms") ? "active" : ""}>
            Terms of Service
          </Link>
          <Link to="cookies" className={isActive("cookies") ? "active" : ""}>
            Cookie Policy
          </Link>
        </div>

        {/* Render child policy content */}
        <div className="policies-content">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliciesPage;
