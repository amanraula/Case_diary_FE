"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "../api"
import Header from "../components/Header"
import "./globals.css"

export default function TwoFactorLogin() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { badgeNumber, password } = location.state || {}

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/auth/login", {
        badgeNumber,
        password,
        token: otp,
      })
      const { token, officer } = res.data
      localStorage.setItem("jwt", token)
      localStorage.setItem("officer", JSON.stringify(officer))
      navigate("/police-dashboard")
    } catch {
      setError("Invalid verification code. Try again.")
    }
  }

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
      <Header />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            animation: isLoaded ? "slideInUp 0.8s ease-out" : "none",
          }}
        >
          {/* Title */}
          <div
            style={{
              marginBottom: "28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                letterSpacing: "2px",
                color: "#64c8ff",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              [2FA VERIFICATION]
            </div>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              Enter your authenticator code
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(255, 80, 100, 0.15)",
                border: "1px solid rgba(255, 80, 100, 0.4)",
                borderRadius: "4px",
                padding: "12px 14px",
                marginBottom: "20px",
                color: "#ff6b7a",
                fontSize: "13px",
                animation: "slideInDown 0.4s ease-out",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleVerify}
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "28px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64c8ff",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    background: "#64c8ff",
                    borderRadius: "50%",
                    animation: "pulse-glow 2s ease-in-out infinite",
                  }}
                />
                Google Authenticator Code
              </div>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength="6"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "rgba(10, 10, 30, 0.8)",
                  border: "1px solid rgba(100, 50, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#e0e0ff",
                  fontSize: "24px",
                  letterSpacing: "6px",
                  textAlign: "center",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  fontFamily: "monospace",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(100, 200, 255, 0.8)"
                  e.target.style.boxShadow = "0 0 15px rgba(100, 200, 255, 0.3)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(100, 50, 255, 0.4)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #6432ff 0%, #3d1f99 100%)",
                color: "#e0e0ff",
                border: "2px solid rgba(100, 50, 255, 0.6)",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(100, 50, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 0 30px rgba(100, 50, 255, 0.7)"
                e.target.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 0 20px rgba(100, 50, 255, 0.3)"
                e.target.style.transform = "translateY(0)"
              }}
            >
              Verify Code
            </button>
          </form>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "rgba(100, 200, 255, 0.08)",
              border: "1px solid rgba(100, 200, 255, 0.2)",
              borderRadius: "4px",
              fontSize: "11px",
              color: "#a0a0c0",
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            Code expires in 30 seconds
          </div>
        </div>
      </div>
    </div>
  )
}
