import React from "react";

export default function ProgressBar({ foundCount, totalCount }) {
  const percentage = totalCount > 0 ? (foundCount / totalCount) * 100 : 0;

  return (
    <section
      className="progress-card"
      aria-label={`Found ${foundCount} out of ${totalCount} Kathleens`}
    >
      <div className="progress-copy">
        <span className="progress-label">Found</span>
        <strong>
          {foundCount} / {totalCount}
        </strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
