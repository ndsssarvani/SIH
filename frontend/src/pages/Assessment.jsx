import React from "react";
import { useNavigate } from "react-router-dom";
import ClientNavbar from "../components/ClientNavbar";

export default function Assessment() {
  const navigate = useNavigate();

  const score = 18;

  return (
    <div className="assessment-page">
      <style>{`
        .assessment-page {
          min-height: 100vh;
          background: #FAF8F4;
          color: #2B2E33;
          font-family: 'Inter', sans-serif;
        }

        .assessment-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 45px 28px 70px;
        }

        .assessment-hero {
          margin-bottom: 30px;
        }

        .assessment-kicker {
          color: #6B968C;
          font-size: 11px;
          letter-spacing: .13em;
          margin-bottom: 8px;
        }

        .assessment-hero h1 {
          font-family: 'Fraunces', serif;
          font-size: 40px;
          margin: 0 0 10px;
          letter-spacing: -.02em;
        }

        .assessment-hero p {
          color: #6E7278;
          max-width: 650px;
          line-height: 1.7;
          margin: 0;
          font-size: 14px;
        }

        .assessment-grid {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 22px;
        }

        .assessment-card {
          background: white;
          border: 1px solid #E6E0D3;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(43,46,51,.06);
        }

        .score-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 390px;
        }

        .score-ring {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background:
            conic-gradient(#6B968C 0deg 65deg,
            #E7F0EC 65deg 360deg);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-25deg);
        }

        .score-inner {
          width: 174px;
          height: 174px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform: rotate(25deg);
        }

        .score-number {
          font-family: 'Fraunces', serif;
          font-size: 52px;
          line-height: 1;
        }

        .score-label {
          color: #6E7278;
          font-size: 11px;
          margin-top: 5px;
        }

        .risk-badge {
          margin-top: 18px;
          padding: 8px 20px;
          border-radius: 999px;
          background: #EAF1EA;
          color: #4A6B4E;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: .06em;
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-size: 21px;
          margin-bottom: 7px;
        }

        .card-description {
          color: #6E7278;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .indicator {
          margin-bottom: 20px;
        }

        .indicator-head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .indicator-head span:last-child {
          color: #6E7278;
        }

        .indicator-bar {
          height: 8px;
          background: #F1ECE3;
          border-radius: 999px;
          overflow: hidden;
        }

        .indicator-fill {
          height: 100%;
          border-radius: inherit;
          background: #6B968C;
        }

        .info-box {
          margin-top: 25px;
          padding: 15px;
          background: #E7F0EC;
          border-radius: 13px;
          color: #48685F;
          font-size: 12px;
          line-height: 1.6;
        }

        .assessment-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 11px 18px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .primary-btn {
          border: none;
          background: #6B968C;
          color: white;
        }

        .primary-btn:hover {
          background: #48685F;
        }

        .secondary-btn {
          border: 1px solid #D8D1C4;
          background: white;
          color: #2B2E33;
        }

        @media(max-width:800px) {
          .assessment-grid {
            grid-template-columns: 1fr;
          }

          .assessment-container {
            padding: 30px 16px;
          }

          .assessment-hero h1 {
            font-size: 32px;
          }
        }
      `}</style>

      <ClientNavbar />

      <main className="assessment-container">

        <section className="assessment-hero">
          <div className="assessment-kicker mono">SAHAYA AI · ASSESSMENT</div>
          <h1>Your wellbeing assessment</h1>
          <p>
            This assessment gives an indication of the level of support that
            may be useful right now. It is not a diagnosis and does not label
            you.
          </p>
        </section>

        <div className="assessment-grid">

          <section className="assessment-card score-card">
            <div className="score-ring">
              <div className="score-inner">
                <div className="score-number">{score}</div>
                <div className="score-label">SVI / 100</div>
              </div>
            </div>

            <div className="risk-badge">LOW RISK</div>

            <p className="card-description" style={{
              textAlign: "center",
              maxWidth: 440,
              marginTop: 15
            }}>
              Your current responses indicate a lower level of immediate
              distress. You can still request support whenever you need it.
            </p>
          </section>

          <section className="assessment-card">
            <h2 className="card-title">Assessment indicators</h2>

            <p className="card-description">
              These indicators are examples of the signals considered by the
              assessment system.
            </p>

            <div className="indicator">
              <div className="indicator-head">
                <span>Emotional distress</span>
                <span>Low</span>
              </div>
              <div className="indicator-bar">
                <div
                  className="indicator-fill"
                  style={{ width: "22%" }}
                />
              </div>
            </div>

            <div className="indicator">
              <div className="indicator-head">
                <span>Immediate safety concern</span>
                <span>Low</span>
              </div>
              <div className="indicator-bar">
                <div
                  className="indicator-fill"
                  style={{ width: "12%" }}
                />
              </div>
            </div>

            <div className="indicator">
              <div className="indicator-head">
                <span>Support requirement</span>
                <span>Low</span>
              </div>
              <div className="indicator-bar">
                <div
                  className="indicator-fill"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            <div className="info-box">
              <strong>Important:</strong> The assessment is intended for
              support routing. It should not be treated as a medical or
              psychological diagnosis.
            </div>

            <div className="assessment-actions">
              <button
                className="primary-btn"
                onClick={() => navigate("/complaint")}
              >
                Continue conversation
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/support")}
              >
                View support
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}