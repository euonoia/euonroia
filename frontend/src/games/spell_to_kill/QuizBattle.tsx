import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnemyCanvas from "./enemy/EnemyCanvas";
import PlayerHealthBar from "./player/HealthBar";
import QuestionCard from "./question/QuestionCard";
import { Question } from "./types/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useUser } from "../../context/UserContext"; // authentication
import "../../styles/games/spell_to_kill/spelltokill.css";

const sampleQuestions: Question[] = [
    { id: 1, prompt: "What is 2 + 2?", choices: ["3", "4", "5", "22"], answerIndex: 1, damage: 20, missDamage: 15 },
    { id: 2, prompt: "Which is a JavaScript framework?", choices: ["Laravel", "Rails", "React", "Django"], answerIndex: 2, damage: 30, missDamage: 20 },
    { id: 3, prompt: "What HTML element holds the title?", choices: ["<body>", "<head>", "<title>", "<header>"], answerIndex: 2, damage: 25, missDamage: 20 },
    { id: 4, prompt: "What CSS property controls text size?", choices: ["font-weight", "text-style", "font-size", "line-height"], answerIndex: 2, damage: 25, missDamage: 20 },
    { id: 5, prompt: "Which is not a relational database?", choices: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], answerIndex: 2, damage: 30, missDamage: 20 },
];

function getQuestion(index: number): Question {
    return sampleQuestions[index % sampleQuestions.length];
}

export default function QuizBattle() {
    const { user, loading } = useUser();
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    const baseEnemyHP = 100;
    const [enemyLevel, setEnemyLevel] = useState(1);
    const [enemyMaxHP, setEnemyMaxHP] = useState(baseEnemyHP);
    const [enemyHP, setEnemyHP] = useState(baseEnemyHP);

    const [playerMaxHP] = useState(100);
    const [playerHP, setPlayerHP] = useState(100);

    const [qIndex, setQIndex] = useState(0);
    const [damage, setDamage] = useState(0);
    const [playerDamage, setPlayerDamage] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (enemyLevel > 1) {
            const newMax = baseEnemyHP + (enemyLevel - 1) * 40;
            setEnemyMaxHP(newMax);
            setEnemyHP(newMax);
        }
    }, [enemyLevel]);

    function handleAnswer(choiceIndex: number) {
        if (isProcessing || playerHP <= 0) return;

        setIsProcessing(true);
        const q = getQuestion(qIndex);
        const isCorrect = choiceIndex === q.answerIndex;

        if (isCorrect) {
            const dmg = q.damage ?? 20;
            setDamage(dmg);
            const newHP = Math.max(0, enemyHP - dmg);
            setEnemyHP(newHP);

            if (newHP === 0) {
                setTimeout(() => {
                    setEnemyLevel(e => e + 1);
                    setQIndex(i => i + 1);
                }, 400);
            }
        } else {
            const dmg = q.missDamage ?? 15;
            setPlayerDamage(dmg);
            setPlayerHP(hp => Math.max(0, hp - dmg));
        }

        setTimeout(() => {
            setDamage(0);
            setPlayerDamage(0);
            if (enemyHP > 0 || !isCorrect) {
                setQIndex(i => i + 1);
            }
            setIsProcessing(false);
        }, 500);
    }

    const currentQuestion = getQuestion(qIndex);
    const isGameOver = playerHP <= 0;
    const isVictory = enemyHP <= 0 && !isGameOver;

    return (
        <div className="playground-wrapper"> {/* reuse same wrapper for spacing & theme */}
            <Header />

            <main className="playground-main">
                <div className="max-w-3xl mx-auto p-4 space-y-6 main-container">
                    <h1 className="text-2xl font-bold text-center">Quiz RPG Battle (Level {enemyLevel})</h1>
                    
                    <EnemyCanvas enemyHP={enemyHP} enemyMaxHP={enemyMaxHP} damage={damage} />
                    
                    <PlayerHealthBar hp={playerHP} maxHp={playerMaxHP} playerDamage={playerDamage} />

                    {isGameOver ? (
                        <div className="card-container text-center">
                            <h2 className="text-3xl font-bold" style={{ color: "var(--color-error)" }}>❌ GAME OVER ❌</h2>
                            <p className="mt-2 text-secondary">You were defeated by the Level {enemyLevel} Quiz Monster!</p>
                            <button 
                                className="choice-button mt-4" 
                                onClick={() => window.location.reload()}
                                style={{ backgroundColor: "var(--accent)" }}
                            >
                                Retry Battle
                            </button>
                        </div>
                    ) : isVictory ? (
                        <div className="card-container text-center">
                            <h2 className="text-3xl font-bold" style={{ color: "var(--color-success)" }}>✨ VICTORY! ✨</h2>
                            <p className="mt-2 text-secondary">Prepare for the mighty Level {enemyLevel} Monster...</p>
                        </div>
                    ) : (
                        <QuestionCard
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                            disabled={isProcessing}
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
