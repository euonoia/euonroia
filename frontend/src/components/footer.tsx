import "../styles/components/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© {new Date().getFullYear()} Euonroia. All rights reserved.</p>
      </div>
    </footer>
  );
}
