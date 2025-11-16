interface DashboardStatsProps {
  lessonsCompleted: number;
  streak: number;
  xp: number;
}

export default function DashboardStats({
  lessonsCompleted,
  streak,
  xp,
}: DashboardStatsProps) {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>{lessonsCompleted}</h3>
        <p>Lessons Completed</p>
      </div>
      <div className="stat-card">
        <h3>{streak}</h3>
        <p>Day Streak</p>
      </div>
      <div className="stat-card">
        <h3>{xp}</h3>
        <p>XP Points</p>
      </div>
    </div>
  );
}
