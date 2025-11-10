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
    setLoginError(false);
    if (neverShow) localStorage.setItem("hideLoginWarning", "true");
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
          maxWidth: "420px",
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

        <h3 style={{ color: "#e67e22", marginBottom: "1rem" }}>⚠️ Login Issue Detected</h3>
        <p style={{ margin: "0.5rem 0 1rem", lineHeight: 1.5 }}>
          It looks like your Google login didn’t go through — this can happen if{" "}
          <strong>Brave Shield</strong> or your browser’s privacy settings block cookies.
          <br /><br />
          I’m a college student building this site to help others learn coding — totally free.
          <br /><br />
          Please try turning off Brave Shield or allowing third-party cookies temporarily.
          <br /><br />
          You can also check out my open-source work at{" "}
          <a
            href="https://github.com/euonoia"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#e67e22", fontWeight: "bold" }}
          >
            github.com/euonoia
          </a>{" "}
          💛
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
      </div>
    </div>
  );
}
