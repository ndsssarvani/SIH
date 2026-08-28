import React, { useState } from "react";
import { Link } from "react-router-dom";

const cases = [
  {
    id: "NHAA-1001",
    language: "Telugu",
    channel: "Voice",
    incident: "Threat / Intimidation",
    svi: 91,
    risk: "Critical",
    status: "Escalated",
    date: "28-08-2026"
  },
  {
    id: "NHAA-1002",
    language: "Hindi",
    channel: "Chat",
    incident: "Physical Violence",
    svi: 72,
    risk: "High",
    status: "Under Review",
    date: "28-08-2026"
  },
  {
    id: "NHAA-1003",
    language: "English",
    channel: "Web",
    incident: "Discrimination",
    svi: 48,
    risk: "Moderate",
    status: "Assigned",
    date: "27-08-2026"
  },
  {
    id: "NHAA-1004",
    language: "Telugu",
    channel: "Voice",
    incident: "Complaint",
    svi: 22,
    risk: "Low",
    status: "Resolved",
    date: "27-08-2026"
  }
];

export default function Cases() {

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("All");

  const filteredCases = cases.filter(item =>
    (item.id.toLowerCase().includes(search.toLowerCase()) ||
     item.incident.toLowerCase().includes(search.toLowerCase()) ||
     item.language.toLowerCase().includes(search.toLowerCase()))
    &&
    (risk === "All" || item.risk === risk)
  );

  return (
    <div className="officer-page">

      <header className="page-header">
        <div>
          <h1>Cases</h1>
          <p>View and manage victim complaints.</p>
        </div>
      </header>

      <div className="filters">

        <input
          type="text"
          placeholder="Search Case ID, incident or language..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={risk}
          onChange={e => setRisk(e.target.value)}
        >
          <option value="All">All Risk Levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

      </div>

      <div className="card">

        <h2>All Cases ({filteredCases.length})</h2>

        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Language</th>
              <th>Channel</th>
              <th>Incident</th>
              <th>SVI</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCases.map(item => (
              <tr key={item.id}>

                <td><b>{item.id}</b></td>
                <td>{item.language}</td>
                <td>{item.channel}</td>
                <td>{item.incident}</td>
                <td><b>{item.svi}</b>/100</td>

                <td>
                  <span className={`risk ${item.risk.toLowerCase()}`}>
                    {item.risk}
                  </span>
                </td>

                <td>{item.status}</td>

                <td>
                  <Link
                    className="button"
                    to={`/officer/cases/${item.id}`}
                  >
                    Details
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredCases.length === 0 && (
          <div className="empty">
            No cases found.
          </div>
        )}

      </div>

    </div>
  );
}