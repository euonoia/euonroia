import React from "react";
import { Link } from "react-router-dom";
import { Lesson } from "../types/lesson.types";

interface DashboardLessonsProps {
  lessons: Lesson[];
}

const DashboardLessons: React.FC<DashboardLessonsProps> = ({ lessons }) => {
  return (
    <section className="lessons-overview">
      <h2>Your Lessons</h2>

      <div className="lessons-grid">
        {lessons.map(lesson => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.path}`}
            className="lesson-link"
          >
            <div className="lesson-card">
              <h3>{lesson.title}</h3>
              <progress value={lesson.progress} max={100} />
              <span>{lesson.progress}%</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DashboardLessons;
