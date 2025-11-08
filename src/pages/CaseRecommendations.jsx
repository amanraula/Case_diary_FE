"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import "./globals.css"

export default function CaseRecommendations() {
  const { caseNum } = useParams()
  const token = localStorage.getItem("jwt")
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
    const fetchRecommendations = async () => {
      try {
        const res = await api.get(`/cases/recommend/${caseNum}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(res.data)
      } catch (err) {
        console.error("Error loading recommendations:", err)
      }
    }
    fetchRecommendations()
  }, [caseNum, token])

  if (!data)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0f0020 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64c8ff",
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        [LOADING...]
      </div>
    )

  const { reference, recommendations } = data

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0f0020 100%)",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Background */}
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

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
            border: "1px solid rgba(100, 50, 255, 0.3)",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "28px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            animation: isLoaded ? "slideInDown 0.8s ease-out" : "none",
          }}
        >
          <h1
            style={{
              color: "#64c8ff",
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 12px 0",
              letterSpacing: "1px",
            }}
          >
            [SIMILAR CASES]
          </h1>
          <div
            style={{
              color: "#a0a0c0",
              fontSize: "12px",
              letterSpacing: "0.5px",
            }}
          >
            Reference: {reference.caseNum} • Station: {reference.stationReported} • Status:{" "}
            {reference.status.toUpperCase()}
          </div>
        </div>

        {/* Public Cases */}
        <div
          style={{
            animation: isLoaded ? "slideInUp 0.8s ease-out 0.1s both" : "none",
          }}
        >
          <h2
            style={{
              color: "#00c851",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            [COMPLETED - PUBLIC]
          </h2>

          {recommendations.public.length ? (
            <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
              {recommendations.public.map((c, idx) => (
                <div
                  key={c._id}
                  style={{
                    background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
                    border: "1px solid rgba(0, 200, 81, 0.3)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    animation: isLoaded ? `slideInLeft 0.6s ease-out ${idx * 0.05}s both` : "none",
                  }}
                >
                  <strong style={{ color: "#64c8ff", fontSize: "12px" }}>{c.caseNum}</strong>
                  <p
                    style={{
                      color: "#a0a0c0",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                      lineHeight: "1.5",
                    }}
                  >
                    {c.description?.slice(0, 100)}...
                  </p>
                  <small style={{ color: "#6a6a8a", fontSize: "11px" }}>Station: {c.stationReported}</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#6a6a8a", fontSize: "12px", marginBottom: "28px" }}>No completed public cases found.</p>
          )}
        </div>

        {/* Private Cases */}
        <div
          style={{
            animation: isLoaded ? "slideInUp 0.8s ease-out 0.2s both" : "none",
          }}
        >
          <h2
            style={{
              color: "#ffbb33",
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            [PENDING - SAME STATION]
          </h2>

          {recommendations.private.length ? (
            <div style={{ display: "grid", gap: "10px" }}>
              {recommendations.private.map((c, idx) => (
                <div
                  key={c._id}
                  style={{
                    background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
                    border: "1px solid rgba(255, 187, 51, 0.3)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    animation: isLoaded ? `slideInLeft 0.6s ease-out ${idx * 0.05}s both` : "none",
                  }}
                >
                  <strong style={{ color: "#64c8ff", fontSize: "12px" }}>{c.caseNum}</strong>
                  <p
                    style={{
                      color: "#a0a0c0",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                      lineHeight: "1.5",
                    }}
                  >
                    {c.description?.slice(0, 100)}...
                  </p>
                  <small style={{ color: "#6a6a8a", fontSize: "11px" }}>Station: {c.stationReported}</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#6a6a8a", fontSize: "12px" }}>No related pending cases in your station.</p>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "28px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #6432ff 0%, #3d1f99 100%)",
            color: "#e0e0ff",
            border: "2px solid rgba(100, 50, 255, 0.6)",
            borderRadius: "4px",
            fontWeight: "600",
            fontSize: "12px",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = "0 0 20px rgba(100, 50, 255, 0.5)"
            e.target.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = "none"
            e.target.style.transform = "translateY(0)"
          }}
        >
          Back
        </button>
      </div>
    </div>
  )
}
