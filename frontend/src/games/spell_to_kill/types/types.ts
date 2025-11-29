export type Question = {
id: number;
prompt: string;
choices: string[];
answerIndex: number;
damage?: number;
missDamage?: number;
};