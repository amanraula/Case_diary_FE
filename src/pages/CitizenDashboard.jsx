import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function CitizenDashboard() {
  const [citizen, setCitizen] = useState(null);
  const [cases, setCases] = useState([]);

  // Dummy case data for testing
  const dummyCases = [
    {
      phone: "9998887777",
      caseId: "CRN-4421",
      title: "Cyber Fraud Complaint",
      timeline: [
        { date: "2025-01-10", text: "Complaint filed by the citizen" },
        { date: "2025-01-12", text: "Initial investigation started" },
        { date: "2025-01-15", text: "Transaction trace requested from bank" },
        { date: "2025-01-18", text: "Two suspects identified" },
      ],
    },
    {
      phone: "9876543210",
      caseId: "CRN-9982",
      title: "Vehicle Theft",
      timeline: [
        { date: "2025-02-05", text: "FIR registered at Rourkela station" },
        { date: "2025-02-07", text: "CCTV footage collected" },
        { date: "2025-02-10", text: "Vehicle sighted near Rajgangpur" },
      ],
    },
  ];

  // Load citizen on page load
  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("loggedCitizen"));

    if (!c) {
      window.location.href = "/citizen-login";
      return;
    }

    setCitizen(c);

    // Filter cases linked to phone
    const found = dummyCases.filter((item) => item.phone === c.phone);
    setCases(found);
  }, []);

  if (!citizen) return null;

  return (
    <div>
      <Header />

      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "10px" }}>
          Welcome, <span style={{ color: "#0A2A66" }}>{citizen.phone}</span>
        </h2>

        <p style={{ color: "#444" }}>
          Below are cases registered with your phone number.
        </p>

        {/* If no cases */}
        {cases.length === 0 && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#F9F9F9",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #ddd",
            }}
          >
            <h3>No Cases Found</h3>
            <p style={{ color: "#777" }}>
              There are currently no FIRs or cases linked to your phone number.
            </p>
          </div>
        )}

        {/* List cases */}
        {cases.map((c, idx) => (
          <div
            key={idx}
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "white",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#0A2A66" }}>
              {c.title} ({c.caseId})
            </h3>

            {/* Timeline */}
            <div style={{ marginTop: "20px" }}>
              {c.timeline.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  {/* Bullet point */}
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#0A2A66",
                      borderRadius: "50%",
                      marginRight: "15px",
                    }}
                  ></div>

                  <div>
                    <div
                      style={{ fontWeight: "600", marginBottom: "3px" }}
                    >
                      {t.date}
                    </div>
                    <div style={{ color: "#555" }}>{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}