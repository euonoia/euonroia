import { Question } from "../types/types"; // adjust path if needed

export const sampleQuestions: Question[] = [
  { id: 1, prompt: "What is 2 + 2?", choices: ["3", "4", "5", "22"], answerIndex: 1, damage: 20, missDamage: 15 },
  { id: 2, prompt: "Which is a JavaScript framework?", choices: ["Laravel", "Rails", "React", "Django"], answerIndex: 2, damage: 30, missDamage: 20 },
  { id: 3, prompt: "What HTML element holds the title?", choices: ["<body>", "<head>", "<title>", "<header>"], answerIndex: 2, damage: 25, missDamage: 20 },
  { id: 4, prompt: "What CSS property controls text size?", choices: ["font-weight", "text-style", "font-size", "line-height"], answerIndex: 2, damage: 25, missDamage: 20 },
  { id: 5, prompt: "Which is not a relational database?", choices: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], answerIndex: 2, damage: 30, missDamage: 20 },
  // Add more questions here later
];
