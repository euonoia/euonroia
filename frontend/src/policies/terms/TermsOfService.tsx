import "../../styles/policy/terms-of-service.css";

const TermsOfService = () => {
  return (
    <div className="tos-container">
      <h1>Terms of Service</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to our learning platform. By accessing or using our website,
        services, or tools, you agree to be bound by the Terms listed below.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using our platform, you confirm that you have read, understood, and
        agreed to these Terms. If you do not agree, you must discontinue use of
        the service.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old to use the platform. Users under 18
        must have permission from a parent or guardian.
      </p>

      <h2>3. Your Account</h2>
      <p>You agree to:</p>
      <ul>
        <li>Keep your account details secure</li>
        <li>Provide accurate and updated information</li>
        <li>Be responsible for all activities under your account</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You may not:</p>
      <ul>
        <li>Use the platform for illegal or harmful purposes</li>
        <li>Harass, abuse, or impersonate other users</li>
        <li>
          Attempt to interfere with, hack, or damage the system or its services
        </li>
        <li>
          Reproduce, distribute, or exploit content without permission
        </li>
      </ul>

      <h2>5. Learning Content & Intellectual Property</h2>
      <p>
        All lessons, visuals, and interactive experiences belong to us or our
        partners. Users may not copy or distribute platform content without
        written permission.
      </p>

      <h2>6. Privacy</h2>
      <p>
        Your use of the platform is also governed by our{" "}
        <a href="/policies/privacy">Privacy Policy</a>.
      </p>

      <h2>7. Service Availability</h2>
      <p>
        We aim for stable uptime but do not guarantee continuous availability.
        We are not liable for outages or data loss.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these Terms or misuse
        the platform.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        The platform is provided “as is.” We are not responsible for direct,
        indirect, or consequential damages arising from use of the service.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these Terms at any time. Continued use of the platform
        means you accept any changes.
      </p>

      <h2>11. Contact</h2>
      <p>
        For questions about these Terms, contact us at:
        <br />
        <strong>kenespanola04@gmail.com</strong>
      </p>
    </div>
  );
};

export default TermsOfService;
