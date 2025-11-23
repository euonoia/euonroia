import { Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LessonsPage from "../pages/lessons";
import Dashboard from "../pages/dashboard";
import OAuthCallback from "../components/OAuthCallBack";
import OnboardingFunnel from "../onboarding/GetStarted";

export const RootRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/lessons" element={<LessonsPage />} />
    <Route path="/onboarding" element={<OnboardingFunnel />} />
    <Route path="/oauth-callback" element={<OAuthCallback />} />
  </>
);
