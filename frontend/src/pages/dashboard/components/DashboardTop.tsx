import React from "react";
import { Link } from "react-router-dom";
import DashboardStats from "../../../components/DashboardStats";

interface DashboardTopProps {
  displayName: string;
  streak: number;
  xp: number;
  nextLesson?: {
    title: string;
    path: string;
  } | null;
  completedLessons: number;
}

const DashboardTop: React.FC<DashboardTopProps> = ({
  displayName,
  streak,
  xp,
  nextLesson,
  completedLessons,
}) => {
  return (
    <div className="dashboard-top">
      <div className="dashboard-left">
        <h1>Welcome back, {displayName || "Guest"}!</h1>
        <p>Continue your coding journey today</p>

        <DashboardStats
          lessonsCompleted={completedLessons}
          streak={streak}
          xp={xp}
        />
      </div>

      <div className="dashboard-right">
        <h2>Continue Learning</h2>
        <div className="continue-learning-card">
          <p>
            <strong>Next Lesson:</strong>{" "}
            {nextLesson?.title || "All lessons completed!"}
          </p>

          {nextLesson && (
            <Link to={`/lessons/${nextLesson.path}`}>
              <button className="start-lesson-btn">Start Lesson</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
