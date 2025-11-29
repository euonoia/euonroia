import React, { useState } from "react";
import EnemyCanvas from "./enemy/EnemyCanvas";
import PlayerHealthBar from "./player/HealthBar";
import QuestionCard from "./question/QuestionCard";
import { Question } from "./types/types";

const sampleQuestions: Question[] = [
{ id: 1, prompt: "What is 2 + 2?", choices: ["3", "4", "5", "22"], answerIndex: 1, damage: 20, missDamage: 15 },
{ id: 2, prompt: "Which is a JavaScript framework?", choices: ["Laravel", "Rails", "React", "Django"], answerIndex: 2, damage: 30, missDamage: 20 },
{ id: 3, prompt: "What HTML element holds the title?", choices: ["<body>", "<head>", "<title>", "<header>"], answerIndex: 2, damage: 25, missDamage: 20 },
];


export default function QuizBattle() {
const baseEnemyHP = 100;
const [enemyLevel, setEnemyLevel] = useState(1);
const [enemyMaxHP, setEnemyMaxHP] = useState(baseEnemyHP);
const [enemyHP, setEnemyHP] = useState(baseEnemyHP);


const [playerMaxHP] = useState(100);
const [playerHP, setPlayerHP] = useState(100);


const [qIndex, setQIndex] = useState(0);
const [damage, setDamage] = useState(0);
const [playerDamage, setPlayerDamage] = useState(0);


function handleAnswer(choiceIndex: number) {
const q = sampleQuestions[qIndex];
const isCorrect = choiceIndex === q.answerIndex;


if (isCorrect) {
const dmg = q.damage ?? 20;
setDamage(dmg);
const newHP = Math.max(0, enemyHP - dmg);
setEnemyHP(newHP);


if (newHP === 0) {
setEnemyLevel(e => e + 1);
const newMax = baseEnemyHP + enemyLevel * 40;
setEnemyMaxHP(newMax);
setEnemyHP(newMax);
}
} else {
const dmg = q.missDamage ?? 15;
setPlayerDamage(dmg);
setPlayerHP(hp => Math.max(0, hp - dmg));
}


setTimeout(() => {
setDamage(0);
setPlayerDamage(0);
setQIndex(i => Math.min(i + 1, sampleQuestions.length - 1));
}, 500);
}


return (
<div className="max-w-3xl mx-auto p-4 space-y-6">
<EnemyCanvas enemyHP={enemyHP} enemyMaxHP={enemyMaxHP} damage={damage} />


<PlayerHealthBar hp={playerHP} maxHp={playerMaxHP} damage={playerDamage} />


<QuestionCard
question={sampleQuestions[qIndex]}
onAnswer={handleAnswer}
/>
</div>
);
}
