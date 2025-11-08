"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import Header from "../components/Header"
import "./globals.css"

export default function PoliceLogin() {
  const [badgeNumber, setBadgeNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await api.post("/auth/login", { badgeNumber, password })
      const { token, officer } = res.data
      localStorage.setItem("jwt", token)
      localStorage.setItem("officer", JSON.stringify(officer))

      if (officer.is2FAEnabled) {
        navigate("/2fa-login", { state: { badgeNumber, password } })
      } else {
        navigate("/2fa-setup", { state: { badgeNumber } })
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed"
      if (err.response?.status === 403 && msg.includes("2FA")) {
        navigate("/2fa-login", { state: { badgeNumber, password } })
      } else {
        setError(msg)
      }
    } finally {
      setIsSubmitting(false)
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
      {/* Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(100, 50, 255, 0.1), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Header />

      {/* Main Login Container */}
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
            maxWidth: "420px",
            animation: isLoaded ? "slideInUp 0.8s ease-out" : "none",
          }}
        >
          {/* Title */}
          <div
            style={{
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                letterSpacing: "2px",
                color: "#64c8ff",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              [OFFICER LOGIN]
            </div>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Secure Badge Verification
            </p>
          </div>

          {/* Error Box */}
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
              Error: {error}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "28px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Badge Number Field */}
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
                Badge Number
              </div>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="Enter your badge number"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(10, 10, 30, 0.8)",
                  border: "1px solid rgba(100, 50, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#e0e0ff",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(100, 200, 255, 0.8)"
                  e.target.style.boxShadow =
                    "0 0 15px rgba(100, 200, 255, 0.3), inset 0 0 10px rgba(100, 200, 255, 0.05)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(100, 50, 255, 0.4)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "28px" }}>
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
                    animationDelay: "0.2s",
                  }}
                />
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(10, 10, 30, 0.8)",
                  border: "1px solid rgba(100, 50, 255, 0.4)",
                  borderRadius: "4px",
                  color: "#e0e0ff",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(100, 200, 255, 0.8)"
                  e.target.style.boxShadow =
                    "0 0 15px rgba(100, 200, 255, 0.3), inset 0 0 10px rgba(100, 200, 255, 0.05)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(100, 50, 255, 0.4)"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                background: isSubmitting
                  ? "linear-gradient(135deg, #4a2280 0%, #2d1550 100%)"
                  : "linear-gradient(135deg, #6432ff 0%, #3d1f99 100%)",
                color: "#e0e0ff",
                border: "2px solid rgba(100, 50, 255, 0.6)",
                borderRadius: "4px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(100, 50, 255, 0.3)",
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.boxShadow = "0 0 30px rgba(100, 50, 255, 0.7)"
                  e.target.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 0 20px rgba(100, 50, 255, 0.3)"
                e.target.style.transform = "translateY(0)"
              }}
            >
              {isSubmitting ? "Verifying..." : "Access System"}
            </button>
          </form>

          {/* Footer Note */}
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6a6a8a",
              fontSize: "11px",
              letterSpacing: "0.5px",
            }}
          >
            Multi-factor authentication enabled
          </div>
        </div>
      </div>
    </div>
  )
}
