import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

import {
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiBarChart2,
} from "react-icons/fi";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        console.log("Dashboard data:", res.data);
        setDashboard(res.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboard();
  }, []);

  /*
   * IMPORTANT:
   * These values must be created BEFORE the conditional return
   * so hooks always execute in the same order.
   */

  const interviews = dashboard?.interviews || [];

  /*
   * -----------------------------------------
   * Advanced Analytics
   * -----------------------------------------
   */

  const analytics = useMemo(() => {
    if (interviews.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        weakestScore: 0,
        averageConfidence: "N/A",
        averageClarity: "N/A",
        averageTechnicalAccuracy: "N/A",
        improvement: 0,
        strongestInterview: null,
        weakestInterview: null,
      };
    }

    const scores = interviews
      .map((item) => Number(item.score) || 0)
      .filter((score) => !Number.isNaN(score));

    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) /
          scores.length
        : 0;

    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const weakestScore =
      scores.length > 0 ? Math.min(...scores) : 0;

    /*
     * Convert AI text ratings into numerical values.
     */

    const ratingToNumber = (rating) => {
      if (!rating) return 0;

      const value = rating.toString().toLowerCase();

      if (
        value.includes("excellent") ||
        value.includes("outstanding")
      ) {
        return 5;
      }

      if (
        value.includes("very good") ||
        value.includes("strong")
      ) {
        return 4;
      }

      if (
        value.includes("good") ||
        value.includes("confident")
      ) {
        return 3;
      }

      if (
        value.includes("fair") ||
        value.includes("moderate") ||
        value.includes("average")
      ) {
        return 2;
      }

      if (
        value.includes("poor") ||
        value.includes("weak") ||
        value.includes("low")
      ) {
        return 1;
      }

      return 0;
    };

    const confidenceValues = interviews
      .map((item) => ratingToNumber(item.confidence))
      .filter((value) => value > 0);

    const clarityValues = interviews
      .map((item) => ratingToNumber(item.clarity))
      .filter((value) => value > 0);

    const technicalValues = interviews
      .map((item) => ratingToNumber(item.technicalAccuracy))
      .filter((value) => value > 0);

    const calculateAverage = (values) => {
      if (values.length === 0) return 0;

      return (
        values.reduce((sum, value) => sum + value, 0) /
        values.length
      );
    };

    const averageConfidence = calculateAverage(
      confidenceValues
    );

    const averageClarity = calculateAverage(clarityValues);

    const averageTechnicalAccuracy = calculateAverage(
      technicalValues
    );

    /*
     * -----------------------------------------
     * Improvement
     * -----------------------------------------
     */

    const chronological = [...interviews].sort(
      (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    );

    const firstScore =
      Number(chronological[0]?.score) || 0;

    const latestScore =
      Number(
        chronological[chronological.length - 1]?.score
      ) || 0;

    const improvement =
      chronological.length > 1
        ? latestScore - firstScore
        : 0;

    /*
     * -----------------------------------------
     * Strongest / Weakest Interview
     * -----------------------------------------
     */

    const strongestInterview = interviews.find(
      (item) => Number(item.score) === bestScore
    );

    const weakestInterview = interviews.find(
      (item) => Number(item.score) === weakestScore
    );

    /*
     * -----------------------------------------
     * Rating formatter
     * -----------------------------------------
     */

    const formatRating = (value) => {
      if (!value) return "N/A";

      if (value >= 4.5) return "Excellent";
      if (value >= 3.5) return "Very Good";
      if (value >= 2.5) return "Good";
      if (value >= 1.5) return "Fair";

      return "Needs Improvement";
    };

    return {
      averageScore: averageScore.toFixed(1),
      bestScore,
      weakestScore,
      averageConfidence: formatRating(averageConfidence),
      averageClarity: formatRating(averageClarity),
      averageTechnicalAccuracy:
        formatRating(averageTechnicalAccuracy),
      improvement,
      strongestInterview,
      weakestInterview,
    };
  }, [interviews]);

  /*
   * -----------------------------------------
   * Score Chart
   * -----------------------------------------
   */

  const chartData = [...interviews]
    .sort(
      (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    )
    .map((item, index) => ({
      date: `Interview ${index + 1}`,
      score: Number(item.score) || 0,
    }));

  /*
   * -----------------------------------------
   * Performance Summary
   * -----------------------------------------
   */

  const getPerformanceSummary = () => {
    if (interviews.length === 0) {
      return "Start your first mock interview to generate your performance analytics.";
    }

    const average = Number(analytics.averageScore);

    if (average >= 8) {
      return "Your interview performance is strong. Focus on deeper technical explanations and maintaining consistency.";
    }

    if (average >= 6) {
      return "You have a solid foundation. Improving technical accuracy, clarity, and confidence can raise your interview performance.";
    }

    if (average >= 4) {
      return "You are making progress. Focus on understanding core concepts and giving structured, complete answers.";
    }

    return "Keep practicing. Focus on answering the question directly, explaining your reasoning, and improving technical fundamentals.";
  };

  /*
   * -----------------------------------------
   * Loading
   * -----------------------------------------
   */

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 overflow-x-hidden">
        <Navbar />

        {/* Header */}

        <div className="mt-8">
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Track your interview performance and improve
            your skills over time.
          </p>
        </div>

        {/* Main Stats */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
          <StatCard
            title="Resume Score"
            value={`${dashboard.resumeScore || 0}%`}
          />

          <StatCard
            title="Interviews"
            value={dashboard.totalInterviews || 0}
          />

          <StatCard
            title="Average Score"
            value={analytics.averageScore}
          />

          <StatCard
            title="ATS Score"
            value={`${dashboard.resumeScore || 0}%`}
          />
        </div>

        {/* Analytics Header */}

        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            Interview Analytics
          </h2>

          <p className="text-slate-400 mt-1">
            Detailed breakdown of your interview performance.
          </p>
        </div>

        {/* Analytics Cards */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mt-6">
          {/* Best Score */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Best Score
                </p>

                <p className="text-3xl font-bold mt-2">
                  {analytics.bestScore}
                  <span className="text-lg text-slate-400">
                    /10
                  </span>
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <FiAward
                  className="text-yellow-400"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Lowest Score */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Lowest Score
                </p>

                <p className="text-3xl font-bold mt-2">
                  {analytics.weakestScore}
                  <span className="text-lg text-slate-400">
                    /10
                  </span>
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <FiTarget
                  className="text-red-400"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Improvement */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Improvement
                </p>

                <p className="text-3xl font-bold mt-2">
                  {analytics.improvement > 0
                    ? `+${analytics.improvement}`
                    : analytics.improvement}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  First → Latest
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <FiTrendingUp
                  className="text-cyan-400"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Total Interviews */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  Total Interviews
                </p>

                <p className="text-3xl font-bold mt-2">
                  {interviews.length}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FiBarChart2
                  className="text-purple-400"
                  size={24}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Score Trend + Quick Actions */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <ProgressChart data={chartData} />
          </div>

          <QuickActions />
        </div>

        {/* AI Performance Breakdown */}

        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            AI Performance Breakdown
          </h2>

          <p className="text-slate-400 mt-1">
            Based on your interview evaluations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Confidence */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Confidence
            </p>

            <p className="text-2xl font-bold mt-3">
              {analytics.averageConfidence}
            </p>

            <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
              <div className="h-2 rounded-full bg-cyan-400 w-3/4" />
            </div>
          </div>

          {/* Clarity */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Average Clarity
            </p>

            <p className="text-2xl font-bold mt-3">
              {analytics.averageClarity}
            </p>

            <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
              <div className="h-2 rounded-full bg-cyan-400 w-3/4" />
            </div>
          </div>

          {/* Technical Accuracy */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Technical Accuracy
            </p>

            <p className="text-2xl font-bold mt-3">
              {analytics.averageTechnicalAccuracy}
            </p>

            <div className="w-full bg-slate-800 h-2 rounded-full mt-4">
              <div className="h-2 rounded-full bg-cyan-400 w-3/4" />
            </div>
          </div>
        </div>

        {/* Performance Summary */}

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <FiTrendingUp
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Performance Summary
              </h2>

              <p className="text-slate-400 mt-2 leading-relaxed">
                {getPerformanceSummary()}
              </p>
            </div>
          </div>
        </div>

        {/* Strongest + Area to Improve */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Strongest */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Strongest Performance
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Your highest scoring interview.
                </p>
              </div>

              <FiAward
                className="text-yellow-400"
                size={28}
              />
            </div>

            {analytics.strongestInterview ? (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Role
                  </span>

                  <span className="font-semibold">
                    {analytics.strongestInterview.role}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-400">
                    Difficulty
                  </span>

                  <span className="font-semibold capitalize">
                    {analytics.strongestInterview.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-400">
                    Score
                  </span>

                  <span className="text-2xl font-bold text-cyan-400">
                    {analytics.strongestInterview.score}/10
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 mt-5">
                No interview data available.
              </p>
            )}
          </div>

          {/* Area to Improve */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Area to Improve
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Your lowest scoring interview.
                </p>
              </div>

              <FiTarget
                className="text-red-400"
                size={28}
              />
            </div>

            {analytics.weakestInterview ? (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Role
                  </span>

                  <span className="font-semibold">
                    {analytics.weakestInterview.role}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-400">
                    Difficulty
                  </span>

                  <span className="font-semibold capitalize">
                    {analytics.weakestInterview.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-400">
                    Score
                  </span>

                  <span className="text-2xl font-bold text-red-400">
                    {analytics.weakestInterview.score}/10
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 mt-5">
                No interview data available.
              </p>
            )}
          </div>
        </div>

        {/* Recent Interviews */}

        <div className="mt-8">
          <RecentActivity interviews={interviews} />
        </div>
      </div>
    </div>
  );
}