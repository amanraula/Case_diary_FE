import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";

export default function TwoFactorLogin() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { badgeNumber, password } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        badgeNumber,
        password,
        token: otp,
      });
      const { token, officer } = res.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("officer", JSON.stringify(officer));
      navigate("/police-dashboard");
    } catch {
      setError("Invalid OTP");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h3>Enter Google Authenticator Code</h3>
        <form onSubmit={handleVerify}>
          <input
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <br />
          <button type="submit" className="submit-btn">Verify</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
