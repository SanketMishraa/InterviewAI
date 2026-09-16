import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import InterviewHistory from "./pages/InterviewHistory";
import Profile from "./pages/Profile";
import JobMatch from "./pages/JobMatch";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/resume"
            element={<ResumeAnalyzer />}
          />

          <Route
            path="/interview"
            element={<MockInterview />}
          />

          <Route
            path="/interview-history"
            element={<InterviewHistory />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/job-match"
            element={<JobMatch />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}