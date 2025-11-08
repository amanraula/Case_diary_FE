"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import "./globals.css"

export default function CitizenLogin() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  function sendOtp(e) {
    e.preventDefault()
    setStep(2)
  }

  function verifyOtp(e) {
    e.preventDefault()
    const user = { phone }
    localStorage.setItem("loggedCitizen", JSON.stringify(user))
    window.location.href = "/citizen-dashboard"
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
          left: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(100, 50, 255, 0.1), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

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
              [CITIZEN ACCESS]
            </div>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Public Portal Verification
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={step === 1 ? sendOtp : verifyOtp}
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "28px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              animation: isLoaded ? "slideInDown 0.6s ease-out 0.2s both" : "none",
            }}
          >
            {step === 1 ? (
              <>
                {/* Step 1: Phone Number */}
                <div style={{ marginBottom: "24px" }}>
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
                    Phone Number
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="+91 Enter phone number"
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
                  Send OTP
                </button>
              </>
            ) : (
              <>
                {/* Step 2: OTP Verification */}
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "12px",
                    background: "rgba(100, 200, 255, 0.1)",
                    border: "1px solid rgba(100, 200, 255, 0.3)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#64c8ff",
                    textAlign: "center",
                    animation: "slideInDown 0.4s ease-out",
                  }}
                >
                  OTP sent to {phone}
                </div>

                <div style={{ marginBottom: "24px" }}>
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
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "rgba(10, 10, 30, 0.8)",
                      border: "1px solid rgba(100, 50, 255, 0.4)",
                      borderRadius: "4px",
                      color: "#e0e0ff",
                      fontSize: "18px",
                      letterSpacing: "4px",
                      transition: "all 0.3s ease",
                      textAlign: "center",
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
                    marginBottom: "12px",
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
                  Verify Access
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "transparent",
                    color: "#a0a0c0",
                    border: "1px solid rgba(100, 50, 255, 0.3)",
                    borderRadius: "4px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(100, 200, 255, 0.6)"
                    e.target.style.color = "#64c8ff"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(100, 50, 255, 0.3)"
                    e.target.style.color = "#a0a0c0"
                  }}
                >
                  Back
                </button>
              </>
            )}
          </form>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              color: "#6a6a8a",
              fontSize: "11px",
              letterSpacing: "0.5px",
            }}
          >
            Secure OTP verification system
          </div>
        </div>
      </div>
    </div>
  )
}
