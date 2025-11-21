import { useEffect, useState } from "react";
import axios from "../../../utils/axiosClient";
import { ProgressData } from "../types/progress.types";
import  { Lesson } from "../types/lesson.types";

export const useDashboardProgress = (user: any) => {
  const [progressData, setProgressData] = useState<ProgressData>({
    displayName: "",
    currentLesson: "",
    htmlBasicsProgress: 0,
    cssBasicsProgress: 0,
    javascriptProgress: 0,
  });

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "html-basics", title: "HTML Basics", path: "html-basics", progress: 0 },
    { id: "css-intro", title: "CSS Basics", path: "css-intro", progress: 0 },
    { id: "javascript", title: "JavaScript for Beginners", path: "js-basics", progress: 0 },
  ]);

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get<ProgressData>(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/progress`,
          { withCredentials: true }
        );

        const data = res.data;
        setProgressData(data);

        setLessons(prev =>
          prev.map(lesson => {
            if (lesson.id === "html-basics")
              return { ...lesson, progress: data.htmlBasicsProgress };
            if (lesson.id === "css-intro")
              return { ...lesson, progress: data.cssBasicsProgress };
            if (lesson.id === "javascript")
              return { ...lesson, progress: data.javascriptProgress };
            return lesson;
          })
        );
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    fetchProgress();
  }, [user]);

  return { progressData, lessons };
};

export default useDashboardProgress;