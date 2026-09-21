/* eslint-disable react/prop-types */

import ApplicationActions from "./ApplicationActions";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

export default function ApplicationTable({ applications, totalApplications }) {
  return (
    <div className="applications-table-card">
      <div className="applications-table-scroll">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Experience</th>
              <th>Available Start</th>
              <th>Applied For</th>
              <th>Expected Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr className="applications-empty-row">
                <td colSpan="7">No applications found.</td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="application-person">
                      <span className={`application-avatar ${application.avatarTone}`}>
                        {application.initials}
                      </span>

                      <span>
                        <strong className="application-name">
                          {application.name}
                        </strong>
                        <span className="application-contact">
                          {application.email}
                        </span>
                        <span className="application-contact">
                          {application.phone}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td>{application.experience}</td>
                  <td>{application.availableStart}</td>
                  <td>{application.appliedFor}</td>
                  <td>{application.expectedSalary}</td>
                  <td>
                    <ApplicationStatusBadge status={application.status} />
                  </td>
                  <td>
                    <ApplicationActions application={application} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {applications.length > 0 && (
        <div className="applications-table-footer">
          <span>
            Showing 1 to {applications.length} of {totalApplications} applications
          </span>

          <div className="applications-pagination">
            <button type="button" className="application-page-btn" aria-label="Previous page">
              &lt;
            </button>
            <button
              type="button"
              className="application-page-btn active"
              aria-label="Page 1"
            >
              1
            </button>
            <button type="button" className="application-page-btn" aria-label="Next page">
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
