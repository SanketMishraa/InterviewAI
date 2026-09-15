import { useState } from "react";
import API from "../services/api";

export default function MockInterview() {
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Beginner");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const generateQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setFeedback(null);
      setAnswer("");

      const res = await API.post("/interview/generate", {
        role,
        difficulty,
      });

      setQuestion(res.data.question);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to generate question"
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please write your answer first.");
      return;
    }

    if (!question) {
      alert("Please generate a question first.");
      return;
    }

    try {
      setLoadingFeedback(true);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await API.post("/interview/submit", {
        userId: user?.id || user?._id,
        role,
        difficulty,
        question,
        answer,
      });

      setFeedback(res.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to evaluate answer"
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const nextQuestion = () => {
    setQuestion("");
    setAnswer("");
    setFeedback(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* Header */}

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold">
          AI Mock Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Practice interview questions and receive AI-powered feedback.
        </p>

        {/* Interview Settings */}

        <div className="glass mt-8 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold mb-5">
            Interview Settings
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            {/* Role */}

            <div>
              <label className="block mb-2 text-slate-300">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg"
              >
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>Python Developer</option>
                <option>HR Interview</option>
              </select>
            </div>

            {/* Difficulty */}

            <div>
              <label className="block mb-2 text-slate-300">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* Generate */}

            <div className="flex items-end">

              <button
                onClick={generateQuestion}
                disabled={loadingQuestion}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition"
              >
                {loadingQuestion
                  ? "Generating..."
                  : "Generate Question"}
              </button>

            </div>

          </div>

        </div>

        {/* Question */}

        {question && (
          <div className="glass mt-8 p-8 rounded-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Interview Question
              </h2>

              <span className="text-sm text-cyan-400">
                {difficulty}
              </span>

            </div>

            <p className="text-xl leading-8 mt-6">
              {question}
            </p>

          </div>
        )}

        {/* Answer */}

        {question && !feedback && (
          <div className="glass mt-6 p-8 rounded-2xl">

            <h2 className="text-2xl font-bold mb-5">
              Your Answer
            </h2>

            <textarea
              rows="9"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-5 outline-none focus:border-cyan-400 resize-none"
            />

            <div className="flex justify-end mt-5">

              <button
                onClick={submitAnswer}
                disabled={loadingFeedback}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition"
              >
                {loadingFeedback
                  ? "AI Evaluating..."
                  : "Submit Answer"}
              </button>

            </div>

          </div>
        )}

        {/* Feedback */}

        {feedback && (
          <div className="mt-8">

            <div className="glass p-8 rounded-2xl">

              <h2 className="text-3xl font-bold mb-8">
                AI Interview Feedback
              </h2>

              {/* Score */}

              <div className="grid md:grid-cols-3 gap-5">

                <div className="bg-slate-900 p-6 rounded-xl">

                  <p className="text-slate-400">
                    Score
                  </p>

                  <p className="text-5xl font-bold text-cyan-400 mt-3">
                    {feedback.score}/10
                  </p>

                </div>

                <div className="bg-slate-900 p-6 rounded-xl">

                  <p className="text-slate-400">
                    Confidence
                  </p>

                  <p className="text-2xl font-semibold mt-4">
                    {feedback.confidence}
                  </p>

                </div>

                <div className="bg-slate-900 p-6 rounded-xl">

                  <p className="text-slate-400">
                    Technical Accuracy
                  </p>

                  <p className="text-2xl font-semibold mt-4">
                    {feedback.technicalAccuracy}
                  </p>

                </div>

              </div>

              {/* Strengths */}

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl">

                  <h3 className="text-xl font-bold text-green-400">
                    Strengths
                  </h3>

                  <ul className="mt-4 space-y-3">

                    {feedback.strengths?.map(
                      (item, index) => (
                        <li key={index}>
                          ✓ {item}
                        </li>
                      )
                    )}

                  </ul>

                </div>

                {/* Weaknesses */}

                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">

                  <h3 className="text-xl font-bold text-red-400">
                    Weaknesses
                  </h3>

                  <ul className="mt-4 space-y-3">

                    {feedback.weaknesses?.map(
                      (item, index) => (
                        <li key={index}>
                          ✗ {item}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>

              {/* Better Answer */}

              <div className="bg-slate-900 p-6 rounded-xl mt-6">

                <h3 className="text-xl font-bold">
                  💡 Better Answer
                </h3>

                <p className="mt-4 text-slate-300 leading-7 whitespace-pre-wrap">
                  {feedback.betterAnswer}
                </p>

              </div>

              {/* Tips */}

              <div className="bg-slate-900 p-6 rounded-xl mt-6">

                <h3 className="text-xl font-bold">
                  📌 Improvement Tips
                </h3>

                <ul className="mt-4 space-y-3">

                  {feedback.tips?.map(
                    (item, index) => (
                      <li key={index}>
                        ✓ {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

              {/* Next Question */}

              <div className="flex justify-end mt-8">

                <button
                  onClick={nextQuestion}
                  className="bg-cyan-500 hover:bg-cyan-400 px-8 py-3 rounded-lg font-semibold transition"
                >
                  Next Question →
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}