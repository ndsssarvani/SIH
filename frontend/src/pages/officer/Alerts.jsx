import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialAlerts = [
  {
    id: 1,
    caseId: "NHAA-1001",
    severity: "Critical",
    type: "Immediate Danger",
    message: "Immediate danger indicators detected.",
    time: "10 minutes ago",
    acknowledged: false
  },
  {
    id: 2,
    caseId: "NHAA-1002",
    severity: "High",
    type: "Physical Violence",
    message: "Physical violence and fear indicators detected.",
    time: "25 minutes ago",
    acknowledged: false
  }
];

export default function Alerts() {

  const [alerts, setAlerts] = useState(initialAlerts);

  const acknowledge = id => {
    setAlerts(
      alerts.map(alert =>
        alert.id === id
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  return (
    <div className="officer-page">

      <header className="page-header">
        <div>
          <h1>Alerts</h1>
          <p>Critical and high-risk cases requiring attention.</p>
        </div>
      </header>

      {alerts.map(alert => (

        <div className="alert-card" key={alert.id}>

          <div className="alert-icon">
            {alert.severity === "Critical" ? "🚨" : "⚠️"}
          </div>

          <div className="alert-content">

            <div className="alert-top">

              <span className={`risk ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>

              <span>{alert.time}</span>

            </div>

            <h2>{alert.type}</h2>

            <p>{alert.message}</p>

            <div className="alert-actions">

              <Link
                className="button"
                to={`/officer/cases/${alert.caseId}`}
              >
                View Case
              </Link>

              {!alert.acknowledged && (
                <button
                  className="primary-button"
                  onClick={() => acknowledge(alert.id)}
                >
                  ✓ Acknowledge
                </button>
              )}

              {alert.acknowledged && (
                <span className="acknowledged">
                  ✓ Acknowledged
                </span>
              )}

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}