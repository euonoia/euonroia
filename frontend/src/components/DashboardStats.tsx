interface DashboardStatsProps {
  lessonsCompleted: number;
  totalLessons: number;
  streak: number;
  xp: number;
}

export default function DashboardStats({
  lessonsCompleted,
  totalLessons,
  streak,
  xp,
}: DashboardStatsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h3>{lessonsCompleted}</h3>
        <p>Lessons Completed</p>
      </div>
      <div>
        <h3>{totalLessons}</h3>
        <p>Total Lessons</p>
      </div>
      <div>
        <h3>{streak}</h3>
        <p>Day Streak</p>
      </div>
      <div>
        <h3>{xp}</h3>
        <p>XP Points</p>
      </div>
    </div>
  );
}
