import React from "react";

export default function Reports() {

  const reports = [
    ["Critical", 87],
    ["High", 231],
    ["Moderate", 430],
    ["Low", 500]
  ];

  return (
    <div className="officer-page">

      <header className="page-header">

        <div>
          <h1>Reports & Analytics</h1>
          <p>Complaint and risk-level overview.</p>
        </div>

        <button className="primary-button">
          ⬇ Generate Report
        </button>

      </header>

      <div className="stats">

        <div className="stat-card">
          <span>Total Complaints</span>
          <h2>1,248</h2>
        </div>

        <div className="stat-card critical">
          <span>Critical Cases</span>
          <h2>87</h2>
        </div>

        <div className="stat-card high">
          <span>High Risk</span>
          <h2>231</h2>
        </div>

        <div className="stat-card">
          <span>Cases Resolved</span>
          <h2>846</h2>
        </div>

      </div>

      <div className="card">

        <h2>Risk Distribution</h2>

        {reports.map(([name, value]) => (

          <div className="report-row" key={name}>

            <div>
              <b>{name}</b>
              <span>{value} cases</span>
            </div>

            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: `${(value / 1248) * 100}%` }}
              />
            </div>

          </div>

        ))}

      </div>

      <div className="card">

        <h2>Support Required</h2>

        <div className="support-row">
          ⚖️ Legal Assistance
          <b>542</b>
        </div>

        <div className="support-row">
          🧠 Counselling
          <b>386</b>
        </div>

        <div className="support-row">
          🚨 Emergency Support
          <b>87</b>
        </div>

        <div className="support-row">
          🛡️ Protection Assessment
          <b>156</b>
        </div>

      </div>

    </div>
  );
}