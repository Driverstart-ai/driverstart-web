import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding database...')

  // 1. Створюємо штат Пенсільванія
  const paState = await prisma.state.upsert({
    where: { code: 'PA' },
    update: {},
    create: {
      code: 'PA',
      name: 'Pennsylvania',
    },
  })

  // 2. Створюємо питання та одразу прив'язуємо до нього 4 відповіді
  await prisma.question.create({
    data: {
      text: 'What does a solid double yellow line in the center of the road mean?',
      aiExplanation: 'A solid double yellow line separates lanes of traffic moving in opposite directions. You may not cross these lines to pass another vehicle.',
      stateId: paState.id,
      answers: {
        create: [
          { text: 'Passing is permitted if safe', isCorrect: false },
          { text: 'Passing is prohibited from both directions', isCorrect: true },
          { text: 'Right turns only are permitted', isCorrect: false },
          { text: 'One-way traffic only', isCorrect: false },
        ],
      },
    },
  })

  console.log('✅ Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })