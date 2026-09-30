import { prisma } from "../../../lib/prisma";
import TestClient from "./TestClient";
import { redirect } from "next/navigation";

export default async function TestPage({ params }: { params: Promise<{ state: string }> }) {
  const resolvedParams = await params;
  const stateCode = resolvedParams.state.toUpperCase();

  const stateData = await prisma.state.findUnique({
    where: { code: stateCode },
    include: {
      questions: {
        include: {
          answers: true
        }
      }
    }
  });

  if (!stateData) {
    redirect("/states");
  }

  // 🎲 МАГІЯ ТУТ: Перемішуємо відповіді на сервері один раз для кожного питання
  const shuffledQuestions = stateData.questions.map(q => ({
    ...q,
    answers: q.answers.sort(() => Math.random() - 0.5)
  }));

  // Передаємо вже перемішані питання
  return <TestClient stateCode={stateCode} questions={shuffledQuestions} />;
}