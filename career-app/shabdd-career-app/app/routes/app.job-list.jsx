import { useNavigate } from "react-router";

export default function JobList() {
    const navigate=useNavigate();
  return (
    <s-page>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .jobs-page {
          width: 100%;
          min-height: 100vh;
          padding: 18px 20px;
          background: #f6f7f8;
        }

        /* ==========================
           TOP HEADER
        ========================== */

        .jobs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .jobs-title {
          margin: 0;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
          color: #202223;
          white-space: nowrap;
        }

        /* ==========================
           STATUS TABS
        ========================== */

        .job-tabs {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 6px;
        }

        .job-tab {
          height: 36px;
          padding: 0 13px;

          border: 1px solid #d7d9dc;
          border-radius: 7px;

          background: #ffffff;
          color: #4a4f55;

          font-size: 13px;
          font-weight: 500;

          cursor: pointer;
          transition: all 0.2s ease;
        }

        .job-tab:hover {
          background: #f1f2f3;
          border-color: #b8bcc2;
        }

        .job-tab.active {
          background: #dff3ff;
          border-color: #b8e4fb;
          color: #1f4b99;
          font-weight: 600;
        }

        /* ==========================
           TOOLBAR
        ========================== */

        .jobs-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          padding: 12px;
          margin-bottom: 16px;

          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 10px;
        }

        .job-search {
          width: 320px;
          height: 38px;

          padding: 0 12px;

          border: 1px solid #c9cccf;
          border-radius: 7px;

          background: #ffffff;
          color: #202223;

          font-size: 13px;
          outline: none;
        }

        .job-search:focus {
          border-color: #5c6ac4;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-select {
          height: 38px;
          padding: 0 30px 0 12px;

          border: 1px solid #c9cccf;
          border-radius: 7px;

          background: #ffffff;
          color: #303030;

          font-size: 13px;
          cursor: pointer;
        }

        .post-job-btn {
          height: 38px;
          padding: 0 15px;

          border: none;
          border-radius: 7px;

          background: #303030;
          color: #ffffff;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;
        }

        .post-job-btn:hover {
          background: #1f1f1f;
        }

        /* ==========================
           JOB TABLE
        ========================== */

        .jobs-table-wrapper {
          overflow-x: auto;

          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 10px;
        }

        .jobs-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
        }

        .jobs-table th {
          padding: 12px 14px;

          background: #fafafa;
          border-bottom: 1px solid #e1e3e5;

          color: #616161;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
        }

        .jobs-table td {
          padding: 14px;

          border-bottom: 1px solid #eeeeee;

          color: #303030;
          font-size: 13px;
          vertical-align: middle;
        }

        .job-name {
          margin-bottom: 4px;

          color: #202223;
          font-size: 14px;
          font-weight: 600;
        }

        .job-meta {
          color: #6d7175;
          font-size: 12px;
        }

        .job-date {
          display: block;
          margin-top: 4px;

          color: #8c9196;
          font-size: 11px;
        }

        /* ==========================
           STATUS
        ========================== */

        .status-badge {
          display: inline-block;

          padding: 4px 9px;

          border-radius: 20px;

          background: #f1f1f1;
          color: #555;

          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.draft {
          background: #f1f1f1;
          color: #555;
        }

        /* ==========================
           ACTION BUTTONS
        ========================== */

        .actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn {
          padding: 6px 9px;

          border: 1px solid #d2d5d8;
          border-radius: 6px;

          background: #ffffff;
          color: #303030;

          font-size: 11px;
          font-weight: 500;

          cursor: pointer;
        }

        .action-btn:hover {
          background: #f5f5f5;
        }

        .more-btn {
          width: 30px;
          height: 30px;

          border: 1px solid #d2d5d8;
          border-radius: 6px;

          background: #ffffff;

          font-size: 16px;
          cursor: pointer;
        }

        /* ==========================
           TABLE FOOTER
        ========================== */

        .table-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;

          padding: 12px 14px;

          background: #ffffff;

          color: #6d7175;
          font-size: 12px;
        }

        .per-page {
          padding: 5px 8px;

          border: 1px solid #d2d5d8;
          border-radius: 5px;

          background: #ffffff;

          font-size: 12px;
        }

        /* ==========================
           RESPONSIVE
        ========================== */

        @media (max-width: 900px) {
          .jobs-page {
            padding: 14px;
          }

          .jobs-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .job-tabs {
            justify-content: flex-start;
          }

          .jobs-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .job-search {
            width: 100%;
          }

          .toolbar-actions {
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="jobs-page">

        {/* ======================
            HEADER
        ====================== */}

        <div className="jobs-header">
          <h1 className="jobs-title">All Jobs</h1>

          <div className="job-tabs">
            <button type="button" className="job-tab active">
              All Jobs (2)
            </button>

            <button type="button" className="job-tab">
              Published (1)
            </button>

            <button type="button" className="job-tab">
              Expired (0)
            </button>

            <button type="button" className="job-tab">
              Archived (0)
            </button>

            <button type="button" className="job-tab">
              Paused (0)
            </button>

            <button type="button" className="job-tab">
              Draft (1)
            </button>
          </div>
        </div>

        {/* ======================
            SEARCH TOOLBAR
        ====================== */}

        <div className="jobs-toolbar">

          <input
            type="text"
            className="job-search"
            placeholder="Search jobs..."
          />

          <div className="toolbar-actions">

          

            <button type="button" className="post-job-btn"
            onClick={()=>navigate("/app/create-job")}>
              + Post New Job
            </button>

          </div>
        </div>

        {/* ======================
            JOB LIST TABLE
        ====================== */}

        <div className="jobs-table-wrapper">

          <table className="jobs-table">

            <thead>
              <tr>
                <th>Job</th>
                <th>Applicants</th>
                <th>In Progress</th>
                <th>Rejected</th>
                <th>Hired</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              <tr>

                <td>
                  <div className="job-name">
                    Web Developer
                  </div>

                  <div className="job-meta">
                    Engineering
                  </div>

                  <span className="job-date">
                    📅 Oct 30, 2026
                  </span>
                </td>

                <td>0</td>

                <td>0</td>

                <td>0</td>

                <td>0</td>

                <td>
                  <span className="status-badge draft">
                    Draft
                  </span>
                </td>

                <td>
                  <div className="actions">

                    <button
                      type="button"
                      className="action-btn"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="action-btn"
                    >
                      Edit
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

            </tbody>

          </table>

          {/* TABLE FOOTER */}

          <div className="table-footer">

            <span>
              Showing 1 item
            </span>

            <select
              className="per-page"
              defaultValue="10"
            >
              <option value="10">10 Per Page</option>
              <option value="20">20 Per Page</option>
              <option value="50">50 Per Page</option>
            </select>

          </div>

        </div>

      </div>
    </s-page>
  );
}