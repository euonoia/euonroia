import React, { useEffect, useRef } from "react";

type FloatingDamage = {
  dmg: number;
  x: number;
  y: number;
  alpha: number;
};

type EnemyCanvasProps = {
  enemyHP: number;
  enemyMaxHP: number;
  damage: number;
};

export default function EnemyCanvas({ enemyHP, enemyMaxHP, damage }: EnemyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const damagesRef = useRef<FloatingDamage[]>([]); // floating numbers
  const hitRef = useRef({ active: false, timer: 0, offsetX: 0, offsetY: 0 }); // shake & flash

  // Add new damage and trigger hit animation
  useEffect(() => {
    if (damage > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 10;
      const radius = 45;

      // Random offsets for floating damage
      const offsetX = Math.random() * 40 - 20;
      const offsetY = Math.random() * 20 - 10;
      damagesRef.current.push({ dmg: damage, x: centerX + offsetX, y: centerY - radius + offsetY, alpha: 1 });

      // Trigger shake & flash
      hitRef.current.active = true;
      hitRef.current.timer = 10; // frames
      canvas.classList.add("enemy-hit-flash");
      setTimeout(() => canvas.classList.remove("enemy-hit-flash"), 200);
    }
  }, [damage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = 300);
    const h = (canvas.height = 200);

    let floatingOffsetY = 0;
    let direction = 1;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Enemy floating up and down
      floatingOffsetY += direction * 0.3;
      if (floatingOffsetY > 5 || floatingOffsetY < -5) direction *= -1;

      let centerX = w / 2;
      let centerY = h / 2 - 10 + floatingOffsetY;
      const radius = 45;

      // Shake animation
      if (hitRef.current.active) {
        const shakeAmount = 4;
        hitRef.current.offsetX = (Math.random() - 0.5) * shakeAmount * 2;
        hitRef.current.offsetY = (Math.random() - 0.5) * shakeAmount * 2;
        centerX += hitRef.current.offsetX;
        centerY += hitRef.current.offsetY;
        hitRef.current.timer -= 1;
        if (hitRef.current.timer <= 0) {
          hitRef.current.active = false;
          hitRef.current.offsetX = 0;
          hitRef.current.offsetY = 0;
        }
      }

      // Enemy color based on HP
      const hpRatio = Math.max(0, enemyHP) / enemyMaxHP;
      const green = Math.floor(hpRatio * 200);
      const red = 220 - Math.floor(hpRatio * 200);

      // Enemy body
      ctx.fillStyle = `rgb(${red}, ${green}, 80)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 6, 6, 0, Math.PI * 2);
      ctx.arc(centerX + 15, centerY - 6, 6, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 18, centerY + 14);
      ctx.quadraticCurveTo(centerX, centerY + 26, centerX + 18, centerY + 14);
      ctx.stroke();

      // HP Bar
      const barW = 220;
      const barH = 12;
      const barX = (w - barW) / 2;
      const barY = h - 40;
      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = `rgba(255,50,50,0.9)`;
      ctx.fillRect(barX, barY, Math.max(0, barW * hpRatio), barH);

      // HP Text
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.max(0, enemyHP)} / ${enemyMaxHP}`, w / 2, barY + barH + 16);

      // Draw floating damage numbers
      damagesRef.current.forEach((f) => {
        ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`-${f.dmg}`, f.x, f.y);
        f.y -= 0.7;
        f.alpha -= 0.03;
      });
      damagesRef.current = damagesRef.current.filter((f) => f.alpha > 0);

      requestAnimationFrame(animate);
    };

    animate();
  }, [enemyHP, enemyMaxHP]);

  return <canvas ref={canvasRef} width={300} height={200} className="card-container" />;
}
