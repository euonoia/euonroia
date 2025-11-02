import { useUser } from "../context/UserContext";
import "../styles/components/header.css";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, signOut, signInWithGoogle } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <h2 className="logo">Euonroia</h2>
      <div className="header-actions">
        {user ? (
          <div className="user-info">
            {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <button className="btn" onClick={signInWithGoogle}>Continue with Google</button>
        )}
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
}
