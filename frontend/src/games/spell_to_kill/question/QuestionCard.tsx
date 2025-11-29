import React from "react";
import { Question } from "../types/types";


type QuestionCardProps = {
question: Question;
onAnswer: (choiceIndex: number) => void;
};


export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
return (
<div>
<div className="text-sm text-gray-500">Question</div>
<div className="text-lg font-semibold mt-1">{question.prompt}</div>


<div className="grid gap-2 mt-3">
{question.choices.map((c, i) => (
<button
key={i}
onClick={() => onAnswer(i)}
className="text-left rounded-md p-3 border hover:shadow"
>
{String.fromCharCode(65 + i)}. {c}
</button>
))}
</div>
</div>
);
}