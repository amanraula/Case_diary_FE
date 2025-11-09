"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import policeLogo from "../assets/police_logo.png" // Imported police logo
import api from "../api"
import "./globals.css"

export default function PoliceDashboard() {
  const officer = JSON.parse(localStorage.getItem("officer"))
  const token = localStorage.getItem("jwt")
  const navigate = useNavigate()

  // Merged State (Calendar, Events, Cases)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState([]) // Backend events
  const [newEvent, setNewEvent] = useState("")
  const [privacy, setPrivacy] = useState("private")
  const [view, setView] = useState("cases") // Default view is Case list
  const [activeCase, setActiveCase] = useState(null)
  const [cases, setCases] = useState([])
  const [createForm, setCreateForm] = useState({
    caseNum: "",
    description: "",
    stationReported: officer?.station || "",
    status: "pending",
  })
  // === file attachments state ===
const [caseFiles, setCaseFiles] = useState([]);   // files for active case
const [uploading, setUploading] = useState(false);

// fetch files for a case when activeCase changes
useEffect(() => {
  const fetchFiles = async () => {
    if (!activeCase?.caseNum) return;
    try {
      const res = await api.get(`/cases/${encodeURIComponent(activeCase.caseNum)}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // expected res.data.files = []
      setCaseFiles(res.data.files || []);
    } catch (err) {
      console.error("Failed to load case files:", err);
      setCaseFiles([]);
    }
  };
  fetchFiles();
}, [activeCase, token]);

// upload files
const handleFileUpload = async (files) => {
  if (!activeCase) return alert("Open a case first");
  if (!files?.length) return;
  try {
    setUploading(true);
    const form = new FormData();
    // backend expects field name 'files' (important)
    for (let i = 0; i < files.length; i++) form.append("files", files[i]);

    const res = await api.post(
      `/cases/${encodeURIComponent(activeCase.caseNum)}/upload`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // axios will set Content-Type with boundary automatically,
          // but setting it is okay. Either way server must accept multipart.
          "Content-Type": "multipart/form-data",
        },
    	}
    );

    // backend should return updated files & updates
    if (res.data.files) setCaseFiles((prev) => [...prev, ...res.data.files]);
    if (res.data.updates) {
      setActiveCase((ac) => ({ ...ac, updates: res.data.updates || [], newUpdate: "" }));
      setCases((prev) => prev.map((c) => (c._id === activeCase._id ? { ...c, updates: res.data.updates } : c)));
    }

    alert("Files uploaded");
  } catch (err) {
    console.error("Upload error:", err);
    alert(err.response?.data?.message || "Upload failed");
  } finally {
    setUploading(false);
  }
};

// delete a file
const handleDeleteFile = async (fileId, filename) => {
  if (!activeCase) return;
  if (!confirm(`Delete file "${filename}"?`)) return;
  try {
    const res = await api.delete(
      `/cases/${encodeURIComponent(activeCase.caseNum)}/files/${fileId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // update UI: files and updates come from server
    setCaseFiles((prev) => prev.filter((f) => f._id !== fileId));
    if (res.data.updates) {
      setActiveCase((ac) => ({ ...ac, updates: res.data.updates || [] }));
      setCases((prev) => prev.map((c) => (c._id === activeCase._id ? { ...c, updates: res.data.updates } : c)));
    }

    alert("File deleted");
  } catch (err) {
    console.error("Delete file error:", err);
    alert(err.response?.data?.message || "Delete failed");
  }
};

// download file (opens new tab)
const handleDownloadFile = (file) => {
  // backend should expose a GET /cases/:caseNum/files/:fileId/download or direct file URL in file.url
  // we'll attempt file.url first, else try /download endpoint
  if (file.url) {
    window.open(file.url, "_blank");
    return;
  }
  const url = `/cases/${encodeURIComponent(activeCase.caseNum)}/files/${file._id}/download`;
  // open with full api base
  window.open(api.defaults.baseURL + url, "_blank");
};


  // ✅ Fetch cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const filtered = res.data.data.filter(
          (c) => c.stationReported === officer.station
        )
        setCases(filtered)
      } catch (err) {
        console.error("Error loading cases:", err)
      }
    }
    if (token && officer) fetchCases()
  }, [token, officer])

  // ✅ Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEvents(res.data.data)
      } catch (err) {
        console.error("Failed to load schedules:", err)
      }
    }
    if (token) fetchSchedules()
  }, [token])

  // ✅ Add new event
  const handleAddEvent = async () => {
    if (!newEvent.trim()) return
    try {
      const res = await api.post(
        "/schedules",
        { title: newEvent, date: selectedDate, privacy },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEvents([...events, res.data.schedule])
      setNewEvent("")
    } catch (err) {
      console.error("Error adding schedule:", err)
      alert(err.response?.data?.message || "Failed to save event.")
    }
  }

  // ✅ Delete event
  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents(events.filter((e) => e._id !== id))
    } catch (err) {
      console.error("Error deleting schedule:", err)
      alert(err.response?.data?.message || "Failed to delete event.")
    }
  }

  // ✅ Filter events for selected day
  const dailyEvents = events.filter(
    (ev) => new Date(ev.date).toDateString() === selectedDate.toDateString()
  )

  // ✅ Create case
  const handleCreateCase = async () => {
    try {
      let payload = { ...createForm }
      if (!payload.caseNum.trim()) {
        const rand = Math.floor(100 + Math.random() * 900)
        const year = new Date().getFullYear()
        payload.caseNum = `CAS/${rand}/${year}`
      }
      payload.stationReported = officer.station
      payload.reportedByBadge = officer.badgeNumber
      payload.reportedByRank = officer.rank

      const res = await api.post("/cases", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("✅ Case created successfully!")
      setCases([...cases, res.data.case])
      setView("cases")
    } catch (err) {
      console.error("Error creating case:", err)
      alert(err.response?.data?.message || "Failed to create case.")
    }
  }

  // ✅ Add update
  const handleAddUpdate = async () => {
    if (!activeCase?.newUpdate?.trim()) return
    try {
      const res = await api.post(
        `/cases/${activeCase.caseNum}/updates`,
        {
          description: activeCase.newUpdate,
          updatedBy: officer.badgeNumber || `${officer.rank} ${officer.name}`,
          dateTime: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setActiveCase({
        ...activeCase,
        updates: res.data.updates || [],
        newUpdate: "",
      })

      setCases((prev) =>
        prev.map((c) =>
          c._id === activeCase._id ? { ...c, updates: res.data.updates } : c
        )
      )

      alert("✅ Update added successfully!")
    } catch (err) {
      console.error("Error adding update:", err)
      alert(err.response?.data?.message || "Failed to add update.")
    }
  }

  // ✅ Change status
  const handleStatusChange = async (newStatus) => {
    try {
      const encoded = encodeURIComponent(activeCase.caseNum)
      await api.patch(
        `/cases/${encoded}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setActiveCase({ ...activeCase, status: newStatus })
      setCases((prev) =>
        prev.map((c) =>
          c.caseNum === activeCase.caseNum ? { ...c, status: newStatus } : c
        )
      )
      alert(`✅ Status changed to ${newStatus}`)
    } catch (err) {
      console.error("Error changing status:", err)
      alert(err.response?.data?.message || "Failed to change status.")
    }
  }

  // ✅ Get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#00c851"
      case "pending":
        return "#ffbb33"
      case "aborted":
        return "#ff4444"
      default:
        return "#999"
    }
  }

  // Style helpers for the dark theme
  const darkInputStyle = {
    width: "100%",
    padding: "10px",
    background: "rgba(10,10,30,0.8)",
    border: "1px solid rgba(100,50,255,0.4)",
    borderRadius: "8px",
    color: "#e0e0ff",
    marginBottom: "10px",
  }

  const darkButtonStyle = {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    textTransform: "uppercase",
    fontSize: "12px",
    transition: "background 0.3s",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #0f0020 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER (Adapted for dark theme) */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
          height: "110px",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <img
          src={policeLogo}
          alt="Logo"
          style={{
            height: "70px",
            width: "70px",
            objectFit: "contain",
            marginRight: "20px",
            filter: "brightness(1.2)",
          }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#64c8ff" }}>
            COMMAND CENTER - <span style={{ color: "#FFD85A" }}>{officer?.name}</span>
          </h1>
          <p style={{ margin: 0, fontSize: "16px", color: "#a0a0c0" }}>
            {officer?.rank} — {officer?.station}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        {/* Left sidebar with calendar and events (Calendar matched to body) */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
            border: "1px solid rgba(100, 50, 255, 0.3)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <h3 style={{ color: "#64c8ff", marginBottom: "10px", textTransform: "uppercase" }}>[Calendar]</h3>

          {/* Calendar Component */}
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            // Highlight dates with tasks
            tileClassName={({ date }) => {
              const hasEvent = events.some(
                (ev) => new Date(ev.date).toDateString() === date.toDateString()
              )
              return hasEvent ? "calendar-highlight" : ""
            }}
          />

          {/* Injected CSS to match UI and highlight dates */}
          <style>
  {`
    .react-calendar {
      background: linear-gradient(135deg, #1a0033 0%, #0a001a 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 8px;
    }
    .react-calendar__tile--active {
      background: rgba(100, 50, 255, 0.5) !important;
      color: #fff !important;
    }
    .calendar-highlight {
      background: rgba(150, 100, 255, 0.4) !important;
      border-radius: 50%;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
      color: #b8aaff;
    }
    .react-calendar__navigation button {
      color: #ffffff;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: rgba(100, 50, 255, 0.3);
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: rgba(100, 50, 255, 0.2);
    }
    .react-calendar__tile--now {
      background: rgba(255, 216, 90, 0.3);
      border-radius: 50%;
    }
  `}
</style>



          <h4 style={{ color: "#64c8ff", marginTop: "15px", fontSize: "13px" }}>
            Events on {selectedDate.toDateString()}
          </h4>

          <div style={{ maxHeight: "160px", overflowY: "auto", marginBottom: "10px" }}>
            {dailyEvents.length ? (
              dailyEvents.map((ev) => (
                <div
                  key={ev._id}
                  style={{
                    padding: "8px",
                    marginBottom: "6px",
                    borderRadius: "4px",
                    background: ev.privacy === "private" ? "rgba(100,50,255,0.15)" : "rgba(100,200,255,0.15)",
                    border: `1px solid ${
                      ev.privacy === "private" ? "rgba(100,50,255,0.3)" : "rgba(100,200,255,0.3)"
                    }`,
                    fontSize: "12px",
                    color: ev.privacy === "private" ? "#e0e0ff" : "#a0f0a0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{ev.title}</span>
                  <button
                    onClick={() => handleDeleteEvent(ev._id)}
                    style={{
                      background: "rgba(255,80,100,0.2)",
                      border: "1px solid rgba(255,80,100,0.4)",
                      color: "#ff6b7a",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#777", fontSize: "11px" }}>No events</p>
            )}
          </div>

          <textarea
            placeholder="Add event..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            style={{
              width: "100%",
              height: "60px",
              padding: "8px",
              background: "rgba(10,10,30,0.8)",
              border: "1px solid rgba(100,50,255,0.4)",
              borderRadius: "4px",
              color: "#e0e0ff",
              fontSize: "11px",
              marginBottom: "8px",
            }}
          />

          <div style={{ display: "flex", gap: "15px", fontSize: "11px", marginBottom: "8px", color: "#a0a0c0" }}>
            <label>
              <input type="radio" value="private" checked={privacy === "private"} onChange={(e) => setPrivacy(e.target.value)} /> Private
            </label>
            <label>
              <input type="radio" value="public" checked={privacy === "public"} onChange={(e) => setPrivacy(e.target.value)} /> Public
            </label>
          </div>

          <button
            onClick={handleAddEvent}
            style={{
              width: "100%",
              padding: "8px",
              background: "linear-gradient(135deg, #6432ff 0%, #3d1f99 100%)",
              color: "#e0e0ff",
              border: "1px solid rgba(100,50,255,0.6)",
              borderRadius: "4px",
              fontWeight: "600",
              fontSize: "11px",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Save Event
          </button>
        </div>

        {/* Right side — Cases Dashboard */}
        <div style={{ flex: 1, padding: "0" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, #1a0a3d 0%, #2d1a5c 50%, #1a0a3d 100%)",
              border: "1px solid rgba(100, 50, 255, 0.3)",
              borderRadius: "8px",
              padding: "25px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              color: "#e0e0ff",
            }}
          >
            {/* CASES LIST */}
            {view === "cases" && (
              <>
                <h2 style={{ color: "#FFD85A" }}>Assigned Cases</h2>
                {cases.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      setActiveCase(c)
                      setView("details")
                    }}
                    style={{
                      padding: "18px",
                      background: "rgba(10,10,30,0.8)",
                      borderRadius: "10px",
                      marginBottom: "15px",
                      border: "1px solid rgba(100,50,255,0.4)",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 6px 15px rgba(100,50,255,0.2)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <div>
                      <strong style={{ color: "#64c8ff" }}>{c.caseNum}</strong>
                      <p style={{ color: "#a0a0c0", margin: 0, fontSize: "14px" }}>
                        {c.description?.slice(0, 50)}...
                      </p>
                    </div>
                    <span
                      style={{
                        background: getStatusColor(c.status),
                        color: "black",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "700",
                        textTransform: "capitalize",
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* CASE DETAILS */}
            {view === "details" && activeCase && (
            <div>
            <button
              onClick={() => setView("cases")}
              style={{
                ...darkButtonStyle,
                marginBottom: "20px",
                background: "#0A2A66",
                color: "white",
              }}
            >
              ← Back to Cases
            </button>

            <h2 style={{ color: "#64c8ff" }}>{activeCase.caseNum}</h2>
            <p>
              <strong style={{ color: "#FFD85A" }}>Status:</strong>{" "}
              <span
                style={{
                  background: getStatusColor(activeCase.status),
                  color: "black",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
            >
                {activeCase.status}
              </span>
            </p>
            <p style={{ color: "#a0a0c0" }}>
              <strong style={{ color: "#FFD85A" }}>Station:</strong>{" "}
              {activeCase.stationReported}
            </p>
            <p style={{ color: "#e0e0ff" }}>{activeCase.description}</p>

            {/* ===== FILES SECTION (NEW) ===== */}
            <div style={{ marginTop: "12px", marginBottom: "18px" }}>
              <h3 style={{ color: "#FFD85A", marginBottom: "8px" }}>Documents</h3>

              {/* Upload control */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="file"
                  id="case-file-input"
                  multiple
                  onChange={(e) => {
                    const f = e.target.files;
                    if (f && f.length) handleFileUpload(f);
                    // reset input so same file can be reselected later
                    e.target.value = null;
                  }}
                  style={{ color: "#e0e0ff" }}
                />
                <button
                  onClick={() => {
                    document.getElementById("case-file-input")?.click();
                  }}
                  style={{
                    ...darkButtonStyle,
                    background: "#6432ff",
                    color: "white",
                    padding: "8px 12px",
                  }}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {/* Files list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {caseFiles?.length ? (
                  caseFiles.map((f) => (
                    <div
                      key={f._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "rgba(10,10,30,0.6)",
                        border: "1px solid rgba(100,50,255,0.2)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: "#111" }}>
                          {/* small icon or filetype letter */}
                          <div style={{ color: "#64c8ff", padding: 6, fontWeight: 700 }}>
                            {f.originalName?.split(".").pop()?.toUpperCase() || "?"}
                          </div>
                      </div>
                      <div>
                        <div style={{ color: "#e0e0ff", fontWeight: 600 }}>{f.originalName || f.filename}</div>
                        <div style={{ color: "#9aa0c6", fontSize: 12 }}>
                          {f.size ? `${Math.round(f.size / 1024)} KB` : (f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : "")}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleDownloadFile(f)}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(100,200,255,0.2)",
                          color: "#64c8ff",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                    >
                      Open
                    </button>

                      <button
                        onClick={() => handleDeleteFile(f._id, f.originalName || f.filename)}
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,80,100,0.2)",
                          color: "#ff6b7a",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#777", fontSize: 13 }}>No documents uploaded.</div>
            )}
          </div>
        </div>
            {/* ===== end files section ===== */}

            <div style={{ marginTop: "20px" }}> {/* Container for Updates and Actions */}
              <h3 style={{ color: "#FFD85A" }}>Case Updates Timeline</h3>
              {activeCase.updates?.length ? (
                [...activeCase.updates].reverse().map((u, i) => (
                  <div
  key={i}
  style={{
    position: "relative",
    marginBottom: "20px",
    padding: "12px 15px",
    background: "rgba(10,10,30,0.7)",
    borderRadius: "10px",
    border: "1px solid rgba(100,50,255,0.4)",
    color: "#e0e0ff",
  }}
>
  {/* Vertical connector line */}
  {i !== activeCase.updates.length - 1 && (
    <div
      style={{
        position: "absolute",
        left: "-15px",
        top: "calc(50% + 6px)",
        width: "2px",
        height: "100%",
        background: "rgba(100,50,255,0.3)",
        zIndex: 0,
      }}
    ></div>
  )}

  {/* Bubble */}
  <div
    style={{
      position: "absolute",
      left: "-20px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background:
        i === 0
          ? "linear-gradient(135deg, #FFD85A, #FF8C32)"
          : "linear-gradient(135deg, #6432ff, #3d1f99)",
      boxShadow: "0 0 6px rgba(100,50,255,0.6)",
      zIndex: 1,
    }}
  ></div>

  {/* Text content */}
  <div style={{ fontSize: "14px" }}>
    <div style={{ fontWeight: "600", color: "#FFD85A" }}>
      {new Date(u.dateTime).toLocaleString()}
    </div>
    <div style={{ marginTop: "4px", color: "#e0e0ff" }}>
      {u.description}
    </div>
    <div style={{ marginTop: "3px", fontSize: "13px", color: "#64c8ff" }}>
      — {u.updatedBy}
    </div>
  </div>
</div>

              ))
            ) : (
              <p style={{ color: "#777", fontSize: "13px" }}>No updates yet.</p>
            )}
          </div>
                <h3 style={{ color: "#FFD85A" }}>Add Update</h3>
                <textarea
                  value={activeCase.newUpdate || ""}
                  onChange={(e) =>
                    setActiveCase({ ...activeCase, newUpdate: e.target.value })
                  }
                  placeholder="Write update..."
                  style={{
                    ...darkInputStyle,
                    height: "80px",
                  }}
                ></textarea>

                <button
                  onClick={handleAddUpdate}
                  style={{
                    ...darkButtonStyle,
                    width: "100%",
                    marginTop: "15px",
                    padding: "12px",
                    background: "#6432ff",
                    color: "white",
                    marginBottom: "15px",
                  }}
                >
                  Save Update
                </button>
                <button
                  onClick={() => navigate(`/cases/recommend/${activeCase.caseNum}`)}
                  style={{
                    ...darkButtonStyle,
                    background: "#FFD85A",
                    color: "black",
                    width: "100%",
                    padding: "12px",
                  }}
                >
                  View Related Cases
                </button>
              </div>
            )}

            {/* CREATE CASE */}
            {view === "create" && (
              <div>
                <button
                  onClick={() => setView("cases")}
                  style={{
                    ...darkButtonStyle,
                    marginBottom: "20px",
                    background: "#0A2A66",
                    color: "white",
                  }}
                >
                  ← Back
                </button>

                <h2 style={{ color: "#FFD85A" }}>Create New Case</h2>

                <label style={{ color: "#a0a0c0", fontSize: "14px" }}>Case Number (auto if empty)</label>
                <input
                  value={createForm.caseNum}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, caseNum: e.target.value })
                  }
                  placeholder="e.g. CAS/12/35"
                  style={darkInputStyle}
                />

                <label style={{ color: "#a0a0c0", fontSize: "14px" }}>Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter case description"
                  style={{ ...darkInputStyle, height: "100px" }}
                ></textarea>

                <label style={{ color: "#a0a0c0", fontSize: "14px" }}>Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, status: e.target.value })
                  }
                  style={darkInputStyle}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="aborted">Aborted</option>
                </select>

                <label style={{ color: "#a0a0c0", fontSize: "14px" }}>Station Reported</label>
                <input
                  value={createForm.stationReported}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      stationReported: e.target.value,
                    })
                  }
                  placeholder="Station name"
                  style={darkInputStyle}
                  readOnly
                />

                <button
                  onClick={handleCreateCase}
                  style={{
                    ...darkButtonStyle,
                    width: "100%",
                    marginTop: "20px",
                    padding: "12px",
                    background: "#6432ff",
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  Create Case
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setView("create")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#FFD85A",
          color: "black",
          borderRadius: "50%",
          height: "70px",
          width: "70px",
          border: "none",
          fontSize: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          zIndex: 100,
        }}
      >
        +
      </button>
    </div>
  )
}