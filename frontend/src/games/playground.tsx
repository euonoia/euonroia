import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMagic, FaBrain, FaPuzzlePiece } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../context/UserContext"; // <-- added
import "../styles/games/playground.css"; // custom CSS

const games = [
  {
    id: "spell-to-kill",
    title: "Spell To Kill",
    description: "A typing battle game where you defeat enemies with spells.",
    icon: <FaMagic />,
    route: "/games/spell_to_kill",
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Sharpen your memory and improve pattern recognition.",
    icon: <FaBrain />,
    route: "/adding-feature",
  },
  {
    id: "logic-builder",
    title: "Logic Builder",
    description: "Solve puzzles that strengthen your coding logic.",
    icon: <FaPuzzlePiece />,
    route: "/adding-feature",
  },
];

export default function Playground() {
  const { user, loading } = useUser(); // <-- auth hook
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="playground-wrapper">
      <Header />

      <main className="playground-main">
        <div className="playground-layout">
          {/* LEFT – CARDS */}
          <div className="playground-left">
            <div className="playground-grid">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="playground-card"
                  onClick={() => navigate(game.route)}
                >
                  <div className="playground-icon">{game.icon}</div>
                  <h2>{game.title}</h2>
                  <p>{game.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – HERO */}
          <div className="playground-right">
            <div className="playground-hero">
              <div className="playground-hero-content">
                <h1>Welcome to the Playground</h1>
                <p>Have fun playing games that improve your coding skills.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
