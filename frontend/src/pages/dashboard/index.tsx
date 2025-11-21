// --- imports (unchanged)
import React from "react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import Header from "../../components/header";
import Footer from "../../components/footer";
import VerifyToken from "../../components/auth/VerifyToken";

import {
  useDashboardXP,
  useDashboardStreak,
  useDashboardProgress,
  useDashboardBadges,
  useDashboardLeaderboard,
} from "./hooks/";

import {
  DashboardTop,
  DashboardLessons,
  DashboardAchievements,
  DashboardLeaderboard,
} from "./components";

import "../../styles/pages/Dashboard.css";

const DashboardContent: React.FC = () => {
  const { user, loading } = useUser();
  const { theme } = useTheme();

  // --- hooks
  const { xp, level } = useDashboardXP(user);
  const { streak, lastActive } = useDashboardStreak(user);
  const { progressData, lessons } = useDashboardProgress(user);
  const { badges, loadingBadges } = useDashboardBadges(user);
  const { leaderboard, loadingLeaderboard } = useDashboardLeaderboard();

  // --- loading state
  if (loading) {
    return (
      <div className={`dashboard-page ${theme}`}>
        <Header />
        <main className="dashboard-main guest-main">
          <p>Loading your dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // --- compute next lesson
  const nextLesson =
    progressData.htmlBasicsProgress < 100
      ? lessons.find(l => l.id === "html-basics")
      : progressData.cssBasicsProgress < 100
      ? lessons.find(l => l.id === "css-intro")
      : progressData.javascriptProgress < 100
      ? lessons.find(l => l.id === "javascript")
      : null;

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />

      <main className="dashboard-main">
        {/* TOP SECTION */}
        <DashboardTop
          displayName={progressData.displayName}
          streak={streak}
          xp={xp}
          nextLesson={nextLesson || undefined}
          completedLessons={lessons.filter(l => l.progress === 100).length}
        />

        {/* LESSONS GRID */}
        <DashboardLessons lessons={lessons} />

        {/* BOTTOM SECTION */}
        <div className="dashboard-bottom">
          <DashboardAchievements badges={badges} loading={loadingBadges} />

          <DashboardLeaderboard
            leaderboard={leaderboard}
            loading={loadingLeaderboard}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

// --- wrap with VerifyToken (UNCHANGED)
const Dashboard: React.FC = () => (
  <VerifyToken>
    <DashboardContent />
  </VerifyToken>
);

export default Dashboard;
