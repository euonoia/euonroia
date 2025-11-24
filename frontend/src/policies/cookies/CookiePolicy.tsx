import "../../styles/policy/policy-cookies.css";

const CookiePolicy = () => {
  return (
    <div className="cookie-container">
      <h1>Cookie Policy</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>

      <p>
        This Cookie Policy explains how our learning platform uses cookies and
        similar tracking technologies to improve your experience.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device to help websites
        function properly, remember preferences, and analyze usage patterns.
      </p>

      <h2>2. Types of Cookies We Use</h2>

      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function. They enable
        login sessions, security features, and basic navigation.
      </p>

      <h3>2.2 Preferences Cookies</h3>
      <p>
        These remember your settings such as theme, language, and saved
        preferences to improve your experience.
      </p>

      <h3>2.3 Analytics Cookies</h3>
      <p>
        These cookies help us understand how users interact with the platform by
        collecting anonymous usage data. This helps us improve performance and
        design.
      </p>

      <h3>2.4 Functionality Cookies</h3>
      <p>
        These support certain features like progress tracking, lesson saving,
        and remembering user choices inside the learning modules.
      </p>

      <h3>2.5 Third-Party Cookies</h3>
      <p>
        Some external services (hosting, authentication, analytics) may place
        their own cookies when interacting with the platform.
      </p>

      <h2>3. Why We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep users logged in securely</li>
        <li>Save learning progress and lesson activity</li>
        <li>Remember preferences such as theme (dark/light)</li>
        <li>Improve website performance and reliability</li>
        <li>Analyze traffic to enhance user experience</li>
      </ul>

      <h2>4. Managing Your Cookies</h2>
      <p>You can control cookies through your browser settings:</p>
      <ul>
        <li>Block or delete cookies</li>
        <li>Allow only selected types of cookies</li>
        <li>Receive alerts when cookies are used</li>
      </ul>

      <p>
        However, disabling essential cookies may cause some features or pages
        not to work properly.
      </p>

      <h2>5. Third-Party Tools</h2>
      <p>
        We may use third-party services such as analytics providers, security
        systems, or hosting tools. These services may use cookies following
        their own privacy and cookie policies.
      </p>

      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy to reflect changes in technology or
        regulations. Continued use of the platform means you accept the updated
        policy.
      </p>

      <h2>7. Contact</h2>
      <p>
        For questions about this Cookie Policy, contact us at:
        <br />
        <strong>kenespanola04@gmail.com</strong>
      </p>

      <p>Thank you for using our learning platform.</p>
    </div>
  );
};

export default CookiePolicy;
