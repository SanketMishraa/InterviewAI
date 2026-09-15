import { Link } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaMicrophone,
  FaUser,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white p-6">

      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        InterviewAI
      </h1>

      <nav className="space-y-6">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/resume"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FaFileAlt />
          Resume Analyzer
        </Link>

        <Link
          to="/interview"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FaMicrophone />
          Mock Interview
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FaUser />
          Profile
        </Link>

      </nav>

    </div>
  );
}