import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Навігація */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="text-2xl font-extrabold tracking-tighter text-slate-900">
          Driverstart<span className="text-blue-600">.ai</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition">
            Sign up
          </Link>
        </nav>
      </header>

      {/* Головний екран */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
          ✨ The Smartest Way to Pass Your DMV Test
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Master Your Driving Test with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
          Stop memorizing boring manuals. Driverstart.ai uses intelligent spaced repetition and AI-powered explanations to help you pass on the first try.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/states"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Start Free Test
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg font-semibold text-lg hover:bg-slate-100 transition"
          >
            View Premium Plans
          </Link>
        </div>
      </main>
    </div>
  );
}