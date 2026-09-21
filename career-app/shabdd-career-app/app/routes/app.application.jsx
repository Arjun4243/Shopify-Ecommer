import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import ApplicationTable from "../components/applications/ApplicationTable";
import { getApplicationsForShop } from "../models/application.server";
import { authenticate } from "../shopify.server";

const avatarTones = ["blue", "green", "red", "purple"];

const statusLabels = {
  unlisted: "New",
  shortlist: "Shortlist",
  phone: "Phone",
  face: "Face",
  test: "Test",
  final: "Final",
  hired: "Hired",
  rejected: "Rejected",
};

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const applications = await getApplicationsForShop(session.shop);

  return {
    applications: applications.map((application, index) =>
      serializeApplication(application, index),
    ),
  };
};

export default function Applications() {
  const { applications } = useLoaderData();
  const [search, setSearch] = useState("");

  const filteredApplications = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return applications;
    }

    return applications.filter((application) => {
      return (
        application.name.toLowerCase().includes(value) ||
        application.email.toLowerCase().includes(value) ||
        application.appliedFor.toLowerCase().includes(value)
      );
    });
  }, [applications, search]);

  return (
    <s-page>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .applications-page {
          width: calc(100vw - 96px);
          min-height: 100vh;
          padding: 18px 20px;
          background: #f6f8fb;
          color: #071436;
          font-family: Arial, sans-serif;
          margin-left: calc(50% - 50vw + 48px);
          margin-right: 48px;
        }

        .applications-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .applications-title {
          margin: 0;
          color: #071436;
          font-size: 28px;
          line-height: 34px;
          font-weight: 750;
        }

        .applications-subtitle {
          margin: 4px 0 0;
          color: #303a5f;
          font-size: 14px;
          line-height: 20px;
        }

        .applications-export-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          height: 42px;
          min-width: 118px;
          padding: 0 18px;
          border: 1px solid #d7deec;
          border-radius: 7px;
          background: #ffffff;
          color: #071436;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          cursor: pointer;
          font-size: 14px;
          font-weight: 750;
        }

        .applications-export-icon {
          font-size: 12px;
          line-height: 1;
        }

        .applications-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 12px;
          margin-bottom: 10px;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
        }

        .applications-toolbar-left,
        .applications-toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .applications-search-wrap {
          position: relative;
          width: 320px;
        }

        .applications-search-icon {
          position: absolute;
          top: 50%;
          left: 13px;
          color: #071436;
          font-size: 13px;
          font-weight: 700;
          transform: translateY(-50%);
        }

        .applications-search {
          width: 100%;
          height: 38px;
          padding: 0 12px 0 35px;
          border: 1px solid #cfd7e7;
          border-radius: 7px;
          background: #ffffff;
          color: #071436;
          outline: none;
          font-size: 12px;
        }

        .applications-search:focus {
          border-color: #2457d6;
          box-shadow: 0 0 0 2px rgba(36, 87, 214, 0.1);
        }

        .applications-filter-btn,
        .applications-status-select,
        .applications-date-input {
          height: 38px;
          border: 1px solid #cfd7e7;
          border-radius: 7px;
          background: #ffffff;
          color: #071436;
          font-size: 12px;
        }

        .applications-filter-btn {
          position: relative;
          padding: 0 14px 0 34px;
          cursor: pointer;
        }

        .applications-filter-btn::before {
          content: "";
          position: absolute;
          top: 11px;
          left: 14px;
          width: 10px;
          height: 10px;
          border: 2px solid currentColor;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg);
        }

        .applications-filter-count {
          position: absolute;
          top: -10px;
          right: -10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2457d6;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
        }

        .applications-status-select {
          width: 148px;
          padding: 0 10px;
        }

        .applications-date-input {
          width: 270px;
          padding: 0 10px;
        }

        .applications-table-card {
          width: 100%;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e7ecf4;
          border-radius: 9px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.04);
        }

        .applications-table-scroll {
          overflow-x: auto;
        }

        .applications-table {
          width: max-content;
          min-width: 100%;
          border-collapse: collapse;
        }

        .applications-table thead {
          background: #c9efff;
        }

        .applications-table th {
          padding: 13px 16px;
          color: #071436;
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
        }

        .applications-table td {
          padding: 15px 16px;
          border-bottom: 1px solid #e8edf5;
          color: #071436;
          font-size: 12px;
          vertical-align: middle;
          white-space: nowrap;
        }

        .applications-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .application-person {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .application-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 15px;
          font-weight: 700;
        }

        .application-avatar.blue {
          background: #e3efff;
          color: #2457d6;
        }

        .application-avatar.green {
          background: #dff7eb;
          color: #06905f;
        }

        .application-avatar.red {
          background: #ffe6eb;
          color: #e11d48;
        }

        .application-avatar.purple {
          background: #eee3ff;
          color: #7c3aed;
        }

        .application-name {
          display: block;
          margin-bottom: 3px;
          font-size: 14px;
          font-weight: 700;
        }

        .application-contact {
          display: block;
          margin-top: 2px;
          color: #34405f;
          font-size: 12px;
        }

        .application-status {
          display: inline-flex;
          align-items: center;
          min-width: 72px;
          justify-content: center;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .application-status::before {
          content: "";
          width: 7px;
          height: 7px;
          margin-right: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .application-status.new {
          background: #e2efff;
          color: #145de0;
        }

        .application-status.shortlist {
          background: #eee3ff;
          color: #6d28d9;
        }

        .application-status.interview {
          background: #fff0cf;
          color: #db7c00;
        }

        .application-status.phone {
          background: #e0f2fe;
          color: #0369a1;
        }

        .application-status.face {
          background: #ede9fe;
          color: #6d28d9;
        }

        .application-status.test {
          background: #cffafe;
          color: #0e7490;
        }

        .application-status.final {
          background: #dcf5eb;
          color: #079568;
        }

        .application-status.hired {
          background: #dcfce7;
          color: #15803d;
        }

        .application-status.rejected {
          background: #ffe3e6;
          color: #e11d2f;
        }

        .application-status.default {
          background: #eef2f7;
          color: #475569;
        }

        .application-actions {
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .application-view-btn,
        .application-icon-btn {
          height: 35px;
          border: 1px solid #cfd7e7;
          border-radius: 6px;
          background: #ffffff;
          color: #071436;
          cursor: pointer;
        }

        .application-view-btn {
          padding: 0 14px;
          font-size: 11px;
          font-weight: 700;
        }

        .application-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          padding: 0;
          font-size: 11px;
          font-weight: 750;
        }

        .application-view-btn:hover,
        .application-icon-btn:hover {
          background: #f4f7fb;
        }

        .application-actions-menu {
          position: absolute;
          top: 42px;
          right: 0;
          z-index: 20;
          width: 210px;
          padding: 6px;
          border: 1px solid #dce3ef;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
        }

        .application-actions-menu button {
          display: block;
          width: 100%;
          height: 34px;
          padding: 0 11px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #071436;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
        }

        .application-actions-menu button:hover {
          background: #f4f7fb;
        }

        .application-actions-menu .danger {
          color: #e11d2f;
        }

        .applications-empty-row td {
          height: 260px;
          color: #687083;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }

        .applications-table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 58px;
          padding: 12px 16px;
          border-top: 1px solid #e8edf5;
          color: #34405f;
          font-size: 14px;
        }

        .applications-pagination {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .application-page-btn {
          width: 38px;
          height: 38px;
          border: 1px solid #cfd7e7;
          border-radius: 7px;
          background: #ffffff;
          color: #071436;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
        }

        .application-page-btn.active {
          border-color: #2457d6;
          background: #2457d6;
          color: #ffffff;
        }

        @media (max-width: 820px) {
          .applications-page {
            width: 100%;
            margin: 0;
            padding: 14px;
          }

          .applications-header {
            flex-direction: column;
          }

          .applications-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .applications-toolbar-left,
          .applications-toolbar-right {
            width: 100%;
            flex-wrap: wrap;
          }

          .applications-search-wrap,
          .applications-status-select,
          .applications-date-input {
            width: 100%;
            flex: 1 1 220px;
          }

          .applications-table-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="applications-page">
        <div className="applications-header">
          <div>
            <h1 className="applications-title">All Applications</h1>
            <p className="applications-subtitle">
              Manage and track all job applications in one place.
            </p>
          </div>

          <button type="button" className="applications-export-btn">
            <span className="applications-export-icon" aria-hidden="true">
              DL
            </span>
            Export
          </button>
        </div>

        <div className="applications-toolbar">
          <div className="applications-toolbar-left">
            <label className="applications-search-wrap">
              <span className="applications-search-icon" aria-hidden="true">
                O
              </span>
              <input
                type="text"
                className="applications-search"
                placeholder="Search by name, email, job title..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button type="button" className="applications-filter-btn">
              Filter
              <span className="applications-filter-count">2</span>
            </button>
          </div>

          <div className="applications-toolbar-right">
            <select className="applications-status-select" defaultValue="Active">
              <option>Active</option>
              <option>All</option>
              <option>New</option>
              <option>Shortlist</option>
              <option>Phone</option>
              <option>Face</option>
              <option>Test</option>
              <option>Interview</option>
              <option>Final</option>
              <option>Hired</option>
              <option>Rejected</option>
            </select>

            <input
              type="text"
              className="applications-date-input"
              placeholder="Select date range"
              readOnly
            />
          </div>
        </div>

        <ApplicationTable
          applications={filteredApplications}
          totalApplications={applications.length}
        />
      </div>
    </s-page>
  );
}

function serializeApplication(application, index) {
  const fullName = application.fullName || "Unnamed Applicant";
  const salaryType = application.salaryType || "Per Month";

  return {
    id: application._id.toString(),
    initials: getInitials(fullName),
    avatarTone: avatarTones[index % avatarTones.length],
    name: fullName,
    email: application.email || "No email",
    phone: application.phone || "No phone",
    experience: application.experience || "Not provided",
    availableStart: formatDate(application.availableStart),
    appliedFor: application.job?.jobTitle || "Job not found",
    expectedSalary: formatSalary(application.expectedSalary, salaryType),
    status: statusLabels[application.status] || "New",
  };
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not provided";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatSalary(value, salaryType) {
  const salary = Number(value);

  if (!Number.isFinite(salary)) {
    return "Not provided";
  }

  return `Rs. ${salary.toLocaleString("en-IN")} (${salaryType})`;
}
