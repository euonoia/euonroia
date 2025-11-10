import { useEffect, useState } from "react";
import { checkThirdPartyCookies } from "../../utils/checkCookies";
import { useUser } from "../../context/UserContext";

export default function LoginWarning() {
  const { signInWithGoogle } = useUser();
  const [blocked, setBlocked] = useState(false);
  const [visible, setVisible] = useState(true); // track if user closed it

  const checkCookies = async () => {
    const allowed = await checkThirdPartyCookies();
    setBlocked(!allowed);
  };

  useEffect(() => {
    checkCookies();
  }, []);

  if (!blocked || !visible) return null;

  return (
    <div
      style={{
        position: "relative",
        padding: "1rem 1.5rem",
        margin: "1rem 0",
        border: "2px dashed #f39c12",
        backgroundColor: "#fff8e1",
        borderRadius: "0.5rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.5rem",
          background: "transparent",
          border: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
        aria-label="Close warning"
      >
        ×
      </button>

      🌟 Hi there! It looks like your browser is blocking login cookies.  
      <br />
      This may be due to Brave Shield or other privacy settings.  
      <br /><br />
      To log in and continue learning to code:
      <ul style={{ textAlign: "left", display: "inline-block", marginTop: "0.5rem" }}>
        <li>Temporarily turn off Brave Shield for this site.</li>
        <li>Or allow third-party cookies in your browser settings.</li>
      </ul>
      <br />
      Once you’ve updated your settings, try logging in again:
      <br /><br />
      <button
        onClick={signInWithGoogle}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          backgroundColor: "#f39c12",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔑 Try Login Again
      </button>
      <br /><br />
      Don’t worry—this only affects login, and your account stays safe! 😊
    </div>
  );
}
