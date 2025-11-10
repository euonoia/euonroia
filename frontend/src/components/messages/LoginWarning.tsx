import { useEffect, useState } from "react";
import { checkThirdPartyCookies } from "../../utils/checkCookies";
import { useUser } from "../../context/UserContext";

export default function LoginWarning() {
  const { signInWithGoogle } = useUser();
  const [blocked, setBlocked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    // Check if user previously chose to hide the warning
    const userPref = localStorage.getItem("hideLoginWarning");
    if (userPref === "true") {
      setNeverShow(true);
      return;
    }

    const check = async () => {
      const allowed = await checkThirdPartyCookies();
      if (!allowed) {
        setBlocked(true);
        setVisible(true);
      }
    };

    check();
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (neverShow) {
      localStorage.setItem("hideLoginWarning", "true");
    }
  };

  if (!blocked || !visible || neverShow) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#fff8e1",
          border: "2px dashed #f39c12",
          borderRadius: "0.75rem",
          padding: "1.5rem 1.25rem",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "0.4rem",
            right: "0.6rem",
            background: "transparent",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "#333",
          }}
          aria-label="Close warning"
        >
          ×
        </button>

        <h3 style={{ marginBottom: "0.5rem", color: "#e67e22" }}>
          ⚠️ Login Issue Detected
        </h3>

        <p
          style={{
            margin: "0.5rem 0 1rem",
            lineHeight: 1.5,
            fontSize: "0.95rem",
            textAlign: "left",
          }}
        >
          Hey there! 👋 Before you continue, I want to be transparent with you.  
          This site is something I’m building as a <strong>college student</strong> who dreams of
          helping others learn to code — especially those who don’t have access to laptops or expensive tools.
          <br />
          <br />
          Since I don’t have a paid domain yet (everything here is hosted for free),
          some browsers like <strong>Brave</strong> or certain privacy settings may block the login system.
          <br />
          <br />
          To make everything work smoothly, please temporarily turn off{" "}
          <strong>Brave Shield</strong> or allow third-party cookies in your browser.
          <br />
          <br />
          You can also check my work on GitHub at{" "}
          <a
            href="https://github.com/euonoia"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e67e22", fontWeight: "bold" }}
          >
            github.com/euonoia
          </a>
          — everything here is open-source and built with genuine care for fellow learners.
          <br />
          <br />
          Thank you for trusting this small project. 💛
          You’re not just helping me — you’re helping a growing community of students
          who want to learn and build together. 🙏
        </p>

        <p style={{ margin: "1rem 0 0.75rem", fontSize: "0.95rem", textAlign: "center" }}>
          After adjusting your settings, please try logging in again:
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: "#f39c12",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
            maxWidth: "220px",
          }}
        >
          🔑 Try Login Again
        </button>

        <div style={{ marginTop: "1rem" }}>
          <label style={{ fontSize: "0.9rem", color: "#555" }}>
            <input
              type="checkbox"
              checked={neverShow}
              onChange={(e) => setNeverShow(e.target.checked)}
              style={{ marginRight: "0.4rem" }}
            />
            Don’t show this again
          </label>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>
          Don’t worry — this only affects login, and your account stays safe! 😊
        </p>
      </div>
    </div>
  );
}
