"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header"
import "./globals.css"

export default function CitizenDashboard() {
  const [citizen, setCitizen] = useState(null)
  const [cases, setCases] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const dummyCases = [
    {
      phone: "9998887777",
      caseId: "CRN-4421",
      title: "Cyber Fraud Complaint",
      timeline: [
        { date: "2025-01-10", text: "Complaint filed by citizen" },
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
  ]

  useEffect(() => {
    setIsLoaded(true)
    const c = JSON.parse(localStorage.getItem("loggedCitizen"))
    if (!c) {
      window.location.href = "/citizen-login"
      return
    }
    setCitizen(c)
    const found = dummyCases.filter((item) => item.phone === c.phone)
    setCases(found)
  }, [])

  if (!citizen) return null

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0f0020 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-50px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(100, 150, 255, 0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Header />

      <div
        style={{
          flex: 1,
          padding: "40px 20px",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Welcome Section */}
        <div
          style={{
            marginBottom: "40px",
            animation: isLoaded ? "slideInDown 0.8s ease-out" : "none",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              color: "#64c8ff",
              marginBottom: "8px",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            [CASE TRACKER]
          </h1>
          <p
            style={{
              color: "#a0a0c0",
              fontSize: "14px",
              letterSpacing: "0.5px",
            }}
          >
            Linked to {citizen.phone}
          </p>
        </div>

        {/* No Cases */}
        {cases.length === 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              animation: "slideInUp 0.8s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#a0a0c0",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              [NO CASES FOUND]
            </div>
            <p
              style={{
                color: "#6a6a8a",
                fontSize: "13px",
                letterSpacing: "0.5px",
              }}
            >
              No FIRs or cases linked to your phone number at this time
            </p>
          </div>
        )}

        {/* Cases List */}
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {cases.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
                border: "1px solid rgba(100, 50, 255, 0.3)",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                animation: isLoaded ? `slideInUp 0.8s ease-out ${idx * 0.1}s both` : "none",
              }}
            >
              {/* Case Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#64c8ff",
                      fontSize: "18px",
                      fontWeight: "600",
                      margin: "0 0 4px 0",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {c.title}
                  </h2>
                  <p
                    style={{
                      color: "#a0a0c0",
                      fontSize: "12px",
                      margin: 0,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Case ID: {c.caseId}
                  </p>
                </div>
                <span
                  style={{
                    background: "rgba(100, 200, 255, 0.2)",
                    border: "1px solid rgba(100, 200, 255, 0.4)",
                    color: "#64c8ff",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ACTIVE
                </span>
              </div>

              {/* Timeline */}
              <div
                style={{
                  position: "relative",
                  paddingLeft: "24px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    bottom: "0",
                    width: "1px",
                    background: "linear-gradient(180deg, rgba(100, 50, 255, 0.5), transparent)",
                    pointerEvents: "none",
                  }}
                />

                {c.timeline.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: i < c.timeline.length - 1 ? "20px" : "0",
                      animation: isLoaded ? `slideInLeft 0.6s ease-out ${idx * 0.1 + i * 0.1}s both` : "none",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "-9px",
                        top: "4px",
                        width: "12px",
                        height: "12px",
                        background: "linear-gradient(135deg, #6432ff, #3d1f99)",
                        border: "2px solid #0a0a0a",
                        borderRadius: "50%",
                        boxShadow: "0 0 10px rgba(100, 50, 255, 0.5)",
                      }}
                    />
                    <div
                      style={{
                        color: "#64c8ff",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "4px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {t.date}
                    </div>
                    <p
                      style={{
                        color: "#a0a0c0",
                        fontSize: "13px",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
