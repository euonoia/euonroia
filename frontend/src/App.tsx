import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
// Route Groups
import { LessonRoutes } from "./routes/lessonsRoutes";
import { OnboardingRoutes } from "./routes/onboardingRoutes";
import { SystemRoutes } from "./routes/systemRoutes";
import { RootRoutes } from "./routes/rootRoutes";
import { PolicyRoutes } from "./routes/PolicyRoutes";
import { GamesRoutes } from "./routes/gamesRoutes";

function AppContent() {
  const { loading } = useUser();

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
    );

  return (
    <Routes>
      {/* Root & Auth Pages */}
      {RootRoutes}

      {/* System Pages */}
      {SystemRoutes}

      {/* Lessons */}
      {LessonRoutes}

      {/* Onboarding Lessons */}
      {OnboardingRoutes}
      
      {/* Policies */}
      {PolicyRoutes}

      {/* Games */}
      {GamesRoutes}
      
      {/* 404 Fallback */}
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
