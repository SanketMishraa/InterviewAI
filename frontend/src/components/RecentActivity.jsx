
import { Link } from "react-router-dom";
import { FiArrowRight, FiClipboard } from "react-icons/fi";

export default function RecentActivity({ interviews = [] }) {
  const recentInterviews = [...interviews]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="activity-panel">
      <header className="activity-header">
        <div>
          <h2>Recent Interviews</h2>
          <p>Your latest practice sessions</p>
        </div>

        <Link
          className="activity-see-all"
          to="/interview-history"
          aria-label="See all interview history"
        >
          See all
          <FiArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      {recentInterviews.length === 0 ? (
        <div className="activity-empty">
          <FiClipboard size={22} aria-hidden="true" />
          <p>No interviews yet</p>
          <span>Your completed practice sessions will appear here.</span>
        </div>
      ) : (
        <div className="activity-list">
          {recentInterviews.map((item, index) => (
            <div
              className="activity-item"
              key={item._id || `${item.createdAt}-${index}`}
            >
              <div className="activity-item-icon" aria-hidden="true">
                <FiClipboard size={17} />
              </div>

              <div className="activity-item-details">
                <span className="activity-role">
                  {item.role || "Mock Interview"}
                </span>

                <span className="activity-date">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="activity-score">
                <strong>{item.score ?? "—"}</strong>
                <span>/10</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}