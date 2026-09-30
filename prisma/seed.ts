import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding database...')

  // Знаходимо або створюємо штат Пенсільванія
  const paState = await prisma.state.upsert({
    where: { code: 'PA' },
    update: {},
    create: {
      code: 'PA',
      name: 'Pennsylvania',
    },
  })

  // БЕЗПЕЧНЕ ОЧИЩЕННЯ: Знаходимо всі старі питання для цього штату
  const oldQuestions = await prisma.question.findMany({
    where: { stateId: paState.id }
  })
  const oldQuestionIds = oldQuestions.map(q => q.id)

  // Спочатку видаляємо всі відповіді, які належать до старих питань
  if (oldQuestionIds.length > 0) {
    await prisma.answer.deleteMany({
      where: { questionId: { in: oldQuestionIds } }
    })
  }

  // Тепер безпечно видаляємо самі питання
  await prisma.question.deleteMany({
    where: { stateId: paState.id }
  })

  // Додаємо масив нових питань
  const questionsData = [
    {
      text: 'What does a solid double yellow line in the center of the road mean?',
      aiExplanation: 'A solid double yellow line separates lanes of traffic moving in opposite directions. You may not cross these lines to pass another vehicle.',
      answers: {
        create: [
          { text: 'Passing is permitted if safe', isCorrect: false },
          { text: 'Passing is prohibited from both directions', isCorrect: true },
          { text: 'Right turns only are permitted', isCorrect: false },
          { text: 'One-way traffic only', isCorrect: false },
        ],
      },
    },
    {
      text: 'When approaching a flashing red traffic light, you must:',
      aiExplanation: 'A flashing red signal has the same meaning as a STOP sign. You must come to a complete stop, yield the right-of-way, and proceed only when safe.',
      answers: {
        create: [
          { text: 'Slow down and proceed with caution', isCorrect: false },
          { text: 'Come to a complete stop and yield', isCorrect: true },
          { text: 'Maintain speed if the intersection is clear', isCorrect: false },
          { text: 'Honk your horn and proceed', isCorrect: false },
        ],
      },
    },
    {
      text: 'In Pennsylvania, you are considered to be driving under the influence (DUI) if your Blood Alcohol Concentration (BAC) is:',
      aiExplanation: 'For drivers 21 and older in Pennsylvania, a BAC of 0.08% or higher is considered illegal.',
      answers: {
        create: [
          { text: '0.05% or higher', isCorrect: false },
          { text: '0.08% or higher', isCorrect: true },
          { text: '0.10% or higher', isCorrect: false },
          { text: '0.02% or higher', isCorrect: false },
        ],
      },
    },
    {
      text: 'When you hear the siren or see the flashing lights of an approaching emergency vehicle, you must:',
      aiExplanation: 'You must yield the right-of-way to emergency vehicles by pulling over to the right edge of the road and stopping until they pass.',
      answers: {
        create: [
          { text: 'Speed up to get out of the way', isCorrect: false },
          { text: 'Stop immediately in your lane', isCorrect: false },
          { text: 'Drive to the right edge of the road and stop', isCorrect: true },
          { text: 'Turn onto the next available cross street', isCorrect: false },
        ],
      },
    }
  ]

  for (const q of questionsData) {
    await prisma.question.create({
      data: {
        ...q,
        stateId: paState.id,
      }
    })
  }

  console.log('✅ Seeding finished. Added 4 questions for PA.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })