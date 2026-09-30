"use client";

import { useState } from "react";
import Link from "next/link";

// Описуємо типи даних, які прийдуть з бази
type Answer = { id: string; text: string; isCorrect: boolean };
type Question = {
  id: string;
  text: string;
  aiExplanation: string | null;
  answers: Answer[];
};

export default function TestClient({ stateCode, questions }: { stateCode: string, questions: Question[] }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Якщо для штату ще немає питань
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Questions are coming soon for {stateCode}! 🚧</h1>
        <Link href="/states" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Go back
        </Link>
      </div>
    );
  }

  const isFinished = currentQ >= questions.length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Test Completed! 🎉</h1>
        <p className="text-lg text-slate-600 mb-8">You have finished the practice test for {stateCode}.</p>
        <Link href="/states" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Choose another state
        </Link>
      </div>
    );
  }

  const question = questions[currentQ];

  const handleAnswer = (answerId: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answerId);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQ(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-700">{stateCode} DMV Practice Test</h1>
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            Question {currentQ + 1} of {questions.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.answers.map((ans) => {
              let buttonStyle = "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";

              if (showExplanation) {
                if (ans.isCorrect) {
                  buttonStyle = "border-green-500 bg-green-50 text-green-800 font-medium";
                } else if (ans.id === selectedAnswer) {
                  buttonStyle = "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonStyle = "border-slate-200 opacity-50";
                }
              }

              return (
                <button
                  key={ans.id}
                  onClick={() => handleAnswer(ans.id)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${buttonStyle}`}
                >
                  {ans.text}
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && question.aiExplanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">AI Explanation</h3>
                <p className="text-blue-800 leading-relaxed">{question.aiExplanation}</p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Next question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}