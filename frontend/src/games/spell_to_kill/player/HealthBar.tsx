import React, { useEffect, useState } from "react";

type PlayerHealthBarProps = {
  hp: number;
  maxHp: number;
  playerDamage?: number;
};

export default function PlayerHealthBar({ hp, maxHp, playerDamage }: PlayerHealthBarProps) {
  const ratio = Math.max(0, hp) / maxHp;
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (playerDamage && playerDamage > 0) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [playerDamage]);

  let healthColorClass = "hp-bar-full";
  if (ratio < 0.5) healthColorClass = "hp-bar-mid";
  if (ratio < 0.2) healthColorClass = "hp-bar-low";

  return (
    <div className={`player-health-bar ${flash ? "flash" : ""}`}>
      <div className="text-secondary font-semibold">Your HP</div>
      <div className="hp-bar-background">
        <div
          className={`hp-bar-fill transition-all ${healthColorClass}`}
          style={{ width: `${ratio * 100}%` }}
        ></div>
      </div>
      <div className="text-secondary text-small mt-1">
        {hp} / {maxHp}
      </div>
    </div>
  );
}
