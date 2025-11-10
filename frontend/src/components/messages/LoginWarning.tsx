// src/components/LoginWarning.tsx
import { useEffect, useState } from "react";
import { checkThirdPartyCookies } from "../../utils/checkCookies";

export default function LoginWarning() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    checkThirdPartyCookies().then((allowed) => {
      setBlocked(!allowed);
    });
  }, []);

  if (!blocked) return null;

  return (
    <div
      style={{
        padding: "1rem",
        margin: "1rem 0",
        border: "2px dashed #f39c12",
        backgroundColor: "#fff8e1",
        borderRadius: "0.5rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        lineHeight: 1.5,
      }}
    >
      🌟 Hi coder! It looks like your browser’s privacy settings are a bit strict right now.  
      <br />
      To log in and continue learning for free, please temporarily turn off Brave Shield or other privacy blockers.  
      <br />
      Don’t worry—this is just for login, and your progress and account are completely safe! 😊
      <br />
      <em>Keep learning, even without a laptop—you’re doing amazing! 💪</em>
    </div>
  );
}
