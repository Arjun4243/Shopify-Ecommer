/* eslint-disable react/prop-types */

import { useState } from "react";

export default function ApplicationActions({ application }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="application-actions" aria-label={`Actions for ${application.name}`}>
      <button type="button" className="application-view-btn">
        View
      </button>

      <button
        type="button"
        className="application-icon-btn"
        aria-label={`Download resume for ${application.name}`}
        title="Download resume"
      >
        <span aria-hidden="true">DL</span>
      </button>

      <button
        type="button"
        className="application-icon-btn"
        aria-label={`More actions for ${application.name}`}
        title="More actions"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span aria-hidden="true">...</span>
      </button>

      {isMenuOpen && (
        <div className="application-actions-menu">
          <button type="button">View Details</button>
          <button type="button">Download Resume</button>
          <button type="button">Move to Shortlist</button>
          <button type="button">Move to Phone</button>
          <button type="button">Move to Face</button>
          <button type="button">Move to Test</button>
          <button type="button">Move to Final</button>
          <button type="button">Mark as Hired</button>
          <button type="button">Reject</button>
          <button type="button" className="danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
