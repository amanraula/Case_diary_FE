import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";

export default function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/");
      return;
    }
    api
      .post("/2fa/generate", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setQrCode(res.data.qrCode))
      .catch(() => setError("Failed to generate QR code"));
  }, [navigate]);

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      await api.post("/2fa/verify", { token: otp }, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ 2FA enabled successfully!");
      navigate("/police-dashboard");
    } catch {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3>Enable Google Authenticator</h3>
        {qrCode && <img src={qrCode} alt="QR Code" width={200} height={200} />}
        <p>Scan this QR using Google Authenticator and enter the 6-digit code below:</p>
        <form onSubmit={verifyOtp}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <br />
          <button className="submit-btn">Verify</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
