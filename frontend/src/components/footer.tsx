import { useTheme } from "../context/ThemeContext";
import "../styles/components/footer.css";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Euonroia. All rights reserved.</p>
     
    </footer>
  );
}
