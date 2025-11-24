import React, { useState, useEffect } from "react";
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

import useConsent from "./hooks/useConsent";
import ConsentModal from "./modal/ConsentModal";

import "../../styles/pages/Dashboard.css";

const DashboardContent: React.FC = () => {
  const { user, loading } = useUser();
  const { theme } = useTheme();

  const { xp } = useDashboardXP(user);
  const { streak } = useDashboardStreak(user);
  const { progressData, lessons } = useDashboardProgress(user);
  const { badges, loadingBadges } = useDashboardBadges(user);
  const { leaderboard, loadingLeaderboard } = useDashboardLeaderboard();
  const [modalOpen, setModalOpen] = useState(true);
  const { consent, loading: consentLoading } = useConsent(modalOpen);

  // --- local state to control modal visibility

  // --- automatically close modal if user already agreed
  useEffect(() => {
    if (consent?.agreedToPolicies) {
      setModalOpen(false);
    }
  }, [consent]);

  const handleCloseModal = () => setModalOpen(false);

  if (loading || consentLoading) {
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

  const nextLesson =
    progressData.htmlBasicsProgress < 100
      ? lessons.find((l) => l.id === "html-basics")
      : progressData.cssBasicsProgress < 100
      ? lessons.find((l) => l.id === "css-intro")
      : progressData.javascriptProgress < 100
      ? lessons.find((l) => l.id === "javascript")
      : null;

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />

      <main className="dashboard-main">
        <DashboardTop
          displayName={progressData.displayName}
          streak={streak}
          xp={xp}
          nextLesson={nextLesson || undefined}
          completedLessons={lessons.filter((l) => l.progress === 100).length}
        />

        <DashboardLessons lessons={lessons} />

        <div className="dashboard-bottom">
          <DashboardAchievements badges={badges} loading={loadingBadges} />
          <DashboardLeaderboard
            leaderboard={leaderboard}
            loading={loadingLeaderboard}
          />
        </div>
      </main>

      <Footer />

      {/* --- POLICY CONSENT MODAL */}
     <ConsentModal
        isOpen={modalOpen && !consent?.agreedToPolicies}
        onClose={() => setModalOpen(false)} // unified close
      />
    </div>
  );
};

const Dashboard: React.FC = () => (
  <VerifyToken>
    <DashboardContent />
  </VerifyToken>
);

export default Dashboard;
