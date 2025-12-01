// src/games/spell_to_kill/QuizBattle.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosClient";
import EnemyCanvas from "./enemy/EnemyCanvas";
import PlayerHealthBar from "./player/HealthBar";
import QuestionCard from "./question/QuestionCard";
import { sampleQuestions } from "./data/questions"; 
import { Question } from "./types/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useUser } from "../../context/UserContext";
import "../../styles/games/spell_to_kill/spelltokill.css";

function getQuestion(index: number): Question {
  return sampleQuestions[index % sampleQuestions.length];
}

export default function QuizBattle() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [enemyLevel, setEnemyLevel] = useState(1);
  const baseEnemyHP = 100;
  const [enemyMaxHP, setEnemyMaxHP] = useState(baseEnemyHP);
  const [enemyHP, setEnemyHP] = useState(baseEnemyHP);

  const [playerMaxHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);

  const [qIndex, setQIndex] = useState(0);
  const [damage, setDamage] = useState(0);
  const [playerDamage, setPlayerDamage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // XP and Level
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);

  // Level up notification
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (enemyLevel > 1) {
      const newMax = baseEnemyHP + (enemyLevel - 1) * 40;
      setEnemyMaxHP(newMax);
      setEnemyHP(newMax);
    }
  }, [enemyLevel]);

  // Handle XP and level-ups
  async function gainXP(xpGained: number) {
    if (!user) return;

    try {
      const res = await axios.post("/api/leveledUp", { uid: user.uid, xpGained });
      const { xp, level, leveledUp, bonusXP } = res.data;

      setPlayerXP(xp);
      setPlayerLevel(level);

      if (leveledUp) {
        // Bonus XP for leveling up
        if (bonusXP && bonusXP > 0) {
          setPlayerXP(prev => prev + bonusXP);
        }

        setLevelUpMessage(`🎉 You leveled up! New Level: ${level} (+${bonusXP ?? 0} XP)`);
        setTimeout(() => setLevelUpMessage(null), 3000);
      }
    } catch (err: any) {
      console.error("Failed to gain XP:", err.response?.data || err.message);
    }
  }

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

      // Gain XP on correct answer
      gainXP(10);

      if (newHP === 0) {
        setTimeout(() => {
          setEnemyLevel(e => e + 1);
          setQIndex(i => i + 1);
          gainXP(20); // Bonus XP for defeating enemy
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
      if (enemyHP > 0 || !isCorrect) setQIndex(i => i + 1);
      setIsProcessing(false);
    }, 500);
  }

  const currentQuestion = getQuestion(qIndex);
  const isGameOver = playerHP <= 0;
  const isVictory = enemyHP <= 0 && !isGameOver;

  return (
    <div className="playground-wrapper">
      <Header />

      <main className="playground-main">
        <div className="max-w-3xl mx-auto p-4 space-y-6 main-container">
          <h1 className="text-2xl font-bold text-center">
            Quiz RPG Battle (Level {enemyLevel})
          </h1>

          {/* Enemy Canvas */}
          <div className="enemy-container relative mx-auto">
            <EnemyCanvas enemyHP={enemyHP} enemyMaxHP={enemyMaxHP} damage={damage} />
          </div>

          {/* Player HP */}
          <PlayerHealthBar hp={playerHP} maxHp={playerMaxHP} playerDamage={playerDamage} />

          {/* XP / Level Display */}
          <div className="text-center mt-2">
            <span>Level: {playerLevel} | XP: {playerXP}</span>
          </div>

          {levelUpMessage && (
            <div className="text-center text-success font-bold mt-2">
              {levelUpMessage}
            </div>
          )}

          {/* Game State */}
          {isGameOver ? (
            <div className="card-container text-center">
              <h2 className="text-3xl font-bold text-error">❌ GAME OVER ❌</h2>
              <p className="mt-2 text-secondary">
                You were defeated by the Level {enemyLevel} Quiz Monster!
              </p>
              <button 
                className="choice-button mt-4 w-full" 
                onClick={() => window.location.reload()}
              >
                Retry Battle
              </button>
            </div>
          ) : isVictory ? (
            <div className="card-container text-center">
              <h2 className="text-3xl font-bold text-success">✨ VICTORY! ✨</h2>
              <p className="mt-2 text-secondary">
                Prepare for the mighty Level {enemyLevel} Monster...
              </p>
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
