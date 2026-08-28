import React from "react";
import { Link, useParams } from "react-router-dom";

const caseData = {
  "NHAA-1001": {
    language: "Telugu",
    channel: "Voice",
    incident: "Threat / Intimidation",
    svi: 91,
    risk: "Critical",
    status: "Escalated",
    complaint:
      "They are threatening me repeatedly and I am afraid that they may hurt me.",
    indicators: [
      "Repeated threats",
      "Fear / distress",
      "Intimidation",
      "Possible immediate danger"
    ],
    support: [
      "Emergency support",
      "Human responder review",
      "Police intervention",
      "Protection assessment"
    ]
  },

  "NHAA-1002": {
    language: "Hindi",
    channel: "Chat",
    incident: "Physical Violence",
    svi: 72,
    risk: "High",
    status: "Under Review",
    complaint:
      "I have been facing physical violence and I am scared to report it.",
    indicators: [
      "Fear",
      "Physical violence",
      "Emotional distress"
    ],
    support: [
      "Counselling",
      "Legal assistance",
      "Protection assessment"
    ]
  }
};

export default function CaseDetails() {

  const { id } = useParams();
  const data = caseData[id] || caseData["NHAA-1001"];

  return (
    <div className="officer-page">

      <Link to="/officer/cases" className="back">
        ← Back to Cases
      </Link>

      <header className="page-header">
        <div>
          <h1>Case {id}</h1>
          <p>AI-assisted case assessment</p>
        </div>

        <span className={`risk ${data.risk.toLowerCase()}`}>
          {data.risk}
        </span>
      </header>

      <div className="details-grid">

        <div className="card">

          <h2>Case Information</h2>

          <p><b>Language:</b> {data.language}</p>
          <p><b>Channel:</b> {data.channel}</p>
          <p><b>Incident:</b> {data.incident}</p>
          <p><b>Status:</b> {data.status}</p>

          <hr />

          <h3>Complaint</h3>

          <div className="complaint">
            {data.complaint}
          </div>

        </div>

        <div className="card svi-card">

          <h2>Stress Vulnerability Index</h2>

          <div className="svi-number">
            {data.svi}
            <small>/100</small>
          </div>

          <p>AI-assisted vulnerability indicator</p>

        </div>

      </div>

      <div className="details-grid">

        <div className="card">

          <h2>Detected Indicators</h2>

          <ul>
            {data.indicators.map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>

        </div>

        <div className="card">

          <h2>Suggested Support</h2>

          <ul>
            {data.support.map((item, index) => (
              <li key={index}>→ {item}</li>
            ))}
          </ul>

        </div>

      </div>

      <div className="human-review">
        ⚠️ <b>Human Verification Required</b>
        <p>
          AI results are decision-support indicators. Final action
          should be taken by an authorized human responder.
        </p>

        <button className="primary-button">
          Mark as Reviewed
        </button>
      </div>

    </div>
  );
}