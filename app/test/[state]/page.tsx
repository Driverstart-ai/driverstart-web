"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data for the test
const mockQuestions = [
  {
    id: 1,
    text: "What does a solid double yellow line in the center of the road mean?",
    answers: [
      { id: "a", text: "Passing is permitted if safe" },
      { id: "b", text: "Passing is prohibited from both directions" },
      { id: "c", text: "Right turns only are permitted" },
      { id: "d", text: "One-way traffic only" }
    ],
    correct: "b",
    explanation: "A solid double yellow line separates lanes of traffic moving in opposite directions. You may not cross these lines to pass another vehicle."
  },
  {
    id: 2,
    text: "When approaching a flashing red traffic light, you must:",
    answers: [
      { id: "a", text: "Slow down and proceed with caution" },
      { id: "b", text: "Come to a complete stop and yield" },
      { id: "c", text: "Maintain speed if the intersection is clear" },
      { id: "d", text: "Honk your horn and proceed" }
    ],
    correct: "b",
    explanation: "A flashing red signal has the same meaning as a STOP sign. You must come to a complete stop, yield the right-of-way to other traffic and pedestrians, and proceed only when it is safe."
  }
];

export default function TestPage() {
  const params = useParams();
  const stateCode = (params.state as string)?.toUpperCase() || "PA";

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = mockQuestions[currentQ];
  const isFinished = currentQ >= mockQuestions.length;

  const handleAnswer = (answerId: string) => {
    if (selectedAnswer) return; // Prevent click if an answer is already selected
    setSelectedAnswer(answerId);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQ(prev => prev + 1);
  };

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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header and progress */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-700">{stateCode} DMV Practice Test</h1>
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            Question {currentQ + 1} of {mockQuestions.length}
          </span>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.answers.map((ans) => {
              let buttonStyle = "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";
              
              if (showExplanation) {
                if (ans.id === question.correct) {
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

        {/* AI Explanation section */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">AI Explanation</h3>
                <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
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