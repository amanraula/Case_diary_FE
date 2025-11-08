import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import policeLogo from "../assets/police_logo.png";
import api from "../api";

export default function PoliceDashboard() {
  const officer = JSON.parse(localStorage.getItem("officer"));
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  // --- MERGED: State for backend events/schedules
  const [events, setEvents] = useState([]); // Use array for backend events
  const [newEvent, setNewEvent] = useState("");
  const [privacy, setPrivacy] = useState("private"); // State for privacy from the second component
  // --- END MERGED

  const [view, setView] = useState("cases");
  const [activeCase, setActiveCase] = useState(null);
  const [cases, setCases] = useState([]);
  const [createForm, setCreateForm] = useState({
    caseNum: "",
    description: "",
    stationReported: officer?.station || "",
    status: "pending",
  });

  // ✅ Fetch cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get("/cases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.data.filter(
          (c) => c.stationReported === officer.station
        );
        setCases(filtered);
      } catch (err) {
        console.error("Error loading cases:", err);
      }
    };

    if (token && officer) fetchCases();
  }, [token, officer]);

  // --- MERGED: Load events from DB (Replaces local event state logic)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort the events to ensure consistency if needed, though not strictly required by the prompt
        setEvents(res.data.data); 
      } catch (err) {
        console.error("Failed to load schedules:", err);
      }
    };

    if (token) fetchSchedules();
  }, [token]);
  // --- END MERGED

  // --- MERGED: Add new event to DB (Replaces local event addition)
  const handleAddEvent = async () => {
    if (!newEvent.trim()) return;
    try {
      const res = await api.post(
        "/schedules",
        {
          title: newEvent,
          date: selectedDate,
          privacy,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents([...events, res.data.schedule]);
      setNewEvent("");
    } catch (err) {
      console.error("Error adding schedule:", err);
      alert(err.response?.data?.message || "Failed to save event.");
    }
  };
  // --- END MERGED

  // --- MERGED: Delete event
  const handleDeleteEvent = async (id) => {
    try {
      await api.delete(`/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting schedule:", err);
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };
  // --- END MERGED


  // ✅ Create new case
  const handleCreateCase = async () => {
    try {
      let payload = { ...createForm };
      if (!payload.caseNum.trim()) {
        const rand = Math.floor(100 + Math.random() * 900);
        const year = new Date().getFullYear();
        payload.caseNum = `CAS/${rand}/${year}`;
      }
      payload.stationReported = officer.station;
      payload.reportedByBadge = officer.badgeNumber;
      payload.reportedByRank = officer.rank;

      const res = await api.post("/cases", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Case created successfully!");
      setCases([...cases, res.data.case]);
      setView("cases");
    } catch (err) {
      console.error("Error creating case:", err);
      alert(err.response?.data?.message || "Failed to create case.");
    }
  };

  // ✅ Add update
  const handleAddUpdate = async () => {
    if (!activeCase?.newUpdate?.trim()) return;
    try {
      const res = await api.post(
        `/cases/${activeCase.caseNum}/updates`,
        {
          description: activeCase.newUpdate,
          updatedBy: officer.badgeNumber || `${officer.rank} ${officer.name}`,
          dateTime: new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveCase({
        ...activeCase,
        updates: res.data.updates || [],
        newUpdate: "",
      });

      setCases((prev) =>
        prev.map((c) =>
          c._id === activeCase._id ? { ...c, updates: res.data.updates } : c
        )
      );

      alert("✅ Update added successfully!");
    } catch (err) {
      console.error("Error adding update:", err);
      alert(
        err.response?.data?.message ||
          "Failed to add update. Check server console for details."
      );
    }
  };

  // ✅ Change status locally + backend
  const handleStatusChange = async (newStatus) => {
    try {
      const encoded = encodeURIComponent(activeCase.caseNum); // <-- important
      const res = await api.patch(
        `/cases/${encoded}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveCase({ ...activeCase, status: newStatus });
      setCases((prev) =>
        prev.map((c) =>
          c.caseNum === activeCase.caseNum ? { ...c, status: newStatus } : c
        )
      );
      alert(`✅ Status changed to ${newStatus}`);
    } catch (err) {
      console.error("Error changing status:", err);
      alert(err.response?.data?.message || "Failed to change status.");
    }
  };


  // ✅ Get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#00C851"; // green
      case "pending":
        return "#FFBB33"; // yellow
      case "aborted":
        return "#ff4444"; // red
      default:
        return "#999";
    }
  };
  
  // --- MERGED: Filter events for selected day
  const dailyEvents = events.filter(
    (ev) => new Date(ev.date).toDateString() === selectedDate.toDateString()
  );
  // --- END MERGED

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6F9" }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: "#0A2A66",
          height: "110px",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 25px",
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
          }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "28px" }}>
            Welcome <span style={{ color: "#FFD85A" }}>{officer?.name}</span>
          </h1>
          <p style={{ margin: 0, fontSize: "16px" }}>
            {officer?.rank} — {officer?.station}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex" }}>
        {/* LEFT PANEL (Calendar & Events) */}
        <div
          style={{
            width: "340px",
            background: "white",
            padding: "20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <Calendar onChange={setSelectedDate} value={selectedDate} />
          <h3 style={{ marginTop: "20px" }}>
            Events on {selectedDate.toDateString()}
          </h3>

          {/* --- MODIFIED: Display Merged/Backend Events --- */}
          {dailyEvents.length ? (
            <ul>
              {dailyEvents.map((ev) => (
                <li 
                    key={ev._id}
                    style={{
                        marginBottom: "8px",
                        background: ev.privacy === "private" ? "#eee" : "#d7f9d7",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>{ev.title}</span>
                    <div>
                        <span style={{ fontSize: "12px", color: ev.privacy === "private" ? "gray" : "green", marginRight: "10px" }}>
                            {ev.privacy}
                        </span>
                        <button
                            onClick={() => handleDeleteEvent(ev._id)}
                            style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor: "pointer",
                            }}
                        >
                            X
                        </button>
                    </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events scheduled.</p>
          )}

          <textarea
            placeholder="Write new event..."
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            style={{
              width: "100%",
              height: "70px",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          {/* --- MERGED: Privacy Radio Buttons --- */}
          <div style={{ marginTop: "10px" }}>
            <label>
              <input
                type="radio"
                value="private"
                checked={privacy === "private"}
                onChange={(e) => setPrivacy(e.target.value)}
              />{" "}
              Private
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                value="public"
                checked={privacy === "public"}
                onChange={(e) => setPrivacy(e.target.value)}
              />{" "}
              Public
            </label>
          </div>
          {/* --- END MERGED --- */}

          <button
            onClick={handleAddEvent} // Calls the new backend handler
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              background: "#0A2A66",
              color: "white",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save Event
          </button>
        </div>

        {/* RIGHT PANEL (Cases/Details/Create) */}
        <div style={{ flex: 1, padding: "25px" }}>
          {/* CASES LIST */}
          {view === "cases" && (
            <>
              <h2>Assigned Cases</h2>
              {cases.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setActiveCase(c);
                    setView("details");
                  }}
                  style={{
                    padding: "18px",
                    background: "white",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{c.caseNum}</strong>
                    <p style={{ color: "#333", margin: 0 }}>
                      {c.description?.slice(0, 50)}
                    </p>
                  </div>
                  <span
                    style={{
                      background: getStatusColor(c.status),
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
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
            <div style={{ padding: "10px" }}>
              <button
                onClick={() => setView("cases")}
                style={{
                  marginBottom: "20px",
                  padding: "8px 15px",
                  background: "#0A2A66",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Back to Cases
              </button>

              <h2>{activeCase.caseNum}</h2>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    background: getStatusColor(activeCase.status),
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {activeCase.status}
                </span>
              </p>
              <p>
                <strong>Station:</strong> {activeCase.stationReported}
              </p>
              <p>{activeCase.description}</p>

              {/* Status change buttons */}
              <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                <button
                  onClick={() => handleStatusChange("aborted")}
                  style={{
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginRight: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Abort
                </button>
                <button
                  onClick={() => handleStatusChange("pending")}
                  style={{
                    background: "#ffbb33",
                    color: "black",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    marginRight: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange("completed")}
                  style={{
                    background: "#00C851",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Completed
                </button>
              </div>

              <h3>Updates</h3>
              <ul>
                {activeCase.updates?.map((u, i) => (
                  <li key={i}>
                    {new Date(u.dateTime).toLocaleString()} — {u.description} (
                    {u.updatedBy})
                  </li>
                ))}
              </ul>

              <h3>Add Update</h3>
              <textarea
                value={activeCase.newUpdate || ""}
                onChange={(e) =>
                  setActiveCase({ ...activeCase, newUpdate: e.target.value })
                }
                placeholder="Write update..."
                style={{
                  width: "100%",
                  padding: "10px",
                  height: "80px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              ></textarea>

              <button
                onClick={handleAddUpdate}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "12px",
                  background: "#0A2A66",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                Save Update
              </button>
              <button
                onClick={() => navigate(`/cases/recommend/${activeCase.caseNum}`)}
                style={{
                  background: "#FFD85A",
                  color: "black",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "15px",
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
                  marginBottom: "20px",
                  padding: "8px 15px",
                  background: "#0A2A66",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>

              <h2>Create New Case</h2>

              <label>Case Number (auto if empty)</label>
              <input
                value={createForm.caseNum}
                onChange={(e) =>
                  setCreateForm({ ...createForm, caseNum: e.target.value })
                }
                placeholder="e.g. CAS/12/35"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />

              <label>Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
                placeholder="Enter case description"
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              ></textarea>

              <label>Status</label>
              <select
                value={createForm.status}
                onChange={(e) =>
                  setCreateForm({ ...createForm, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="aborted">Aborted</option>
              </select>

              <label>Station Reported</label>
              <input
                value={createForm.stationReported}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    stationReported: e.target.value,
                  })
                }
                placeholder="Station name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />

              <button
                onClick={handleCreateCase}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "12px",
                  background: "#0A2A66",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Create Case
              </button>
            </div>
          )}
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
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        +
      </button>
    </div>
  );
}