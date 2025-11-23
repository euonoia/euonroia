import { Route } from "react-router-dom";

// Onboarding Funnel
import OnboardingFunnel from "../onboarding/GetStarted";

// Onboarding Lessons
import OnboardingHtmlDocument from "../onboarding/onboarding-lessons/learn-html-basics/HTMLdocument";
import OnboardingHtmlElements from "../onboarding/onboarding-lessons/learn-html-basics/HTMLelements";
import OnboardingHtmlExam from "../onboarding/onboarding-lessons/learn-html-basics/HTMLexam";

import OnboardingCssIntro from "../onboarding/onboarding-lessons/css/IntroToCss";
import OnboardingCssSample from "../onboarding/onboarding-lessons/css/Sample";
import OnboardingCssMultipleElements from "../onboarding/onboarding-lessons/css/CSSmultipleElements";
import OnboardingCssExam from "../onboarding/onboarding-lessons/css/CSSexam";

import OnboardingJsBasics from "../onboarding/onboarding-lessons/javascript/JavaScriptBasics";
import OnboardingJsConditions from "../onboarding/onboarding-lessons/javascript/JavaScriptConditions";
import OnboardingJsSample from "../onboarding/onboarding-lessons/javascript/JavaScriptProgram";
import OnboardingJsDisplay from "../onboarding/onboarding-lessons/javascript/JavaScriptDisplay";
import OnboardingJsExam from "../onboarding/onboarding-lessons/javascript/JavaScriptExam";

export const OnboardingRoutes = (
  <>
    <Route path="/onboarding" element={<OnboardingFunnel />} />

    {/* HTML Lessons */}
    <Route path="/onboarding/html-basics" element={<OnboardingHtmlDocument />} />
    <Route path="/onboarding/html-elements" element={<OnboardingHtmlElements />} />
    <Route path="/onboarding/html-exam" element={<OnboardingHtmlExam />} />

    {/* CSS Lessons */}
    <Route path="/onboarding/css-intro" element={<OnboardingCssIntro />} />
    <Route path="/onboarding/css-sample" element={<OnboardingCssSample />} />
    <Route path="/onboarding/css-multiple-elements" element={<OnboardingCssMultipleElements />} />
    <Route path="/onboarding/css-exam" element={<OnboardingCssExam />} />

    {/* JavaScript Lessons */}
    <Route path="/onboarding/js-basics" element={<OnboardingJsBasics />} />
    <Route path="/onboarding/js-conditions" element={<OnboardingJsConditions />} />
    <Route path="/onboarding/js-sample" element={<OnboardingJsSample />} />
    <Route path="/onboarding/js-display" element={<OnboardingJsDisplay />} />
    <Route path="/onboarding/js-exam" element={<OnboardingJsExam />} />
  </>
);
