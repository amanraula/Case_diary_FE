"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import Header from "../components/Header"
import "./globals.css"

export default function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate("/")
      return
    }
    api
      .post("/2fa/generate", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setQrCode(res.data.qrCode))
      .catch(() => setError("Failed to generate QR code"))
  }, [navigate])

  const verifyOtp = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("jwt")
      await api.post("/2fa/verify", { token: otp }, { headers: { Authorization: `Bearer ${token}` } })
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
            maxWidth: "480px",
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
                fontSize: "22px",
                letterSpacing: "2px",
                color: "#64c8ff",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              [2FA SETUP]
            </div>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              Enable two-factor authentication
            </p>
          </div>

          {/* Main Container */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "28px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Instructions */}
            <div
              style={{
                background: "rgba(100, 200, 255, 0.1)",
                border: "1px solid rgba(100, 200, 255, 0.3)",
                borderRadius: "4px",
                padding: "14px",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#a0a0c0",
                lineHeight: "1.6",
                animation: "slideInDown 0.6s ease-out",
              }}
            >
              <div style={{ fontWeight: "600", color: "#64c8ff", marginBottom: "8px" }}>Instructions:</div>
              1. Open Google Authenticator app
              <br />
              2. Scan the QR code below
              <br />
              3. Enter the 6-digit code
            </div>

            {/* QR Code Section */}
            {qrCode && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  padding: "16px",
                  background: "rgba(10, 10, 30, 0.5)",
                  border: "1px solid rgba(100, 50, 255, 0.2)",
                  borderRadius: "4px",
                  animation: "slideInUp 0.6s ease-out 0.1s both",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64c8ff",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "600",
                  }}
                >
                  [QR Code]
                </div>
                <img
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  style={{
                    width: "200px",
                    height: "200px",
                    background: "white",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid rgba(100, 50, 255, 0.3)",
                  }}
                />
              </div>
            )}

            {error && (
              <div
                style={{
                  background: "rgba(255, 80, 100, 0.15)",
                  border: "1px solid rgba(255, 80, 100, 0.4)",
                  borderRadius: "4px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                  color: "#ff6b7a",
                  fontSize: "13px",
                  animation: "slideInDown 0.4s ease-out",
                }}
              >
                {error}
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={verifyOtp}>
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64c8ff",
                    marginBottom: "6px",
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
                  Verification Code
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
                    padding: "12px 14px",
                    background: "rgba(10, 10, 30, 0.8)",
                    border: "1px solid rgba(100, 50, 255, 0.4)",
                    borderRadius: "4px",
                    color: "#e0e0ff",
                    fontSize: "20px",
                    letterSpacing: "4px",
                    textAlign: "center",
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
                Verify & Enable
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
