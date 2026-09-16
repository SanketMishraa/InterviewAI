import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiFileText,
  FiMic,
  FiClock,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiTarget,
} from "react-icons/fi";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const {
    logout,
    theme,
    toggleTheme,
  } = useContext(AuthContext);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Resume Analyzer",
      path: "/resume",
      icon: FiFileText,
    },
    {
      name: "Job Match",
      path: "/job-match",
      icon: FiTarget,
    },
    {
      name: "Mock Interview",
      path: "/interview",
      icon: FiMic,
    },
    {
      name: "Interview History",
      path: "/interview-history",
      icon: FiClock,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: FiUser,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex-col">
      {/* Logo */}

      <div className="px-6 py-6 border-b border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
            AI
          </div>

          <span className="text-xl font-bold text-white">
            InterviewAI
          </span>
        </NavLink>
      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}

      <div className="px-4 py-5 border-t border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <FiSun size={20} />
            ) : (
              <FiMoon size={20} />
            )}

            <span className="font-medium">
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <FiLogOut size={20} />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}