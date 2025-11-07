import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import AboutPage from "./pages/aboutpage";
import UserList from "./pages/userlist";
import LandingPage from "./pages/LandingPage";
import OAuthCallback from "./components/OAuthCallBack";
import { UserProvider, useUser } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";

// Import your LessonPage here (Updated path)
import Greetings from "./pages/lessons/Greetings";
import HTMLdocument from "./pages/lessons/learn-html-basics/HTMLdocument"; // Adjusted path
import HTMLelements from "./pages/lessons/learn-html-basics/HTMLelements";
import HTMLexam from "./pages/lessons/learn-html-basics/HTMLexam";
// Optional wrapper to wait for user context to load
function AppContent() {
  const { loading } = useUser();

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading application...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      {/* Add the new route for the HTML lesson */}
      <Route path="/lessons/greetings" element={<Greetings />} />
      <Route path="/lessons/html-basics" element={<HTMLdocument />} />
      <Route path="/lessons/html-elements" element={<HTMLelements />} />
      <Route path="/lessons/html-exam" element={<HTMLexam />} />
      {/* Optional 404 route */}
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
