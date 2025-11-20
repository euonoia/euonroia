import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";
import OAuthCallback from "./components/OAuthCallBack";
import LessonsPage from "./pages/lessons";
import OnboardingFunnel from "./onboarding/GetStarted";
import WelcomeScreen from "./onboarding/steps/WelcomeStep";

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
// Lessons Html Basics
import JavaScriptBasics from "./pages/lessons/javascript/JavaScriptBasics";
import JavascriptSample from "./pages/lessons/javascript/JavasScriptProgram";
import JavaScriptConditions from "./pages/lessons/javascript/JavaScriptConditions";
import JavaScriptDisplay from "./pages/lessons/javascript/JavaScriptDisplay";
import JavaScriptExam from "./pages/lessons/javascript/JavaScriptExam";

//onboarding
import OnboardingHtmlDocument from  "./onboarding/onboarding-lessons/learn-html-basics/HTMLdocument";
import OnboardingHtmlElements from "./onboarding/onboarding-lessons/learn-html-basics/HTMLelements";
import OnboardingHtmlExam from "./onboarding/onboarding-lessons/learn-html-basics/HTMLexam";

import OnboardingCssIntro from "./onboarding/onboarding-lessons/css/IntroToCss";
import OnboardingCssSample from "./onboarding/onboarding-lessons/css/Sample";
import OnboardingCssMultipleElements from "./onboarding/onboarding-lessons/css/CSSmultipleElements";
import OnboardingCssExam from "./onboarding/onboarding-lessons/css/CSSexam";

import OnboardingJsBasics from "./onboarding/onboarding-lessons/javascript/JavaScriptBasics";
import OnboardingJsConditions from "./onboarding/onboarding-lessons/javascript/JavaScriptConditions";
import OnboardingJsSample from "./onboarding/onboarding-lessons/javascript/JavaScriptProgram";
import OnboardingJsDisplay from "./onboarding/onboarding-lessons/javascript/JavaScriptDisplay";
import OnboardingJsExam from "./onboarding/onboarding-lessons/javascript/JavaScriptExam";

import PasteToBlocks from "./pages/paste-to-blocks";

import MaintenanceMessage from "./components/messages/Maintenance";
import AddingFeature from "./components/messages/AddingFeature";

import { useUser } from "./context/UserContext";

function AppContent() {
  const { loading } = useUser();

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <>  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/onboarding" element={<OnboardingFunnel />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
  
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
        <Route path="/lessons/js-exam" element={<JavaScriptExam/>}/>
        {/*onboarding lessons*/}
        <Route path="/onboarding/html-basics" element={<OnboardingHtmlDocument />} />
        <Route path="/onboarding/html-elements" element={<OnboardingHtmlElements />} />
        <Route path="/onboarding/html-exam" element={<OnboardingHtmlExam />} />

        <Route path="/onboarding/css-intro" element={<OnboardingCssIntro />} />
        <Route path="/onboarding/css-sample" element={<OnboardingCssSample />} />
        <Route path="/onboarding/css-multiple-elements" element={<OnboardingCssMultipleElements />} />
        <Route path="/onboarding/css-exam" element={<OnboardingCssExam />} />

        <Route path="/onboarding/js-basics" element={<OnboardingJsBasics />} />
        <Route path="/onboarding/js-conditions" element={<OnboardingJsConditions />} />
        <Route path="/onboarding/js-sample" element={<OnboardingJsSample />} />
        <Route path="/onboarding/js-display" element={<OnboardingJsDisplay />} />
        <Route path="/onboarding/js-exam" element={<OnboardingJsExam/>}/>

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
