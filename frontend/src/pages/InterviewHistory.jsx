import { useEffect, useState } from "react";
import {
  FiClock,
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi";
import { jsPDF } from "jspdf";

import API from "../services/api";

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/interview/history");

      setInterviews(res.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load interview history."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleInterview = (id) => {
    setExpandedId(
      expandedId === id ? null : id
    );
  };

  const addWrappedText = (
    doc,
    text,
    x,
    y,
    maxWidth,
    lineHeight = 6
  ) => {
    const safeText = String(text || "N/A");

    const lines = doc.splitTextToSize(
      safeText,
      maxWidth
    );

    let currentY = y;

    lines.forEach((line) => {
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
      }

      doc.text(line, x, currentY);
      currentY += lineHeight;
    });

    return currentY;
  };

  const addSection = (
    doc,
    title,
    content,
    y
  ) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(title, 20, y);

    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    y = addWrappedText(
      doc,
      content,
      20,
      y,
      170,
      5.5
    );

    return y + 8;
  };

  const addListSection = (
    doc,
    title,
    items,
    y
  ) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(title, 20, y);

    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (!items || items.length === 0) {
      doc.text("N/A", 20, y);
      return y + 12;
    }

    items.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(
        `• ${String(item)}`,
        170
      );

      lines.forEach((line) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, 20, y);
        y += 5.5;
      });

      y += 2;
    });

    return y + 6;
  };

  const downloadReport = (interview) => {
    try {
      setGeneratingId(interview._id);

      const doc = new jsPDF();

      let y = 20;

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");

      doc.text(
        "InterviewAI",
        20,
        y
      );

      y += 10;

      doc.setFontSize(17);

      doc.text(
        "Interview Performance Report",
        20,
        y
      );

      y += 15;

      // Divider
      doc.setLineWidth(0.5);

      doc.line(
        20,
        y,
        190,
        y
      );

      y += 12;

      // Basic Information
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text(
        `Role: ${interview.role || "N/A"}`,
        20,
        y
      );

      y += 7;

      doc.setFont("helvetica", "normal");

      doc.text(
        `Difficulty: ${
          interview.difficulty || "N/A"
        }`,
        20,
        y
      );

      y += 7;

      doc.text(
        `Date: ${
          interview.createdAt
            ? new Date(
                interview.createdAt
              ).toLocaleDateString()
            : "N/A"
        }`,
        20,
        y
      );

      y += 12;

      // Score
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");

      doc.text(
        `Score: ${interview.score || 0}/10`,
        20,
        y
      );

      y += 15;

      // Question
      y = addSection(
        doc,
        "Interview Question",
        interview.question,
        y
      );

      // Answer
      y = addSection(
        doc,
        "Your Answer",
        interview.answer,
        y
      );

      // Evaluation
      y = addSection(
        doc,
        "Confidence",
        interview.confidence,
        y
      );

      y = addSection(
        doc,
        "Clarity",
        interview.clarity,
        y
      );

      y = addSection(
        doc,
        "Technical Accuracy",
        interview.technicalAccuracy,
        y
      );

      // Strengths
      y = addListSection(
        doc,
        "Strengths",
        interview.strengths,
        y
      );

      // Weaknesses
      y = addListSection(
        doc,
        "Areas to Improve",
        interview.weaknesses,
        y
      );

      // Better Answer
      y = addSection(
        doc,
        "Better Answer",
        interview.betterAnswer,
        y
      );

      // Tips
      y = addListSection(
        doc,
        "Improvement Tips",
        interview.tips,
        y
      );

      // Footer on every page
      const totalPages =
        doc.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        doc.setPage(page);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");

        doc.text(
          `InterviewAI • Interview Report • Page ${page} of ${totalPages}`,
          20,
          290
        );
      }

      const roleName =
        (interview.role || "Interview")
          .replace(/[^a-zA-Z0-9]/g, "-");

      doc.save(
        `${roleName}-Interview-Report.pdf`
      );
    } catch (err) {
      console.error(
        "PDF generation error:",
        err
      );

      setError(
        "Failed to generate PDF report."
      );
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading interview history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Interview History
          </h1>

          <p className="text-slate-400 mt-2">
            Review your previous interviews and
            download detailed performance reports.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
            <FiAlertCircle className="mt-0.5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error &&
          interviews.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center">

              <FiClock className="mx-auto text-5xl text-slate-500 mb-4" />

              <h2 className="text-2xl font-semibold">
                No Interviews Yet
              </h2>

              <p className="text-slate-400 mt-2">
                Complete your first mock interview
                to see your results here.
              </p>

            </div>
          )}

        {/* Interview List */}
        <div className="space-y-5">

          {interviews.map((interview) => {
            const isExpanded =
              expandedId === interview._id;

            const isGenerating =
              generatingId === interview._id;

            return (
              <div
                key={interview._id}
                className="glass rounded-2xl overflow-hidden"
              >

                {/* Summary */}
                <div className="p-5 md:p-6">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {interview.role}
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">

                        <span className="px-3 py-1 rounded-full bg-slate-800">
                          {interview.difficulty}
                        </span>

                        <span className="flex items-center gap-1">
                          <FiClock />

                          {new Date(
                            interview.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      {/* Score */}
                      <div className="text-center px-4">
                        <div className="flex items-center gap-2">
                          <FiAward className="text-yellow-400" />

                          <span className="text-2xl font-bold">
                            {interview.score}/10
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Score
                        </p>
                      </div>

                      {/* PDF */}
                      <button
                        onClick={() =>
                          downloadReport(
                            interview
                          )
                        }
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
                      >
                        <FiDownload />

                        {isGenerating
                          ? "Generating..."
                          : "PDF"}
                      </button>

                      {/* Expand */}
                      <button
                        onClick={() =>
                          toggleInterview(
                            interview._id
                          )
                        }
                        className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                      >
                        {isExpanded ? (
                          <FiChevronUp
                            size={20}
                          />
                        ) : (
                          <FiChevronDown
                            size={20}
                          />
                        )}
                      </button>

                    </div>

                  </div>

                </div>

                {/* Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700 p-5 md:p-6 space-y-6">

                    {/* Question */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Interview Question
                      </h3>

                      <p className="text-slate-300 leading-relaxed">
                        {interview.question}
                      </p>
                    </div>

                    {/* Answer */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Your Answer
                      </h3>

                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {interview.answer}
                      </p>
                    </div>

                    {/* Evaluation */}
                    <div className="grid md:grid-cols-3 gap-4">

                      <div className="bg-slate-900/60 rounded-xl p-4">
                        <p className="text-sm text-slate-500">
                          Confidence
                        </p>

                        <p className="mt-1 font-medium">
                          {interview.confidence ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="bg-slate-900/60 rounded-xl p-4">
                        <p className="text-sm text-slate-500">
                          Clarity
                        </p>

                        <p className="mt-1 font-medium">
                          {interview.clarity ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="bg-slate-900/60 rounded-xl p-4">
                        <p className="text-sm text-slate-500">
                          Technical Accuracy
                        </p>

                        <p className="mt-1 font-medium">
                          {interview.technicalAccuracy ||
                            "N/A"}
                        </p>
                      </div>

                    </div>

                    {/* Strengths */}
                    {interview.strengths?.length >
                      0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Strengths
                        </h3>

                        <ul className="space-y-2">
                          {interview.strengths.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="text-slate-300 bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                              >
                                ✓ {item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {interview.weaknesses?.length >
                      0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Areas to Improve
                        </h3>

                        <ul className="space-y-2">
                          {interview.weaknesses.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="text-slate-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                              >
                                • {item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Better Answer */}
                    {interview.betterAnswer && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Better Answer
                        </h3>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-slate-300 leading-relaxed">
                          {interview.betterAnswer}
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    {interview.tips?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Improvement Tips
                        </h3>

                        <ul className="space-y-2">
                          {interview.tips.map(
                            (tip, index) => (
                              <li
                                key={index}
                                className="text-slate-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"
                              >
                                💡 {tip}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}