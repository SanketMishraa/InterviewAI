import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">

        <h1 className="text-3xl font-bold text-cyan-400">
          InterviewAI
        </h1>

        <div className="space-x-6">
          <button className="hover:text-cyan-400">Features</button>
          <button className="hover:text-cyan-400">About</button>
          <button className="bg-cyan-500 px-5 py-2 rounded-xl" onClick={() => { navigate("/login") }}>
            Login
          </button>
        </div>

      </nav>

      {/* Hero */}

      <div className="flex flex-col items-center justify-center text-center mt-24 px-5">

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold"
        >
          Crack Your Next Interview
        </motion.h1>

        <p className="text-gray-300 mt-6 max-w-2xl text-xl">
          AI Resume Analysis • AI Mock Interview • ATS Score • Personalized Feedback
        </p>

        <button className="mt-10 px-8 py-4 rounded-xl bg-cyan-500 hover:scale-105 transition">
          Get Started
        </button>

      </div>

      {/* Features */}

      <div className="grid md:grid-cols-3 gap-8 px-10 py-24">

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold">
            Resume Analyzer
          </h2>

          <p className="mt-4 text-gray-300">
            Upload your resume and receive ATS score with AI suggestions.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold">
            AI Interview
          </h2>

          <p className="mt-4 text-gray-300">
            Practice with AI-generated interview questions.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold">
            Dashboard
          </h2>

          <p className="mt-4 text-gray-300">
            Track interview scores and monitor your progress.
          </p>
        </div>

      </div>

    </div>
  );
}