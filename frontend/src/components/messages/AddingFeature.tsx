import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VerifyToken from "../auth/VerifyToken";

const AddingFeature: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickAnywhere = () => {
      setShowMessage(false);
      navigate("/dashboard");
    };
    window.addEventListener("click", handleClickAnywhere);
    return () => window.removeEventListener("click", handleClickAnywhere);
  }, [navigate]);

  if (!showMessage) return null;

  return (
    <VerifyToken>
      <main
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Left side - message */}
        <section
          style={{
            flex: "1 1 400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "2rem",
            gap: "1rem",
            minWidth: "300px",
          }}
        >
          <h1
            style={{
              color: "#4f46e5",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
            }}
          >
            Page Under Construction
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.5,
            }}
          >
            This feature is still being developed. <br />
            We're working hard to bring it to you soon. <br />
            Stay tuned!
          </p>

          {/* Hint message below content */}
          <p
            style={{
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: "1rem",
            }}
          >
            Tap anywhere to continue
          </p>
        </section>

        {/* Right side - big Euonroia name (hidden on mobile) */}
        {!isMobile && (
          <aside
            style={{
              flex: "1 1 400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 6rem)",
              fontWeight: "bold",
              color: "#4f46e5",
              minWidth: "300px",
              textAlign: "center",
            }}
            aria-hidden="true"
          >
            Euonroia
          </aside>
        )}
      </main>
    </VerifyToken>
  );
};

export default AddingFeature;
