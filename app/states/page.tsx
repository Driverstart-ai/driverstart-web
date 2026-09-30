import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function StatesPage() {
  // Звертаємося до бази даних Neon і тягнемо всі штати
  const dbStates = await prisma.state.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Select Your State
          </h1>
          <p className="text-lg text-slate-600">
            DMV rules vary by location. Choose where you'll be taking your test to get accurate, AI-powered questions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Малюємо картки на основі реальних даних з БД */}
          {dbStates.map((state) => (
            <Link
              key={state.code}
              href={`/test/${state.code.toLowerCase()}`}
              className="flex items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition group"
            >
              <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">
                📍
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{state.name}</h2>
                <p className="text-sm text-slate-500">{state.code} DMV Test</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}