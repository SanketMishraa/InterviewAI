import { useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  FiUploadCloud,
  FiFileText,
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiKey,
  FiBookOpen,
  FiBriefcase,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

export default function JobMatch() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5MB.");
      setResume(null);
      return;
    }

    setError("");
    setResume(file);
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setAnalysis(null);

    if (!resume) {
      setError("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Please provide a more complete job description."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", resume);
      formData.append(
        "jobDescription",
        jobDescription.trim()
      );

      const response = await API.post(
        "/job/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data);
    } catch (err) {
      console.error("Job match error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to analyze the job match. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResume(null);
    setJobDescription("");
    setAnalysis(null);
    setError("");

    const fileInput =
      document.getElementById("resume-upload");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const getScoreText = (score) => {
    if (score >= 80) return "Strong Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Partial Match";

    return "Low Match";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-cyan-400";
    if (score >= 40) return "text-yellow-400";

    return "text-red-400";
  };

  const getScoreBarWidth = (score) => {
    const safeScore = Math.min(
      Math.max(Number(score) || 0, 0),
      100
    );

    return `${safeScore}%`;
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-x-hidden">
        <Navbar />

        {/* Header */}

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <FiTarget
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Job Match Analyzer
              </h1>

              <p className="text-slate-400 mt-1">
                Compare your resume with a job description
                using AI.
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}

        {!analysis && (
          <form
            onSubmit={handleAnalyze}
            className="grid lg:grid-cols-2 gap-6 mt-8"
          >
            {/* Resume Upload */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <FiFileText
                  className="text-cyan-400"
                  size={22}
                />

                <h2 className="text-xl font-bold">
                  Upload Resume
                </h2>
              </div>

              <label
                htmlFor="resume-upload"
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition px-6 text-center"
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <FiUploadCloud
                    className="text-cyan-400"
                    size={32}
                  />
                </div>

                {resume ? (
                  <>
                    <p className="font-semibold text-lg mt-5">
                      {resume.name}
                    </p>

                    <p className="text-slate-400 text-sm mt-2">
                      {(resume.size / 1024 / 1024).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>

                    <p className="text-cyan-400 text-sm mt-4">
                      Click to choose another PDF
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-lg mt-5">
                      Upload your resume
                    </p>

                    <p className="text-slate-400 text-sm mt-2">
                      PDF files only • Maximum 5MB
                    </p>

                    <p className="text-cyan-400 text-sm mt-4">
                      Click to browse
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Job Description */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <FiBriefcase
                  className="text-cyan-400"
                  size={22}
                />

                <h2 className="text-xl font-bold">
                  Job Description
                </h2>
              </div>

              <textarea
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(event.target.value)
                }
                placeholder="Paste the complete job description here..."
                className="w-full min-h-[300px] resize-none bg-slate-950 border border-slate-700 rounded-2xl p-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
              />

              <div className="flex justify-between mt-3">
                <span className="text-xs text-slate-500">
                  Include responsibilities, requirements,
                  skills and qualifications.
                </span>

                <span className="text-xs text-slate-500">
                  {jobDescription.length} characters
                </span>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="lg:col-span-2 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
                <FiAlertCircle size={20} />

                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}

            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-4 rounded-xl transition"
              >
                {loading ? (
                  <>
                    <FiRefreshCw
                      className="animate-spin"
                      size={20}
                    />

                    Analyzing Resume & Job...
                  </>
                ) : (
                  <>
                    <FiTarget size={20} />

                    Analyze Job Match
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Error when results are displayed */}

        {analysis && error && (
          <div className="mt-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
            <FiAlertCircle size={20} />

            <span>{error}</span>
          </div>
        )}

        {/* Results */}

        {analysis && (
          <div className="mt-8 space-y-6">
            {/* Top Result */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Score */}

                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto rounded-full border-[10px] border-slate-800 flex items-center justify-center">
                    <div className="text-center">
                      <p
                        className={`text-4xl font-bold ${getScoreColor(
                          analysis.matchScore
                        )}`}
                      >
                        {analysis.matchScore}
                      </p>

                      <p className="text-slate-500 text-sm">
                        / 100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}

                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm uppercase tracking-wider">
                    AI Job Match Score
                  </p>

                  <h2
                    className={`text-3xl font-bold mt-2 ${getScoreColor(
                      analysis.matchScore
                    )}`}
                  >
                    {getScoreText(
                      analysis.matchScore
                    )}
                  </h2>

                  <p className="text-slate-300 leading-relaxed mt-4">
                    {analysis.summary ||
                      "AI analysis completed successfully."}
                  </p>

                  <div className="w-full bg-slate-800 h-3 rounded-full mt-6 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                      style={{
                        width: getScoreBarWidth(
                          analysis.matchScore
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Matching + Missing Skills */}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Matching Skills */}

              <ResultCard
                icon={FiCheckCircle}
                iconClass="text-green-400"
                title="Matching Skills"
                items={analysis.matchingSkills}
                emptyText="No matching skills identified."
                itemClass="text-green-300"
              />

              {/* Missing Skills */}

              <ResultCard
                icon={FiXCircle}
                iconClass="text-red-400"
                title="Missing Skills"
                items={analysis.missingSkills}
                emptyText="No major missing skills identified."
                itemClass="text-red-300"
              />
            </div>

            {/* Keywords */}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Matching Keywords */}

              <KeywordCard
                title="Matching Keywords"
                icon={FiKey}
                items={analysis.matchingKeywords}
                type="matching"
              />

              {/* Missing Keywords */}

              <KeywordCard
                title="Missing Keywords"
                icon={FiKey}
                items={analysis.missingKeywords}
                type="missing"
              />
            </div>

            {/* Relevant Experience */}

            <ResultCard
              icon={FiBriefcase}
              iconClass="text-cyan-400"
              title="Relevant Experience"
              items={analysis.relevantExperience}
              emptyText="No specific relevant experience identified."
              itemClass="text-slate-300"
              fullWidth
            />

            {/* Skills To Learn */}

            <ResultCard
              icon={FiBookOpen}
              iconClass="text-purple-400"
              title="Skills to Learn / Strengthen"
              items={analysis.skillsToLearn}
              emptyText="No additional skills suggested."
              itemClass="text-purple-300"
              fullWidth
            />

            {/* Resume Suggestions */}

            <ResultCard
              icon={FiTarget}
              iconClass="text-yellow-400"
              title="Resume Improvement Suggestions"
              items={analysis.resumeSuggestions}
              emptyText="No additional suggestions."
              itemClass="text-yellow-300"
              fullWidth
            />

            {/* Actions */}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl transition"
              >
                <FiRefreshCw size={20} />

                Analyze Another Job
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/*
 * ==========================================
 * RESULT CARD
 * ==========================================
 */

function ResultCard({
  icon: Icon,
  iconClass,
  title,
  items,
  emptyText,
  itemClass,
  fullWidth = false,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={iconClass} size={22} />

        <h2 className="text-xl font-bold">
          {title}
        </h2>
      </div>

      {safeItems.length > 0 ? (
        <div className="mt-5 space-y-3">
          {safeItems.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-1.5 w-2 h-2 rounded-full bg-current flex-shrink-0 ${itemClass}`}
              />

              <p className={`leading-relaxed ${itemClass}`}>
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 mt-5">
          {emptyText}
        </p>
      )}
    </div>
  );
}

/*
 * ==========================================
 * KEYWORD CARD
 * ==========================================
 */

function KeywordCard({
  title,
  icon: Icon,
  items,
  type,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const isMatching = type === "matching";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <Icon
          className={
            isMatching
              ? "text-green-400"
              : "text-red-400"
          }
          size={22}
        />

        <h2 className="text-xl font-bold">
          {title}
        </h2>
      </div>

      {safeItems.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-5">
          {safeItems.map((item, index) => (
            <span
              key={`${title}-${index}`}
              className={`px-3 py-2 rounded-lg text-sm border ${
                isMatching
                  ? "bg-green-500/10 border-green-500/20 text-green-300"
                  : "bg-red-500/10 border-red-500/20 text-red-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 mt-5">
          No keywords identified.
        </p>
      )}
    </div>
  );
}