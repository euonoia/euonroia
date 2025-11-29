import React from "react";


type PlayerHealthBarProps = {
hp: number;
maxHp: number;
damage?: number;
};


export default function PlayerHealthBar({ hp, maxHp }: PlayerHealthBarProps) {
const ratio = Math.max(0, hp) / maxHp;
return (
<div className="mt-4">
<div className="text-sm font-medium">Your HP</div>
<div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mt-1">
<div
className="h-full bg-green-500 transition-all duration-300"
style={{ width: `${ratio * 100}%` }}
></div>
</div>
<div className="text-xs mt-1">{hp} / {maxHp}</div>
</div>
);
}