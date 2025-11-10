"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./globals.css"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Home() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0f0020 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background geometric shapes */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(100, 50, 255, 0.08), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(100, 150, 255, 0.06), transparent)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <Header />

      {/* Main Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            animation: isLoaded ? "slideInDown 0.8s ease-out" : "none",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #64c8ff 0%, #6432ff 50%, #64c8ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "16px",
              letterSpacing: "1px",
            }}
          >
            SECURE ACCESS CONTROL
          </h1>
          <p
            style={{
              color: "#a0a0c0",
              fontSize: "16px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: "500",
            }}
          >
            Integrated Crime Reporting System
          </p>
        </div>

        {/* Login Options */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            width: "100%",
            maxWidth: "600px",
            marginTop: "40px",
          }}
        >
          {/* Police Login Card */}
          <div
            onClick={() => navigate("/police-login")}
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "2px solid rgba(100, 50, 255, 0.4)",
              borderRadius: "8px",
              padding: "32px 24px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: isLoaded ? "slideInLeft 0.8s ease-out 0.1s both" : "none",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(100, 50, 255, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.borderColor = "rgba(100, 200, 255, 0.8)"
              e.currentTarget.style.transform = "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.borderColor = "rgba(100, 50, 255, 0.4)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "12px",
              }}
            >
              {"[OFFICER]"}
            </div>
            <h3
              style={{
                color: "#64c8ff",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Police Access
            </h3>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "0.5px",
              }}
            >
              Badge verification required
            </p>
          </div>

          {/* Citizen Login Card */}
          <div
            onClick={() => navigate("/citizen-login")}
            style={{
              background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "2px solid rgba(100, 50, 255, 0.4)",
              borderRadius: "8px",
              padding: "32px 24px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: isLoaded ? "slideInRight 0.8s ease-out 0.2s both" : "none",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(100, 50, 255, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.borderColor = "rgba(100, 200, 255, 0.8)"
              e.currentTarget.style.transform = "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.borderColor = "rgba(100, 50, 255, 0.4)"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "12px",
              }}
            >
              {"["}CITIZEN{"]"}
            </div>
            <h3
              style={{
                color: "#64c8ff",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              Public Access
            </h3>
            <p
              style={{
                color: "#a0a0c0",
                fontSize: "12px",
                letterSpacing: "0.5px",
              }}
            >
              Phone verification required
            </p>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            gap: "16px",
            width: "100%",
            maxWidth: "600px",
            animation: isLoaded ? "slideInUp 0.8s ease-out 0.3s both" : "none",
          }}
        >
         
          <button
            onClick={() => navigate("/analytics")}
            style={{
              flex: 1,
              padding: "14px",
              background: "rgba(100, 50, 255, 0.15)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "4px",
              color: "#a0a0c0",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(100, 50, 255, 0.3)"
              e.currentTarget.style.borderColor = "rgba(100, 200, 255, 0.6)"
              e.currentTarget.style.color = "#64c8ff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(100, 50, 255, 0.15)"
              e.currentTarget.style.borderColor = "rgba(100, 50, 255, 0.3)"
              e.currentTarget.style.color = "#a0a0c0"
            }}
          >
            Analytics Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
