import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:4000";

function App() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [mood, setMood] = useState("🙂");
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    const sessionsRes = await fetch(`${API_BASE}/api/sessions`);
    const sessionsData = await sessionsRes.json();
    const statsRes = await fetch(`${API_BASE}/api/stats`);
    const statsData = await statsRes.json();

    setSessions(sessionsData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!title || !subject || !duration) return;

    await fetch(`${API_BASE}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subject,
        durationMinutes: duration,
        mood,
      }),
    });

    setTitle("");
    setSubject("");
    setDuration("");
    setMood("🙂");
    fetchData();
  };

  const handleToggleCompleted = async (id) => {
    await fetch(`${API_BASE}/api/sessions/${id}/toggle`, {
      method: "PATCH",
    });
    fetchData();
  };

  const filteredSessions =
    filter === "all"
      ? sessions
      : sessions.filter((s) =>
          filter === "completed" ? s.completed : !s.completed
        );

  return (
    <div className="app">
      <header className="app-header">
        <h1>StudyPulse 📚</h1>
        <p>Track your study sessions & mood in one simple dashboard.</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Log a Study Session</h2>
          <form className="session-form" onSubmit={handleAddSession}>
            <input
              type="text"
              placeholder="Session title (eg: DSA revision)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Subject (eg: OS, DBMS)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <div className="mood-row">
              <label>Mood:</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="😄">😄 Energised</option>
                <option value="🙂">🙂 Okay</option>
                <option value="😐">😐 Meh</option>
                <option value="☹️">☹️ Tired</option>
              </select>
            </div>

            <button type="submit">Add Session</button>
          </form>
        </section>

        <section className="card stats-card">
          <h2>Today’s Snapshot</h2>
          {loading || !stats ? (
            <p>Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">Total Sessions</span>
                <span className="stat-value">{stats.totalSessions}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value">
                  {stats.completedSessions}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Minutes</span>
                <span className="stat-value">{stats.totalMinutes}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Average Mood</span>
                <span className="stat-value">{stats.avgMoodLabel}</span>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="list-header">
            <h2>Recent Sessions</h2>
            <div className="filter">
              <label>Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <p className="empty">No sessions yet. Start logging your focus time!</p>
          ) : (
            <ul className="session-list">
              {filteredSessions.map((s) => (
                <li
                  key={s.id}
                  className={`session-item ${
                    s.completed ? "session-completed" : ""
                  }`}
                >
                  <div className="session-main">
                    <h3>{s.title}</h3>
                    <p className="muted">
                      {s.subject} • {s.durationMinutes} mins
                    </p>
                  </div>
                  <div className="session-meta">
                    <span className="mood-tag">{s.mood}</span>
                    <button
                      className="toggle-btn"
                      onClick={() => handleToggleCompleted(s.id)}
                    >
                      {s.completed ? "Mark Pending" : "Mark Done"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>Built with React & Node.js • Student project</span>
      </footer>
    </div>
  );
}

export default App;
