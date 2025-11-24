import "../../styles/policy/privacy-policy.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, store, and protect your information when you use our
        learning platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <ul>
        <li>
          <strong>Account Information:</strong> Email, username, and other
          details you provide when registering.
        </li>
        <li>
          <strong>Usage Data:</strong> Actions taken on the platform such as
          lesson progress, quiz results, and interaction logs.
        </li>
       <li>
          <strong>Device Information:</strong> Browser type, device type, general system
          data, and a hashed version of your IP address. For privacy protection, we do
          not store your raw IP address — instead, we encrypt (hash) it using the
          SHA-256 algorithm before saving it.
        </li>
        <li>
          <strong>Cookies & Tracking Data:</strong> Used to remember your
          settings, maintain sessions, and improve performance.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>Your data helps us deliver and improve the platform. We use it for:</p>
      <ul>
        <li>Creating and managing your account</li>
        <li>Saving your lessons and tracking your progress</li>
        <li>Improving website performance and user experience</li>
        <li>Providing support and responding to feedback</li>
        <li>Ensuring platform security and preventing misuse</li>
      </ul>

      <h2>3. Cookies & Tracking Technologies</h2>
      <p>
        We use cookies to keep you logged in, remember your settings, and
        understand how users interact with the platform. You may disable cookies
        in your browser settings, but some features may not work correctly.
      </p>

      <h2>4. Data Sharing</h2>
      <p>We do not sell your personal information.</p>
      <p>We may share your data only with:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Tools that help us operate the
          platform (e.g., hosting, analytics).
        </li>
        <li>
          <strong>Legal Authorities:</strong> If required by law or to protect
          users from harm.
        </li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We use modern security standards, encrypted connections (HTTPS), and
        secure authentication methods to protect your information.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We keep your information for as long as your account is active. You may
        request deletion of your data at any time.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request access to your data</li>
        <li>Request correction of inaccurate information</li>
        <li>Request account deletion</li>
        <li>Withdraw consent to data processing</li>
      </ul>

      <h2>8. Children's Privacy</h2>
      <p>
        Users under 13 are not permitted to create accounts. For minors between
        13–18, parental consent is required.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy at any time. Continued use of the
        platform after updates means you agree to the revised policy.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at:
        <br />
        <strong>kenespanola04@gmail.com</strong>
      </p>

      <p>Thank you for trusting our platform.</p>
    </div>
  );
};

export default PrivacyPolicy;
