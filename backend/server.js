const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory "database"
let sessions = [];
let nextId = 1;

// Get all sessions
app.get("/api/sessions", (req, res) => {
  res.json(sessions);
});

// Create a new study session
app.post("/api/sessions", (req, res) => {
  const { title, subject, durationMinutes, mood } = req.body;

  if (!title || !subject || !durationMinutes || !mood) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newSession = {
    id: nextId++,
    title,
    subject,
    durationMinutes,
    mood, // "😄", "🙂", "😐", "☹️"
    date: new Date().toISOString(),
    completed: false,
  };

  sessions.push(newSession);
  res.status(201).json(newSession);
});

// Toggle completed
app.patch("/api/sessions/:id/toggle", (req, res) => {
  const { id } = req.params;
  const session = sessions.find((s) => s.id === Number(id));

  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  session.completed = !session.completed;
  res.json(session);
});

// Simple stats
app.get("/api/stats", (req, res) => {
  const total = sessions.length;
  const completed = sessions.filter((s) => s.completed).length;
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + Number(s.durationMinutes || 0),
    0
  );

  const moodScores = { "😄": 4, "🙂": 3, "😐": 2, "☹️": 1 };
  let moodSum = 0;
  let moodCount = 0;

  sessions.forEach((s) => {
    if (moodScores[s.mood]) {
      moodSum += moodScores[s.mood];
      moodCount++;
    }
  });

  let avgMoodLabel = "N/A";
  if (moodCount > 0) {
    const avg = moodSum / moodCount;
    if (avg >= 3.5) avgMoodLabel = "Mostly Happy 😄";
    else if (avg >= 2.5) avgMoodLabel = "Balanced 🙂";
    else if (avg >= 1.5) avgMoodLabel = "Stressed 😐";
    else avgMoodLabel = "Very Stressed ☹️";
  }

  res.json({
    totalSessions: total,
    completedSessions: completed,
    totalMinutes,
    avgMoodLabel,
  });
});

app.listen(PORT, () => {
  console.log(`StudyPulse backend running on http://localhost:${PORT}`);
});
