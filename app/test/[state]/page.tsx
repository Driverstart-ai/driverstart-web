import { prisma } from "../../../lib/prisma";
import TestClient from "./TestClient";
import { redirect } from "next/navigation";

// Зверни увагу на зміну типу params на Promise
export default async function TestPage({ params }: { params: Promise<{ state: string }> }) {
  // Спочатку "чекаємо" на розпакування параметрів
  const resolvedParams = await params;
  const stateCode = resolvedParams.state.toUpperCase();

  // Звертаємося до бази даних і дістаємо штат РАЗОМ із його питаннями та варіантами відповідей
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

  // Якщо користувач ввів неіснуючий штат (наприклад /test/xx), повертаємо його назад
  if (!stateData) {
    redirect("/states");
  }

  // Передаємо реальні дані з бази в наш клієнтський компонент
  return <TestClient stateCode={stateCode} questions={stateData.questions} />;
}