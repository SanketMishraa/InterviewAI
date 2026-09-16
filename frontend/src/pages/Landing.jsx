import { Link } from "react-router-dom";
import {
  FiFileText,
  FiMic,
  FiBarChart2,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              AI
            </div>

            <span className="text-2xl font-bold">
              InterviewAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-slate-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#about" className="hover:text-white transition">
              About
            </a>

            <Link
              to="/login"
              className="hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
            >
              Get Started
            </Link>
          </div>

          <Link
            to="/login"
            className="md:hidden px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold"
          >
            Login
          </Link>

        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">

          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-8">
              <FiCheckCircle />
              AI-Powered Interview Preparation
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Crack Your Next
              <span className="text-cyan-400"> Interview</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
              Analyze your resume, improve your ATS score, practice
              realistic mock interviews, and get personalized AI
              feedback to become interview-ready.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
              >
                Get Started
                <FiArrowRight />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
              >
                Try Mock Interview
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <p className="text-cyan-400 font-semibold mb-3">
            POWERFUL FEATURES
          </p>

          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Prepare
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            One platform to analyze your resume, practice interviews,
            and track your progress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Resume */}
          <div className="glass rounded-2xl p-7 hover:-translate-y-1 transition">

            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
              <FiFileText size={28} />
            </div>

            <h3 className="text-xl font-bold">
              AI Resume Analyzer
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Upload your resume and receive an AI-powered ATS score,
              strengths, weaknesses, missing keywords, and improvement
              suggestions.
            </p>

          </div>

          {/* Interview */}
          <div className="glass rounded-2xl p-7 hover:-translate-y-1 transition">

            <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
              <FiMic size={28} />
            </div>

            <h3 className="text-xl font-bold">
              AI Mock Interview
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Practice role-specific interview questions and receive
              detailed AI feedback on your answers, clarity,
              confidence, and technical accuracy.
            </p>

          </div>

          {/* Dashboard */}
          <div className="glass rounded-2xl p-7 hover:-translate-y-1 transition">

            <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-6">
              <FiBarChart2 size={28} />
            </div>

            <h3 className="text-xl font-bold">
              Performance Dashboard
            </h3>

            <p className="text-slate-400 mt-3 leading-relaxed">
              Track your interview scores, resume performance,
              interview history, and overall progress from one
              dashboard.
            </p>

          </div>

        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-slate-800">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <h2 className="text-3xl md:text-4xl font-bold">
            Prepare Smarter. Interview Better.
          </h2>

          <p className="text-slate-400 mt-5 text-lg leading-relaxed">
            InterviewAI combines modern web technologies with
            artificial intelligence to create a practical interview
            preparation experience for students, freshers, and job
            seekers.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-300">
              AI Resume Analysis
            </span>

            <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-300">
              ATS Scoring
            </span>

            <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-300">
              Mock Interviews
            </span>

            <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-300">
              Personalized Feedback
            </span>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20">

        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-10 md:p-14 text-center">

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Ace Your Interview?
          </h2>

          <p className="text-slate-400 mt-4">
            Start practicing today and discover where you can improve.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
          >
            Start Preparing
            <FiArrowRight />
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-slate-500">
            © 2026 InterviewAI. All rights reserved.
          </p>

          <p className="text-slate-500">
            Built with React, Node.js, MongoDB & AI
          </p>

        </div>

      </footer>

    </div>
  );
}