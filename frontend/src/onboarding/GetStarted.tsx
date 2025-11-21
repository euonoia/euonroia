import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import "../styles/onboarding/getStarted.css";

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const lessons: Lesson[] = [
  {
    id: "html-basics",
    title: "HTML Basics",
    description: "Build your first webpage structure — the foundation of all websites.",
    icon: <FaHtml5 />,
    route: "/onboarding/html-basics",
  },
  {
    id: "css-basics",
    title: "CSS Basics",
    description: "Learn how to style and visually design real websites.",
    icon: <FaCss3Alt />,
    route: "/adding-feature",
  },
  {
    id: "js-basics",
    title: "JavaScript Basics",
    description: "Make your pages interactive with logic and behavior.",
    icon: <FaJs />,
    route: "/adding-feature",
  },
];

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="getstarted-wrapper">
         <Header />

      {/* LEFT — Lesson Cards */}
      <div className="lessons-left">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => navigate(lesson.route)}
          >
            <div className="lesson-icon">{lesson.icon}</div>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>

      {/* RIGHT — Lesson Overview / Encouragement */}
      <div className="lessons-right">
        <h2>Choose Your First Lesson</h2>
        <p>
          You're about to start learning web development step by step. 
          Pick a lesson on the left and tap through interactive exercises.
        </p>
        <p>
          Don’t worry if you’ve never coded before — these lessons are beginner-friendly 
          and designed for anyone learning from scratch.
        </p>
      </div>
    </div>
  );
}
