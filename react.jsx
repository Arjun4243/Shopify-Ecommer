import { useState } from "react";

export default function Applications() 
{
  const [search, setSearch] = useState("");

  const applications = 
  [
    {
      id: 1,
      initials: "AS",
      name: "Arjun Sharma",
      email: "arjun@example.com",
      phone: "+91 98765 43210",
      experience: "2 Years",
      availableStart: "01 Oct 2026",
      appliedFor: "Web Developer",
      expectedSalary: "₹35,000",
      status: "New",
    }
  ];

  const filteredApplications = applications.filter((application) => 
  {
    const value = search.toLowerCase();

    return 
    (
      application.name.toLowerCase().includes(value) ||
      application.email.toLowerCase().includes(value) ||
      application.appliedFor.toLowerCase().includes(value)
    );
  });

  const statusClass = (status) => {
    return `status status-${status.toLowerCase()}`;
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .applications-page {
          min-height: 100vh;
          padding: 18px;
          background: #f5f7fa;
          color: #172033;
          font-family: Arial, sans-serif;
        }

        /* =========================
           HEADER
        ========================= */

        .applications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .applications-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
        }

        .applications-subtitle {
          margin: 5px 0 0;
          color: #667085;
          font-size: 12px;
        }

        .export-btn {
          height: 38px;
          padding: 0 16px;

          border: 1px solid #d5dae5;
          border-radius: 7px;

          background: #ffffff;
          color: #1f2a44;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;
        }

        /* =========================
           FILTER BAR
        ========================= */

        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;

          padding: 12px;

          margin-bottom: 10px;

          background: #ffffff;
          border-radius: 10px;
        }

        .filter-left,
        .filter-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-box {
          width: 260px;
          height: 38px;

          padding: 0 12px;

          border: 1px solid #cfd5e2;
          border-radius: 7px;

          outline: none;

          font-size: 12px;
        }

        .search-box:focus {
          border-color: #3154c7;
        }

        .filter-btn,
        .status-select,
        .date-input {
          height: 38px;

          border: 1px solid #cfd5e2;
          border-radius: 7px;

          background: #ffffff;

          color: #495269;

          font-size: 12px;
        }

        .filter-btn {
          padding: 0 14px;
          cursor: pointer;
        }

        .status-select {
          width: 120px;
          padding: 0 10px;
        }

        .date-input {
          width: 175px;
          padding: 0 10px;
        }

        /* =========================
           TABLE
        ========================= */

        .table-card {
          overflow: hidden;

          background: #ffffff;

          border: 1px solid #edf0f4;
          border-radius: 9px;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .applications-table {
          width: 100%;
          min-width: 1000px;

          border-collapse: collapse;
        }

        .applications-table thead {
          background: #cceeff;
        }

        .applications-table th {
          padding: 13px 16px;

          text-align: left;

          color: #161d2d;

          font-size: 12px;
          font-weight: 700;

          white-space: nowrap;
        }

        .applications-table td {
          padding: 15px 16px;

          border-bottom: 1px solid #edf0f4;

          color: #172033;

          font-size: 12px;

          vertical-align: middle;
        }

        /* =========================
           APPLICANT
        ========================= */

        .applicant-info {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .applicant-avatar {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #e3efff;
          color: #2454bf;

          font-size: 13px;
          font-weight: 700;
        }

        .applicant-name {
          margin-bottom: 3px;

          font-size: 13px;
          font-weight: 700;
        }

        .applicant-contact {
          margin-top: 2px;

          color: #667085;

          font-size: 11px;
        }

        /* =========================
           STATUS
        ========================= */

        .status {
          display: inline-flex;
          align-items: center;

          padding: 6px 12px;

          border-radius: 20px;

          font-size: 11px;
          font-weight: 600;
        }

        .status::before {
          content: "";

          width: 7px;
          height: 7px;

          margin-right: 7px;

          border-radius: 50%;

          background: currentColor;
        }

        .status-new {
          background: #e2efff;
          color: #1661cf;
        }

        .status-shortlist {
          background: #eee3ff;
          color: #7136d8;
        }

        .status-interview {
          background: #fff0cf;
          color: #dc8500;
        }

        .status-final {
          background: #dcf5eb;
          color: #07966a;
        }

        .status-rejected {
          background: #ffe3e6;
          color: #df2537;
        }

        /* =========================
           ACTIONS
        ========================= */

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .view-btn,
        .more-btn {
          height: 35px;

          border: 1px solid #d1d8e6;
          border-radius: 6px;

          background: #ffffff;

          cursor: pointer;
        }

        .view-btn {
          padding: 0 14px;

          color: #1747b8;

          font-size: 11px;
          font-weight: 700;
        }

        .more-btn {
          width: 36px;

          color: #475467;

          font-size: 17px;
        }

        .view-btn:hover,
        .more-btn:hover {
          background: #f5f7fa;
        }

        /* =========================
           EMPTY STATE
        ========================= */

        .empty-row td {
          height: 260px;
        }

        .empty-state {
          text-align: center;

          color: #687083;

          font-size: 13px;
          font-weight: 600;
        }

        /* =========================
           TABLE FOOTER
        ========================= */

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 14px 16px;

          color: #667085;

          font-size: 11px;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .page-btn {
          width: 34px;
          height: 34px;

          border: 1px solid #d5dae5;
          border-radius: 6px;

          background: #ffffff;

          cursor: pointer;
        }

        .page-btn.active {
          border-color: #3154c7;

          background: #3154c7;

          color: #ffffff;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 800px) {

          .applications-page {
            padding: 12px;
          }

          .applications-header {
            align-items: flex-start;
          }

          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-left,
          .filter-right {
            width: 100%;
          }

          .search-box {
            width: 100%;
          }

          .status-select,
          .date-input {
            flex: 1;
          }

        }

      `}</style>

      <div className="applications-page">

        {/* =============================
            HEADER
        ============================= */}

        <div className="applications-header">

          <div>

            <h1 className="applications-title">
              All Applications
            </h1>

            <p className="applications-subtitle">
              Manage and track all job applications in one place.
            </p>

          </div>

          <button type="button" className="export-btn">
            ↓ Export
          </button>

        </div>


        {/* =============================
            FILTERS
        ============================= */}

        <div className="filter-bar">

          <div className="filter-left">

            <input
              type="text"
              className="search-box"
              placeholder="⌕  Search by name, email, job title..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <button
              type="button"
              className="filter-btn"
            >
              ⚲ Filter
            </button>

          </div>


          <div className="filter-right">

            <select className="status-select">
              <option>Active</option>
              <option>All</option>
              <option>New</option>
              <option>Shortlist</option>
              <option>Interview</option>
              <option>Final</option>
              <option>Rejected</option>
            </select>

            <input
              type="date"
              className="date-input"
            />

          </div>

        </div>


        {/* =============================
            APPLICATION TABLE
        ============================= */}

        <div className="table-card">

          <div className="table-scroll">

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

                {filteredApplications.length > 0 ? (

                  filteredApplications.map(
                    (application) => (

                      <tr key={application.id}>

                        {/* NAME */}

                        <td>

                          <div className="applicant-info">

                            <div className="applicant-avatar">
                              {application.initials}
                            </div>

                            <div>

                              <div className="applicant-name">
                                {application.name}
                              </div>

                              <div className="applicant-contact">
                                {application.email}
                              </div>

                              <div className="applicant-contact">
                                {application.phone}
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* EXPERIENCE */}

                        <td>
                          {application.experience}
                        </td>


                        {/* START */}

                        <td>
                          {application.availableStart}
                        </td>


                        {/* JOB */}

                        <td>
                          {application.appliedFor}
                        </td>


                        {/* SALARY */}

                        <td>
                          {application.expectedSalary}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={statusClass(
                              application.status
                            )}
                          >
                            {application.status}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="actions">

                            <button
                              type="button"
                              className="view-btn"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="more-btn"
                            >
                              ⋯
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr className="empty-row">

                    <td colSpan="7">

                      <div className="empty-state">
                        No records found
                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* =============================
              FOOTER
          ============================= */}

          {filteredApplications.length > 0 && (

            <div className="table-footer">

              <span>
                Showing 1 to{" "}
                {filteredApplications.length} of{" "}
                {applications.length} applications
              </span>


              <div className="pagination">

                <button
                  type="button"
                  className="page-btn"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="page-btn active"
                >
                  1
                </button>

                <button
                  type="button"
                  className="page-btn"
                >
                  ›
                </button>

              </div>

            </div>

          )}

        </div>

      </div>
    </>
  );
}