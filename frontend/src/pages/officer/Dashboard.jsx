import React from "react";
import { Link } from "react-router-dom";

const cases = [
  { id: "NHAA-1001", risk: "Critical", svi: 91, incident: "Threat / Intimidation" },
  { id: "NHAA-1002", risk: "High", svi: 72, incident: "Physical Violence" },
  { id: "NHAA-1003", risk: "Moderate", svi: 48, incident: "Discrimination" },
  { id: "NHAA-1004", risk: "Low", svi: 22, incident: "Complaint" }
];

export default function Dashboard() {
  const critical = cases.filter(c => c.risk === "Critical").length;
  const high = cases.filter(c => c.risk === "High").length;

  return (
    <div className="officer-page">

      <header className="officer-header">
        <div>
          <h1>Officer Dashboard</h1>
          <p>AI-assisted victim complaint monitoring</p>
        </div>

        <div className="officer-profile">
          <div className="profile-icon">O</div>
          <div>
            <b>Officer</b>
            <small>Response Team</small>
          </div>
        </div>
      </header>

      {critical > 0 && (
        <div className="alert-box">
          🚨 <b>Critical Attention Required</b>
          <span>{critical} case needs immediate human review.</span>
          <Link to="/officer/alerts">View Alerts →</Link>
        </div>
      )}

      <div className="stats">

        <div className="stat-card">
          <span>Total Cases</span>
          <h2>{cases.length}</h2>
        </div>

        <div className="stat-card critical">
          <span>Critical</span>
          <h2>{critical}</h2>
        </div>

        <div className="stat-card high">
          <span>High Risk</span>
          <h2>{high}</h2>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <h2>24</h2>
        </div>

      </div>

      <div className="card">
        <div className="card-title">
          <h2>Recent Cases</h2>
          <Link to="/officer/cases">View All</Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Incident</th>
              <th>SVI</th>
              <th>Risk</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cases.map(item => (
              <tr key={item.id}>
                <td><b>{item.id}</b></td>
                <td>{item.incident}</td>
                <td>{item.svi}/100</td>
                <td>
                  <span className={`risk ${item.risk.toLowerCase()}`}>
                    {item.risk}
                  </span>
                </td>
                <td>
                  <Link
                    className="button"
                    to={`/officer/cases/${item.id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}