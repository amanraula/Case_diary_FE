import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import policeLogo from "../assets/police_logo.png";

export default function CaseRecommendations() {
  const { caseNum } = useParams();
  const token = localStorage.getItem("jwt");
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get(`/cases/recommend/${caseNum}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error loading recommendations:", err);
      }
    };
    fetchRecommendations();
  }, [caseNum, token]);

  if (!data)
    return <p style={{ padding: 30 }}>Loading recommendations...</p>;

  const { reference, recommendations } = data;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6F9",
        padding: "20px 40px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#0A2A66",
          padding: "15px 25px",
          color: "white",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <img
          src={policeLogo}
          alt="logo"
          style={{ width: "60px", marginRight: "20px" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "26px" }}>
            Similar Cases for {reference.caseNum}
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Station: {reference.stationReported} | Status: {reference.status}
          </p>
        </div>
      </div>

      {/* PUBLIC CASES */}
      <h2 style={{ color: "#00C851" }}>Completed (Public)</h2>
      {recommendations.public.length ? (
        recommendations.public.map((c) => (
          <div
            key={c._id}
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
            }}
          >
            <strong>{c.caseNum}</strong>
            <p style={{ margin: "5px 0" }}>{c.description.slice(0, 100)}...</p>
            <small>Station: {c.stationReported}</small>
          </div>
        ))
      ) : (
        <p>No completed cases found.</p>
      )}

      {/* PRIVATE CASES */}
      <h2 style={{ color: "#FFBB33", marginTop: "30px" }}>
        Pending (Private - Same Station)
      </h2>
      {recommendations.private.length ? (
        recommendations.private.map((c) => (
          <div
            key={c._id}
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
            }}
          >
            <strong>{c.caseNum}</strong>
            <p style={{ margin: "5px 0" }}>{c.description.slice(0, 100)}...</p>
            <small>Station: {c.stationReported}</small>
          </div>
        ))
      ) : (
        <p>No related pending cases in your station.</p>
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "#0A2A66",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
