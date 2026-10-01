
import { useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import API from "../services/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function AnalysisSection({ title, items, type = "default" }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <section className="resume-section">
      <div className="resume-section-heading">
        <h2>{title}</h2>
        <span className="resume-count">{list.length}</span>
      </div>

      {list.length > 0 ? (
        <ul className="resume-list">
          {list.map((item, index) => (
            <li className={`resume-list-item ${type}`} key={`${title}-${index}`}>
              <span className="resume-list-marker" aria-hidden="true" />
              <span>{String(item)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="resume-empty">
          No items available in this section.
        </p>
      )}
    </section>
  );
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("The PDF must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Select a PDF resume before continuing.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/resume/analyze", formData);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Resume analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const score = Number(result?.atsScore);
  const hasScore = Number.isFinite(score);
  const safeScore = hasScore
    ? Math.min(100, Math.max(0, score))
    : null;

  return (
    <main className="resume-page">
      <div className="resume-container">
        <header className="resume-header">
          <div>
            <p className="resume-eyebrow">RESUME TOOLS</p>
            <h1>Resume Analyzer</h1>
            <p className="resume-subtitle">
              Review your resume, identify missing keywords, and find
              areas to improve before applying.
            </p>
          </div>
        </header>

        <section className="resume-upload-panel">
          <form onSubmit={handleUpload}>
            <label className="resume-field-label" htmlFor="resume-file">
              Upload resume
            </label>

            <div className="resume-upload-row">
              <label className="resume-file-picker" htmlFor="resume-file">
                <FiUploadCloud size={20} aria-hidden="true" />
                <span>{file ? "Change PDF" : "Choose PDF"}</span>
              </label>

              <input
                id="resume-file"
                className="resume-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
              />

              <button
                type="submit"
                className="resume-primary-button"
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="resume-spin" size={16} />
                    Analyzing
                  </>
                ) : (
                  "Analyze resume"
                )}
              </button>
            </div>

            {file && (
              <div className="resume-selected-file">
                <FiFileText size={17} aria-hidden="true" />
                <span className="resume-filename">{file.name}</span>
                <span className="resume-file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}

            <p className="resume-help-text">
              PDF format only. Maximum file size: 5 MB.
            </p>

            {error && (
              <div className="resume-message resume-error" role="alert">
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <p className="resume-status" role="status">
                Extracting resume content and preparing your analysis...
              </p>
            )}
          </form>
        </section>

        {result && (
          <div className="resume-results" aria-live="polite">
            <div className="resume-results-header">
              <div>
                <p className="resume-eyebrow">ANALYSIS REPORT</p>
                <h2>Resume results</h2>
              </div>

              <button
                type="button"
                className="resume-secondary-button"
                onClick={() => {
                  setResult(null);
                  setError("");
                }}
              >
                Analyze another
              </button>
            </div>

            <section className="resume-score-panel">
              <div className="resume-score-summary">
                <div>
                  <p className="resume-score-label">ATS score</p>
                  <p className="resume-score-caption">
                    Resume compatibility assessment
                  </p>
                </div>

                {hasScore ? (
                  <div className="resume-score-value">
                    <strong>{safeScore}</strong>
                    <span>%</span>
                  </div>
                ) : (
                  <span className="resume-empty">Score unavailable</span>
                )}
              </div>

              {hasScore && (
                <div
                  className="resume-score-track"
                  role="progressbar"
                  aria-label="ATS score"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeScore}
                >
                  <div
                    className="resume-score-fill"
                    style={{ width: `${safeScore}%` }}
                  />
                </div>
              )}
            </section>

            <div className="resume-results-grid">
              <AnalysisSection
                title="Strengths"
                items={result.strengths}
                type="positive"
              />

              <AnalysisSection
                title="Weaknesses"
                items={result.weaknesses}
                type="negative"
              />

              <AnalysisSection
                title="Missing keywords"
                items={result.missingKeywords}
                type="keyword"
              />

              <AnalysisSection
                title="Recommended improvements"
                items={result.suggestions}
                type="suggestion"
              />
            </div>

            <p className="resume-disclaimer">
              ATS scores and recommendations are estimates. Review the
              suggestions and tailor your resume to each job description.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}