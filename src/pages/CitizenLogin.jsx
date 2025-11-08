import Header from "../components/Header";
import { useState } from "react";

export default function CitizenLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  function sendOtp(e) {
    e.preventDefault();
    setStep(2);
    alert("OTP sent successfully (dummy)");
  }

  function verifyOtp(e) {
    e.preventDefault();

    const user = { phone };

    localStorage.setItem("loggedCitizen", JSON.stringify(user));

    window.location.href = "/citizen-dashboard";
  }

  return (
    <div>
      <Header />

      <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Citizen Login</h2>

        {step === 1 && (
          <form onSubmit={sendOtp}>
            <label>Phone Number</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <label>Enter OTP</label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">Verify</button>
          </form>
        )}
      </div>

      <style>{`
        input {
          width: 100%;
          padding: 12px;
          margin: 8px 0 20px 0;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background-color: #FEC20C;
          color: black;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}