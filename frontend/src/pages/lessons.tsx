import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHtml5, FaCss3Alt, FaJs } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../context/UserContext";
import "../styles/pages/LessonPage.css";

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const lessons: Lesson[] = [
  { id: "html-basics", title: "HTML", description: "Learn the structure of web pages using HTML.", icon: <FaHtml5 />, route: "/adding-feature" },
  { id: "css-basics", title: "CSS", description: "Style your web pages with colors, layouts, and animations.", icon: <FaCss3Alt />, route: "/adding-feature" },
  { id: "js-basics", title: "JavaScript", description: "Add interactivity and dynamic behavior to your websites.", icon: <FaJs />, route: "/adding-feature" },
];

const LessonsPage: FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="app-wrapper">
      <Header />

      <main className="app-main">
        <section className="lessons-hero full-screen-section">
          <div className="lessons-hero-content">
            <h1>Choose a Lesson to Get Started</h1>
            <p>Pick a lesson and start learning web development step by step.</p>
          </div>
        </section>

        <section className="lessons-two-column">
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

          <div className="lessons-right">
            <h2>Lesson Overview</h2>
            <p>
              Explore our carefully structured lessons to learn HTML, CSS, and JavaScript from scratch.
              Click a lesson on the left to start learning interactively.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LessonsPage;
