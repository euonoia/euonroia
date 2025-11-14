import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Dashboard from "./pages/dashboard";
import AboutPage from "./pages/aboutpage";
import UserList from "./pages/userlist";
import LandingPage from "./pages/LandingPage";
import OAuthCallback from "./components/OAuthCallBack";

// Lessons
// Lessons Html Basics
import Greetings from "./pages/lessons/Greetings";
import HTMLdocument from "./pages/lessons/learn-html-basics/HTMLdocument";
import HTMLelements from "./pages/lessons/learn-html-basics/HTMLelements";
import HTMLexam from "./pages/lessons/learn-html-basics/HTMLexam";
//lessons CSS Intro
import IntroToCSS from "./pages/lessons/css/IntroToCss";
import Sample from "./pages/lessons/css/Sample";
import CSSMultipleElements from "./pages/lessons/css/CSSMultipleElements";
import CSSExam from "./pages/lessons/css/CSSExam";

import JavaScriptBasics from "./pages/lessons/javascript/JavaScriptBasics";
import JavascriptSample from "./pages/lessons/javascript/JavasScriptProgram";
import JavaScriptConditions from "./pages/lessons/javascript/JavaScriptConditions";
import JavaScriptDisplay from "./pages/lessons/javascript/JavaScriptDisplay";

import MaintenanceMessage from "./components/messages/Maintenance";
import AddingFeature from "./components/messages/AddingFeature";

import { useUser } from "./context/UserContext";
import LoginWarning from "./components/messages/LoginWarning";

function AppContent() {
  const { loading } = useUser();

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <>
      {/* Login warning for blocked cookies */}
      <LoginWarning />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/lessons/greetings" element={<Greetings />} />

        <Route path="/lessons/html-basics" element={<HTMLdocument />} />
        <Route path="/lessons/html-elements" element={<HTMLelements />} />
        <Route path="/lessons/html-exam" element={<HTMLexam />} />

        <Route path="/lessons/css-intro" element={<IntroToCSS />} />
        <Route path="/lessons/css-sample" element={<Sample />} />
        <Route path="/lessons/css-multiple-elements" element={<CSSMultipleElements />} />
        <Route path="/lessons/css-exam" element={<CSSExam />} />

        <Route path="/lessons/js-basics" element={<JavaScriptBasics />} />
        <Route path="/lessons/js-conditions" element={<JavaScriptConditions />} />
        <Route path="/lessons/js-sample" element={<JavascriptSample />} />
        <Route path="/lessons/js-display" element={<JavaScriptDisplay />} />


        {/*maintenance message*/}
        <Route path="/maintenance" element={<MaintenanceMessage />} />
        <Route path="/adding-feature" element={<AddingFeature />} />

        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
