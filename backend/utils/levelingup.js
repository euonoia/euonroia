// utils/levelingup.js
export function getLevelFromXP(xp) {
  let level = 1;
  let xpForNext = 50;

  while (xp >= xpForNext) {
    level++;
    xpForNext += level * 50; // progressive curve
  }

  return level;
}
