// src/components/LoginWarning.tsx
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

export default function LoginWarning() {
  const { loginError, setLoginError, signInWithGoogle } = useUser();
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("hideLoginWarning");
    if (pref === "true") setNeverShow(true);
  }, []);

  const handleClose = () => {
    if (neverShow) {
      localStorage.setItem("hideLoginWarning", "true");
    }
    setLoginError(false);
  };

  if (!loginError || neverShow) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#fff8e1",
          border: "2px dashed #f39c12",
          borderRadius: "0.75rem",
          padding: "1.5rem 1.25rem",
          textAlign: "center",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#333",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
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
        >
          ×
        </button>

        <h3 style={{ color: "#e67e22", marginBottom: "1rem" }}>
          ⚠️ Login Issue Detected
        </h3>

        <p style={{ margin: "0.5rem 0 1rem", lineHeight: 1.6 }}>
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

        <p
          style={{
            margin: "1rem 0 0.75rem",
            fontSize: "0.95rem",
            textAlign: "center",
          }}
        >
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

        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginTop: "1rem",
            lineHeight: 1.4,
          }}
        >
          It's better to use an email address that is not your main one for extra security.😊
        </p>
      </div>
    </div>
  );
}
