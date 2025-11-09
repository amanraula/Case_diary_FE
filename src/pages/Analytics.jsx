"use client"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import { useNavigate } from "react-router-dom"

const kpis = {
  totalFIRs: 12458,
  openCases: 3421,
  avgResponseHrs: 2.6,
  evidenceItems: 8932,
}

const districtShare = [
  { name: "Bhubaneswar", value: 2200 },
  { name: "Cuttack", value: 1800 },
  { name: "Rourkela", value: 1400 },
  { name: "Puri", value: 900 },
  { name: "Sambalpur", value: 600 },
]

const COLORS = ["#64c8ff", "#4a9fd8", "#3a7db0", "#2a5b88", "#1a3960"]

const monthlyTrend = [
  { month: "Jan", cases: 980 },
  { month: "Feb", cases: 1020 },
  { month: "Mar", cases: 1180 },
  { month: "Apr", cases: 1250 },
  { month: "May", cases: 1350 },
  { month: "Jun", cases: 1420 },
  { month: "Jul", cases: 1390 },
  { month: "Aug", cases: 1480 },
  { month: "Sep", cases: 1310 },
  { month: "Oct", cases: 1270 },
  { month: "Nov", cases: 1210 },
  { month: "Dec", cases: 1188 },
]

const evidenceByType = [
  { type: "Documents", count: 3200 },
  { type: "Images", count: 2800 },
  { type: "Videos", count: 1700 },
  { type: "Audio", count: 1232 },
]

export default function OdishaPoliceAnalytics() {
  const navigate = useNavigate()

  return (
    <div
      className="page-container"
      style={{
        animation: "fadeIn 0.8s ease-in",
      }}
    >
      <div className="content-wrapper">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            animation: "slideInDown 0.6s ease-out",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "36px",
                color: "#64c8ff",
                textShadow: "0 0 15px rgba(100, 200, 255, 0.5)",
                letterSpacing: "2px",
              }}
            >
              [ANALYTICS CENTER]
            </h1>
            <div className="guiding-cue">
              <div className="pulse-dot"></div>
              <span>FIRs, Case Trends, Evidence & Performance Metrics</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/police-dashboard")}
            className="cyber-button"
            style={{ animation: "slideInRight 0.6s ease-out" }}
          >
            [BACK]
          </button>
        </div>

        {/* KPI Cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {[
            { label: "Total FIRs", value: kpis.totalFIRs.toLocaleString(), delay: "0.1s" },
            { label: "Open Cases", value: kpis.openCases.toLocaleString(), delay: "0.2s" },
            { label: "Avg Response (hrs)", value: kpis.avgResponseHrs, delay: "0.3s" },
            { label: "Evidence Items", value: kpis.evidenceItems.toLocaleString(), delay: "0.4s" },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="metallic-box"
              style={{
                animation: `slideInUp 0.6s ease-out`,
                animationDelay: kpi.delay,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#a0a0ff",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                }}
              >
                [{kpi.label.toUpperCase()}]
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#64c8ff",
                  marginBottom: "8px",
                }}
              >
                {kpi.value}
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Pie Chart - District Share */}
          <div
            className="metallic-box"
            style={{
              animation: "slideInLeft 0.8s ease-out",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                color: "#64c8ff",
                marginBottom: "20px",
                letterSpacing: "1px",
              }}
            >
              [CASES BY DISTRICT]
            </h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={districtShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {districtShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{
                      background: "rgba(10, 10, 10, 0.95)",
                      border: "1px solid rgba(100, 200, 255, 0.3)",
                      borderRadius: "3px",
                    }}
                    contentStyle={{
                      color: "#64c8ff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {districtShare.map((d, i) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      color: "#a0a0ff",
                    }}
                  >
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        background: COLORS[i % COLORS.length],
                        borderRadius: "2px",
                        boxShadow: `0 0 6px ${COLORS[i % COLORS.length]}`,
                      }}
                    />
                    <span>
                      {d.name} — {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line Chart - Monthly Trend */}
          <div
            className="metallic-box"
            style={{
              animation: "slideInRight 0.8s ease-out",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                color: "#64c8ff",
                marginBottom: "20px",
                letterSpacing: "1px",
              }}
            >
              [MONTHLY CASE TREND]
            </h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                  <XAxis dataKey="month" stroke="#64c8ff" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64c8ff" style={{ fontSize: "12px" }} />
                  <Tooltip
                    wrapperStyle={{
                      background: "rgba(10, 10, 10, 0.95)",
                      border: "1px solid rgba(100, 200, 255, 0.3)",
                      borderRadius: "3px",
                    }}
                    contentStyle={{
                      color: "#64c8ff",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#64c8ff"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#64c8ff", strokeWidth: 2, stroke: "#1a0a3d" }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Bar Chart - Evidence Breakdown */}
        <section>
          <div
            className="metallic-box"
            style={{
              animation: "slideInUp 0.8s ease-out",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                color: "#64c8ff",
                marginBottom: "20px",
                letterSpacing: "1px",
              }}
            >
              [EVIDENCE UPLOADS BY TYPE]
            </h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evidenceByType} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                  <XAxis type="number" stroke="#64c8ff" style={{ fontSize: "12px" }} />
                  <YAxis dataKey="type" type="category" stroke="#64c8ff" style={{ fontSize: "12px" }} width={90} />
                  <Tooltip
                    wrapperStyle={{
                      background: "rgba(10, 10, 10, 0.95)",
                      border: "1px solid rgba(100, 200, 255, 0.3)",
                      borderRadius: "3px",
                    }}
                    contentStyle={{
                      color: "#64c8ff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 4, 4]} fill="#64c8ff" isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: "40px",
            padding: "20px 0",
            borderTop: "1px solid rgba(100, 200, 255, 0.2)",
            color: "#a0a0ff",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            Last updated: <span style={{ color: "#64c8ff", fontWeight: "bold" }}>2025-11-09</span>
          </div>
          <div style={{ fontSize: "11px", color: "#666688" }}>
            [SYSTEM] Data shown is hardcoded sample data for the Odisha Police analytics prototype.
          </div>
        </footer>
      </div>
    </div>
  )
}
