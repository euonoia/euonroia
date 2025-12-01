import React, { useEffect, useState } from "react";

type PlayerHealthBarProps = {
  hp: number;
  maxHp: number;
  playerDamage?: number;
};

export default function PlayerHealthBar({ hp, maxHp, playerDamage }: PlayerHealthBarProps) {
  const ratio = Math.max(0, hp) / maxHp;
  const [flash, setFlash] = useState(false);

  // Trigger flash animation on damage
  useEffect(() => {
    if (playerDamage && playerDamage > 0) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 300); // duration of flash
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
          style={{
            width: `${ratio * 100}%`,
            transform: flash ? "scaleX(1.05)" : "scaleX(1)",
            transition: flash
              ? "width 0.3s ease, transform 0.1s ease-in-out"
              : "width 0.3s ease",
          }}
        ></div>
      </div>

      <div className="text-secondary text-small mt-1">
        {hp} / {maxHp}
      </div>
    </div>
  );
}
