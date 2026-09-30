"use client";

import { useState } from "react";
import Link from "next/link";
import { saveTestResult } from "../../actions";

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
  const [correctCount, setCorrectCount] = useState(0);

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
  const question = questions[currentQ];

  if (isFinished) {
    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const isPassed = scorePercentage >= 80;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-6 text-center">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 max-w-md w-full">
          <div className="text-6xl mb-6">{isPassed ? "🏆" : "📚"}</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isPassed ? "Awesome Job!" : "Keep Practicing!"}
          </h1>
          <p className="text-slate-600 mb-8">You completed the {stateCode} practice test.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className={`text-5xl font-black mb-2 ${isPassed ? "text-green-600" : "text-slate-900"}`}>
              {scorePercentage}%
            </div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Score ({correctCount} out of {questions.length})
            </div>
          </div>

          <Link href="/states" className="block w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Try Another Test
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answerId);
    setShowExplanation(true);
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const nextQuestion = async () => {
    // If it's the last question, trigger the Server Action before moving to the results screen
    if (currentQ === questions.length - 1) {
      // We calculate the final score here to include the last answered question
      const finalScore = correctCount;
      
      // Modern Server Action call (no fetch, no API routes needed)
      await saveTestResult(stateCode, finalScore, questions.length);
    }

    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQ(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-slate-700">{stateCode} DMV Practice Test</h1>
          <span className="text-sm font-medium px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full">
            Question {currentQ + 1} of {questions.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-4">
            {/* Тепер ми мапимо напряму з question.answers */}
            {question.answers.map((ans) => {
              let buttonStyle = "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";

              if (showExplanation) {
                if (ans.isCorrect) {
                  buttonStyle = "border-green-500 bg-green-50 text-green-800 font-medium shadow-sm";
                } else if (ans.id === selectedAnswer) {
                  buttonStyle = "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonStyle = "border-slate-200 opacity-50";
                }
              }

              return (
                <button
                  key={ans.id}
                  onClick={() => handleAnswer(ans.id, ans.isCorrect)}
                  disabled={showExplanation}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all text-lg ${buttonStyle}`}
                >
                  {ans.text}
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && question.aiExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">💡</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">AI Explanation</h3>
                <p className="text-blue-800 leading-relaxed">{question.aiExplanation}</p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              {currentQ === questions.length - 1 ? "See Results" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}