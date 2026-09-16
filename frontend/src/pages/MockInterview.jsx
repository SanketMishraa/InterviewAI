import { useEffect, useRef, useState } from "react";
import {
  FiMic,
  FiMicOff,
  FiSend,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

import API from "../services/api";

const TOTAL_QUESTIONS = 5;

export default function MockInterview() {
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Beginner");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  // Interview
  const [interviewMode, setInterviewMode] = useState("practice");
  const [interviewStarted, setInterviewStarted] =
    useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] =
    useState(1);
  const [sessionResults, setSessionResults] = useState([]);
  const [sessionComplete, setSessionComplete] =
    useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);

  // Final AI Report
  const [finalReport, setFinalReport] = useState(null);
  const [generatingReport, setGeneratingReport] =
    useState(false);

  const recognitionRef = useRef(null);

  // ==========================================
  // SPEECH RECOGNITION
  // ==========================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        setAnswer((currentAnswer) => {
          const separator = currentAnswer.trim()
            ? " "
            : "";

          return (
            currentAnswer +
            separator +
            finalTranscript.trim()
          );
        });
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (event.error === "no-speech") {
        setError(
          "No speech detected. Please try speaking again."
        );
      } else {
        setError(
          "Voice recognition failed. Please try again."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (err) {
        console.error(err);
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ==========================================
  // VOICE
  // ==========================================

  const startListening = () => {
    setError("");

    if (!voiceSupported) {
      setError(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (!recognitionRef.current) {
      setError(
        "Voice recognition could not be initialized."
      );
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);

      if (!isListening) {
        setError(
          "Could not start the microphone. Please try again."
        );
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error(err);
    }

    setIsListening(false);
  };

  const speakQuestion = () => {
    if (!question) {
      setError("Generate a question first.");
      return;
    }

    if (!window.speechSynthesis) {
      setError(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    stopListening();
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(question);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setError(
        "Could not play the interview question."
      );
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ==========================================
  // NORMAL QUESTION
  // ==========================================

  const generateQuestion = async () => {
    try {
      setError("");
      setFeedback(null);
      setAnswer("");
      setQuestion("");
      setIsFollowUp(false);

      stopListening();
      stopSpeaking();

      setLoadingQuestion(true);

      const res = await API.post(
        "/interview/generate",
        {
          role,
          difficulty,
        }
      );

      setQuestion(res.data.question);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to generate interview question."
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ==========================================
  // START FULL INTERVIEW
  // ==========================================

  const startFullInterview = async () => {
    try {
      setError("");
      stopListening();
      stopSpeaking();

      setQuestion("");
      setAnswer("");
      setFeedback(null);
      setSessionResults([]);
      setCurrentQuestionNumber(1);
      setSessionComplete(false);
      setIsFollowUp(false);
      setFinalReport(null);

      setInterviewMode("full");
      setInterviewStarted(true);

      setLoadingQuestion(true);

      const res = await API.post(
        "/interview/generate",
        {
          role,
          difficulty,
        }
      );

      setQuestion(res.data.question);
    } catch (err) {
      console.error(err);

      setInterviewStarted(false);

      setError(
        err.response?.data?.message ||
          "Failed to start the interview."
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ==========================================
  // START PRACTICE
  // ==========================================

  const startPractice = async () => {
    setInterviewMode("practice");
    setInterviewStarted(false);
    setSessionComplete(false);
    setSessionResults([]);
    setCurrentQuestionNumber(1);
    setIsFollowUp(false);
    setFinalReport(null);

    await generateQuestion();
  };

  // ==========================================
  // GENERATE FOLLOW-UP
  // ==========================================

  const generateFollowUp = async (
    previousQuestion,
    previousAnswer,
    previousEvaluation
  ) => {
    try {
      setLoadingQuestion(true);
      setError("");

      const res = await API.post(
        "/interview/generate",
        {
          role,
          difficulty,
          followUp: true,
          previousQuestion,
          previousAnswer,
          previousEvaluation,
        }
      );

      setQuestion(res.data.question);
      setIsFollowUp(true);
      setAnswer("");
      setFeedback(null);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to generate AI follow-up question."
      );
    } finally {
      setLoadingQuestion(false);
    }
  };

  // ==========================================
  // GENERATE FINAL AI REPORT
  // ==========================================

  const generateFinalReport = async (
    completedResults
  ) => {
    try {
      setGeneratingReport(true);
      setError("");

      const res = await API.post(
        "/interview/final-report",
        {
          role,
          difficulty,
          interviews: completedResults,
        }
      );

      setFinalReport(res.data);
      setSessionComplete(true);
      setInterviewStarted(false);
    } catch (err) {
      console.error(
        "Final report generation error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to generate the final AI interview report. Please try again."
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  // ==========================================
  // SUBMIT ANSWER
  // ==========================================

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError(
        "Please enter or speak your answer before submitting."
      );
      return;
    }

    if (!question) {
      setError(
        "Please generate a question first."
      );
      return;
    }

    try {
      setError("");
      stopListening();
      stopSpeaking();

      setSubmitting(true);

      const res = await API.post(
        "/interview/submit",
        {
          role,
          difficulty,
          question,
          answer,
        }
      );

      const result = res.data;

      // ========================================
      // FULL INTERVIEW
      // ========================================

      if (
        interviewMode === "full" &&
        interviewStarted
      ) {
        const updatedResults = [
          ...sessionResults,
          {
            questionNumber:
              currentQuestionNumber,
            question,
            answer,
            isFollowUp,
            ...result,
          },
        ];

        setSessionResults(updatedResults);
        setFeedback(result);

        if (
          currentQuestionNumber >=
          TOTAL_QUESTIONS
        ) {
          setInterviewStarted(false);

          await generateFinalReport(
            updatedResults
          );

          return;
        }

        const nextQuestionNumber =
          currentQuestionNumber + 1;

        setCurrentQuestionNumber(
          nextQuestionNumber
        );

        await generateFollowUp(
          question,
          answer,
          result
        );

        return;
      }

      // ========================================
      // PRACTICE MODE
      // ========================================

      setFeedback(result);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to evaluate your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // NEXT PRACTICE QUESTION
  // ==========================================

  const nextPracticeQuestion = async () => {
    if (!question || !answer || !feedback) {
      await generateQuestion();
      return;
    }

    await generateFollowUp(
      question,
      answer,
      feedback
    );
  };

  // ==========================================
  // RETRY FINAL REPORT
  // ==========================================

  const retryFinalReport = async () => {
    if (!sessionResults.length) {
      setError(
        "No completed interview results are available."
      );
      return;
    }

    await generateFinalReport(sessionResults);
  };

  // ==========================================
  // RESTART
  // ==========================================

  const restartFullInterview = () => {
    stopListening();
    stopSpeaking();

    setQuestion("");
    setAnswer("");
    setFeedback(null);
    setSessionResults([]);
    setCurrentQuestionNumber(1);
    setSessionComplete(false);
    setInterviewStarted(false);
    setIsFollowUp(false);
    setFinalReport(null);
    setError("");
    setInterviewMode("practice");
  };

  // ==========================================
  // FINAL REPORT HELPERS
  // ==========================================

  const getAverageScore = () => {
    if (!sessionResults.length) return 0;

    const total = sessionResults.reduce(
      (sum, item) =>
        sum + Number(item.score || 0),
      0
    );

    return (
      total / sessionResults.length
    ).toFixed(1);
  };

  const getNumericRating = (value) => {
    const ratings = {
      excellent: 5,
      verygood: 4,
      good: 4,
      average: 3,
      fair: 3,
      poor: 2,
      weak: 1,
      strong: 4,
    };

    if (typeof value === "number") {
      return value;
    }

    if (!value) return 0;

    const normalized = String(value)
      .toLowerCase()
      .replace(/\s+/g, "");

    return ratings[normalized] || 0;
  };

  const getAverageRating = (field) => {
    if (!sessionResults.length) {
      return "N/A";
    }

    const values = sessionResults
      .map((item) =>
        getNumericRating(item[field])
      )
      .filter((value) => value > 0);

    if (!values.length) return "N/A";

    const average =
      values.reduce(
        (sum, value) => sum + value,
        0
      ) / values.length;

    if (average >= 4.5) return "Excellent";
    if (average >= 3.5) return "Good";
    if (average >= 2.5) return "Average";

    return "Needs Improvement";
  };

  const getAllStrengths = () => {
    return [
      ...new Set(
        sessionResults.flatMap(
          (item) => item.strengths || []
        )
      ),
    ];
  };

  const getAllWeaknesses = () => {
    return [
      ...new Set(
        sessionResults.flatMap(
          (item) => item.weaknesses || []
        )
      ),
    ];
  };

  const getAllTips = () => {
    return [
      ...new Set(
        sessionResults.flatMap(
          (item) => item.tips || []
        )
      ),
    ];
  };

  // ==========================================
  // AI DETECTION HELPERS
  // ==========================================

  const getAIDetectionLabel = (value) => {
    if (value === true) {
      return "Potentially AI-Generated";
    }

    return "No Strong AI Signals";
  };

  const getAIDetectionStyles = (value) => {
    if (value === true) {
      return {
        container:
          "bg-yellow-500/10 border-yellow-500/20",
        icon: "text-yellow-400",
        title: "text-yellow-300",
      };
    }

    return {
      container:
        "bg-green-500/10 border-green-500/20",
      icon: "text-green-400",
      title: "text-green-300",
    };
  };

  // ==========================================
  // FINAL REPORT
  // ==========================================

  if (sessionComplete) {
    const averageScore =
      finalReport?.overallScore ??
      getAverageScore();

    const strengths =
      finalReport?.keyStrengths?.length
        ? finalReport.keyStrengths
        : getAllStrengths();

    const weaknesses =
      finalReport?.keyWeaknesses?.length
        ? finalReport.keyWeaknesses
        : getAllWeaknesses();

    const improvementPlan =
      finalReport?.improvementPlan || [];

    const nextSteps =
      finalReport?.nextSteps || [];

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FiAward size={32} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mt-5">
              Final AI Interview Report 🎉
            </h1>

            <p className="text-slate-400 mt-2">
              AI-powered assessment of your complete interview performance
            </p>

          </div>

          <div className="glass rounded-2xl p-6 mb-6">

            <div className="grid md:grid-cols-3 gap-5">

              <div className="text-center bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Role
                </p>

                <p className="font-semibold text-lg mt-2">
                  {role}
                </p>
              </div>

              <div className="text-center bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Difficulty
                </p>

                <p className="font-semibold text-lg mt-2">
                  {difficulty}
                </p>
              </div>

              <div className="text-center bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Questions
                </p>

                <p className="font-semibold text-lg mt-2">
                  {sessionResults.length}/
                  {TOTAL_QUESTIONS}
                </p>
              </div>

            </div>

          </div>

          <div className="glass rounded-2xl p-8 mb-6 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FiTarget size={35} />
            </div>

            <p className="text-slate-400 mt-5">
              Overall Interview Score
            </p>

            <p className="text-7xl font-bold text-cyan-400 mt-2">
              {averageScore}
              <span className="text-2xl text-slate-500">
                /10
              </span>
            </p>

            {finalReport?.performanceLevel && (
              <div className="inline-flex mt-5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">
                {finalReport.performanceLevel}
              </div>
            )}

          </div>

          {finalReport?.summary && (
            <div className="glass rounded-2xl p-6 mb-6">

              <div className="flex items-center gap-3 mb-4">

                <FiTrendingUp className="text-cyan-400" />

                <h2 className="text-xl font-semibold">
                  AI Performance Summary
                </h2>

              </div>

              <p className="text-slate-300 leading-relaxed">
                {finalReport.summary}
              </p>

            </div>
          )}

          <div className="glass rounded-2xl p-6 mb-6">

            <div className="flex items-center gap-3 mb-6">

              <FiTarget className="text-cyan-400" />

              <h2 className="text-xl font-semibold">
                AI Performance Breakdown
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              <div className="bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Technical Performance
                </p>

                <p className="text-xl font-semibold mt-2">
                  {finalReport?.technicalPerformance ||
                    "N/A"}
                </p>
              </div>

              <div className="bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Confidence
                </p>

                <p className="text-xl font-semibold mt-2">
                  {finalReport?.confidence ||
                    getAverageRating("confidence")}
                </p>
              </div>

              <div className="bg-slate-900/70 rounded-xl p-5">
                <p className="text-sm text-slate-400">
                  Clarity
                </p>

                <p className="text-xl font-semibold mt-2">
                  {finalReport?.clarity ||
                    getAverageRating("clarity")}
                </p>
              </div>

            </div>

          </div>

          {finalReport?.strongestAreas?.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Strongest Areas
              </h2>

              <div className="space-y-3">

                {finalReport.strongestAreas.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-slate-300"
                    >
                      ✓ {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {finalReport?.weakestAreas?.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Areas to Improve
              </h2>

              <div className="space-y-3">

                {finalReport.weakestAreas.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-slate-300"
                    >
                      • {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {strengths.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Key Strengths
              </h2>

              <div className="space-y-3">

                {strengths.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-slate-300"
                    >
                      ✓ {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Key Weaknesses
              </h2>

              <div className="space-y-3">

                {weaknesses.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-slate-300"
                    >
                      • {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {improvementPlan.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Personalized Improvement Plan
              </h2>

              <div className="space-y-3">

                {improvementPlan.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-slate-300"
                    >
                      <span className="font-bold text-yellow-400 mr-2">
                        {index + 1}.
                      </span>

                      {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {nextSteps.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Recommended Next Steps
              </h2>

              <div className="space-y-3">

                {nextSteps.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-slate-300"
                    >
                      <span className="font-bold text-purple-400 mr-2">
                        {index + 1}.
                      </span>

                      {item}
                    </div>
                  )
                )}

              </div>

            </div>
          )}

          <div className="glass rounded-2xl p-6 mb-6">

            <h2 className="text-xl font-semibold mb-5">
              Question-by-Question Performance
            </h2>

            <div className="space-y-4">

              {sessionResults.map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/70 border border-slate-800 rounded-xl p-5"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                          {item.questionNumber}
                        </div>

                        <div>

                          <div className="flex items-center gap-2">

                            <p className="font-medium">
                              Question{" "}
                              {item.questionNumber}
                            </p>

                            {item.isFollowUp && (
                              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                <FiMessageCircle size={12} />
                                AI Follow-up
                              </span>
                            )}

                          </div>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.question}
                          </p>

                        </div>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="text-2xl font-bold text-cyan-400">
                          {item.score}
                          <span className="text-sm text-slate-500">
                            /10
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {!finalReport &&
            getAllTips().length > 0 && (
              <div className="glass rounded-2xl p-6 mb-6">

                <h2 className="text-xl font-semibold mb-4">
                  Improvement Tips
                </h2>

                <div className="space-y-3">

                  {getAllTips().map(
                    (item, index) => (
                      <div
                        key={index}
                        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-slate-300"
                      >
                        💡 {item}
                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          <div className="grid md:grid-cols-2 gap-4">

            <button
              onClick={restartFullInterview}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
            >
              <FiRefreshCw />
              Start New Interview
            </button>

            <button
              onClick={startPractice}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition"
            >
              <FiMic />
              Practice One Question
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FiMic size={25} />
            </div>

            <div>

              <h1 className="text-3xl md:text-4xl font-bold">
                AI Mock Interview
              </h1>

              <p className="text-slate-400 mt-1">
                Practice interview questions and get instant AI feedback.
              </p>

            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">

            <FiAlertCircle className="mt-0.5 shrink-0" />

            <p>{error}</p>

          </div>
        )}

        {/* FINAL REPORT LOADING */}

        {generatingReport && (
          <div className="mb-6 glass rounded-2xl p-8 text-center">

            <div className="w-14 h-14 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FiRefreshCw
                size={28}
                className="animate-spin"
              />
            </div>

            <h2 className="text-xl font-bold mt-5">
              Generating Your Final AI Report
            </h2>

            <p className="text-slate-400 mt-2">
              AI is reviewing your complete interview performance...
            </p>

          </div>
        )}

        {/* MODE SELECTION */}

        {!question &&
          !interviewStarted &&
          !sessionComplete &&
          !generatingReport && (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-6">

                <button
                  onClick={() => {
                    setInterviewMode("practice");
                    setQuestion("");
                    setSessionResults([]);
                    setSessionComplete(false);
                    setFinalReport(null);
                  }}
                  className="glass rounded-2xl p-6 text-left border border-transparent hover:border-cyan-500/40 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                    <FiMic size={24} />
                  </div>

                  <h2 className="text-xl font-bold">
                    Quick Practice
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Practice one question and get instant AI feedback.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-cyan-400 font-semibold">
                    Start Practice
                    <FiPlay />
                  </div>

                </button>

                <button
                  onClick={() => {
                    setInterviewMode("full");
                    setQuestion("");
                    setSessionResults([]);
                    setSessionComplete(false);
                    setFinalReport(null);
                  }}
                  className="glass rounded-2xl p-6 text-left border border-transparent hover:border-purple-500/40 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                    <FiTarget size={24} />
                  </div>

                  <h2 className="text-xl font-bold">
                    Full AI Interview
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Complete a 5-question adaptive interview with AI follow-up questions.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-purple-400 font-semibold">
                    Start Full Interview
                    <FiPlay />
                  </div>

                </button>

              </div>

              {/* SETTINGS */}

              <div className="glass rounded-2xl p-6 mb-6">

                <h2 className="text-xl font-semibold mb-5">
                  Interview Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Job Role
                    </label>

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    >
                      <option>
                        Frontend Developer
                      </option>

                      <option>
                        Backend Developer
                      </option>

                      <option>
                        Full Stack Developer
                      </option>

                      <option>
                        Software Engineer
                      </option>

                      <option>
                        Python Developer
                      </option>

                      <option>
                        Java Developer
                      </option>

                      <option>
                        Data Analyst
                      </option>

                      <option>
                        Data Scientist
                      </option>
                    </select>

                  </div>

                  <div>

                    <label className="block text-sm text-slate-400 mb-2">
                      Difficulty
                    </label>

                    <select
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(
                          e.target.value
                        )
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    >
                      <option>
                        Beginner
                      </option>

                      <option>
                        Intermediate
                      </option>

                      <option>
                        Advanced
                      </option>
                    </select>

                  </div>

                </div>

                {interviewMode === "full" ? (
                  <button
                    onClick={startFullInterview}
                    disabled={loadingQuestion}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    {loadingQuestion ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Starting Interview...
                      </>
                    ) : (
                      <>
                        <FiPlay />
                        Start 5-Question Interview
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={startPractice}
                    disabled={loadingQuestion}
                    className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    {loadingQuestion ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiMic />
                        Generate Question
                      </>
                    )}
                  </button>
                )}

              </div>
            </>
          )}

        {/* VOICE NOTICE */}

        {!voiceSupported && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-300">

            <p className="font-semibold">
              Voice recognition is unavailable
            </p>

            <p className="text-sm mt-1 text-yellow-200/70">
              Use Google Chrome or Microsoft Edge for speech-to-text.
            </p>

          </div>
        )}

        {/* PROGRESS */}

        {interviewStarted && (
          <div className="glass rounded-2xl p-5 mb-6">

            <div className="flex items-center justify-between mb-3">

              <div>

                <p className="text-sm text-slate-400">
                  Adaptive AI Interview
                </p>

                <p className="font-semibold mt-1">
                  Question{" "}
                  {currentQuestionNumber} of{" "}
                  {TOTAL_QUESTIONS}
                </p>

              </div>

              <div className="text-cyan-400 font-bold">
                {Math.round(
                  ((currentQuestionNumber - 1) /
                    TOTAL_QUESTIONS) *
                    100
                )}
                %
              </div>

            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestionNumber - 1) /
                      TOTAL_QUESTIONS) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>
        )}

        {/* QUESTION */}

        {question && (
          <div className="glass rounded-2xl p-6 mb-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

              <div>

                <div className="flex items-center gap-2">

                  <FiCheckCircle className="text-cyan-400" />

                  <h2 className="text-xl font-semibold">
                    {interviewStarted
                      ? `Question ${currentQuestionNumber}`
                      : "Interview Question"}
                  </h2>

                </div>

                {isFollowUp && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-purple-400">

                    <FiMessageCircle />

                    AI Follow-up Question

                  </div>
                )}

              </div>

              {!isSpeaking ? (
                <button
                  onClick={speakQuestion}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition"
                >
                  <FiVolume2 />
                  Listen
                </button>
              ) : (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                >
                  <FiVolumeX />
                  Stop Voice
                </button>
              )}

            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">

              <p className="text-lg text-slate-200 leading-relaxed">
                {question}
              </p>

            </div>

          </div>
        )}

        {/* ANSWER */}

        {question &&
          !feedback &&
          !sessionComplete && (
            <div className="glass rounded-2xl p-6 mb-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

                <h2 className="text-xl font-semibold">
                  Your Answer
                </h2>

                {isListening && (
                  <div className="flex items-center gap-2 text-red-400">

                    <span className="relative flex h-3 w-3">

                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />

                    </span>

                    Listening...

                  </div>
                )}

              </div>

              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder={
                  isListening
                    ? "Speak your answer..."
                    : "Type your answer or use the microphone..."
                }
                rows={8}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 outline-none resize-none focus:border-cyan-500"
              />

              <div className="mt-4 grid md:grid-cols-2 gap-3">

                {!isListening ? (
                  <button
                    onClick={startListening}
                    disabled={!voiceSupported}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition disabled:opacity-40"
                  >
                    <FiMic size={20} />
                    Start Speaking
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 transition"
                  >
                    <FiMicOff size={20} />
                    Stop Recording
                  </button>
                )}

                <div className="flex items-center justify-center px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-400">
                  {isListening
                    ? "Your speech is being transcribed."
                    : "Type or speak your answer."}
                </div>

              </div>

              <button
                onClick={submitAnswer}
                disabled={
                  submitting ||
                  isListening ||
                  loadingQuestion ||
                  generatingReport
                }
                className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
              >

                {submitting ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <FiSend />

                    {interviewStarted
                      ? currentQuestionNumber ===
                        TOTAL_QUESTIONS
                        ? "Finish Interview"
                        : "Submit & Continue"
                      : "Submit Answer"}
                  </>
                )}

              </button>

            </div>
          )}

        {/* PRACTICE FEEDBACK */}

        {feedback &&
          !interviewStarted &&
          !sessionComplete && (
            <div className="space-y-6">

              <div className="glass rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                    <FiAward size={25} />
                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      AI Interview Feedback
                    </h2>

                    <p className="text-slate-400 text-sm">
                      Your answer has been evaluated.
                    </p>

                  </div>

                </div>

                <div className="text-center bg-slate-900/70 rounded-2xl p-8">

                  <p className="text-slate-400">
                    Interview Score
                  </p>

                  <p className="text-6xl font-bold text-cyan-400 mt-2">
                    {feedback.score}
                    <span className="text-2xl text-slate-500">
                      /10
                    </span>
                  </p>

                </div>

              </div>

              {/* ======================================
                  AI ANSWER DETECTION
              ====================================== */}

              {typeof feedback.aiGenerated ===
                "boolean" && (
                <AIDetectionCard
                  aiGenerated={
                    feedback.aiGenerated
                  }
                  confidence={
                    feedback.aiDetectionConfidence
                  }
                  reason={
                    feedback.aiDetectionReason
                  }
                />
              )}

              <div className="grid md:grid-cols-3 gap-5">

                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Confidence
                  </p>

                  <p className="mt-2 font-semibold">
                    {feedback.confidence ||
                      "N/A"}
                  </p>
                </div>

                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Clarity
                  </p>

                  <p className="mt-2 font-semibold">
                    {feedback.clarity ||
                      "N/A"}
                  </p>
                </div>

                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Technical Accuracy
                  </p>

                  <p className="mt-2 font-semibold">
                    {feedback.technicalAccuracy ||
                      "N/A"}
                  </p>
                </div>

              </div>

              {feedback.strengths?.length > 0 && (
                <div className="glass rounded-2xl p-6">

                  <h2 className="text-xl font-semibold mb-4">
                    Strengths
                  </h2>

                  <div className="space-y-3">

                    {feedback.strengths.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-slate-300"
                        >
                          ✓ {item}
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {feedback.weaknesses?.length > 0 && (
                <div className="glass rounded-2xl p-6">

                  <h2 className="text-xl font-semibold mb-4">
                    Areas to Improve
                  </h2>

                  <div className="space-y-3">

                    {feedback.weaknesses.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-slate-300"
                        >
                          • {item}
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {feedback.betterAnswer && (
                <div className="glass rounded-2xl p-6">

                  <h2 className="text-xl font-semibold mb-4">
                    Better Answer
                  </h2>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 text-slate-300 leading-relaxed">
                    {feedback.betterAnswer}
                  </div>

                </div>
              )}

              {feedback.tips?.length > 0 && (
                <div className="glass rounded-2xl p-6">

                  <h2 className="text-xl font-semibold mb-4">
                    Improvement Tips
                  </h2>

                  <div className="space-y-3">

                    {feedback.tips.map(
                      (tip, index) => (
                        <div
                          key={index}
                          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-slate-300"
                        >
                          💡 {tip}
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              <button
                onClick={nextPracticeQuestion}
                disabled={loadingQuestion}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
              >

                {loadingQuestion ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Generating Follow-up...
                  </>
                ) : (
                  <>
                    <FiMessageCircle />
                    Ask AI Follow-up Question
                  </>
                )}

              </button>

            </div>
          )}

      </div>
    </div>
  );
}

// ==========================================
// AI DETECTION CARD
// ==========================================

function AIDetectionCard({
  aiGenerated,
  confidence,
  reason,
}) {
  const styles = aiGenerated
    ? {
        container:
          "bg-yellow-500/10 border-yellow-500/20",
        icon: "text-yellow-400",
        title: "text-yellow-300",
      }
    : {
        container:
          "bg-green-500/10 border-green-500/20",
        icon: "text-green-400",
        title: "text-green-300",
      };

  return (
    <div
      className={`rounded-2xl border p-6 ${styles.container}`}
    >

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-slate-950/40 flex items-center justify-center shrink-0">
            <FiShield
              size={24}
              className={styles.icon}
            />
          </div>

          <div>

            <p className="text-sm text-slate-400">
              AI Answer Detection
            </p>

            <h2
              className={`text-xl font-bold mt-1 ${styles.title}`}
            >
              {aiGenerated
                ? "Potentially AI-Generated"
                : "No Strong AI Signals"}
            </h2>

          </div>

        </div>

        {confidence && (
          <span className="px-3 py-1.5 rounded-full bg-slate-950/40 border border-slate-700 text-sm text-slate-300">
            Confidence: {confidence}
          </span>
        )}

      </div>

      {reason && (
        <div className="mt-5 bg-slate-950/30 rounded-xl p-4">

          <p className="text-sm text-slate-400 mb-1">
            AI Analysis
          </p>

          <p className="text-slate-300 leading-relaxed">
            {reason}
          </p>

        </div>
      )}

      <p className="text-xs text-slate-500 mt-4">
        AI detection is an indication based on writing
        patterns, not proof of AI usage.
      </p>

    </div>
  );
}