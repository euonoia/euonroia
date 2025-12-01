import React, { useEffect, useRef } from "react";


type EnemyCanvasProps = {
    enemyHP: number;
    enemyMaxHP: number;
    damage: number;
};


export default function EnemyCanvas({ enemyHP, enemyMaxHP, damage }: EnemyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;


        const w = (canvas.width = 300);
        const h = (canvas.height = 200);
        ctx.clearRect(0, 0, w, h);


        const hpRatio = Math.max(0, enemyHP) / enemyMaxHP;
        // Determine enemy color based on HP ratio
        const green = Math.floor(hpRatio * 200);
        const red = 220 - Math.floor(hpRatio * 200);


        const centerX = w / 2;
        const centerY = h / 2 - 10;
        const radius = 45;


        // Enemy Body (Canvas Drawing)
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


        // HP Bar Background
        const barW = 220;
        const barH = 12;
        const barX = (w - barW) / 2;
        const barY = h - 40;
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barW, barH);


        // HP Bar Fill (Red)
        ctx.fillStyle = `rgba(255,50,50,0.9)`;
        ctx.fillRect(barX, barY, Math.max(0, barW * hpRatio), barH);


        // HP Text
        ctx.fillStyle = "#fff";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.max(0, enemyHP)} / ${enemyMaxHP}`, w / 2, barY + barH + 16);


        // Damage Text Display
        if (damage > 0) {
            ctx.fillStyle = "#fffc";
            ctx.font = "bold 22px sans-serif";
            ctx.fillText(`-${damage}`, centerX, centerY - radius - 8);
        }
    }, [enemyHP, enemyMaxHP, damage]);


    // Using custom class for styling
    return <canvas ref={canvasRef} width={300} height={200} className="card-container" />;
}