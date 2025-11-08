import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function PoliceLogin() {
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { badgeNumber, password });

      // Success: Logged in directly
      const { token, officer } = res.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("officer", JSON.stringify(officer));

      if (officer.is2FAEnabled) {
        navigate("/2fa-login", { state: { badgeNumber, password } });
      } else {
        navigate("/2fa-setup", { state: { badgeNumber } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (err.response?.status === 403 && msg.includes("2FA")) {
        navigate("/2fa-login", { state: { badgeNumber, password } });
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Police Officer Login</h2>
        {error && (
          <p style={{ backgroundColor: "#ffdddd", padding: "10px", borderRadius: "8px", color: "#b00000", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label>Badge Number</label>
          <input
            type="text"
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            placeholder="Enter your Badge Number"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>

      <style>{`
        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0 20px 0;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background-color: #0A2A66;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
