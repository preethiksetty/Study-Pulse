StudyPulse – Study Session & Mood Tracker

A simple full-stack web app built using React.js and Node.js.

💠Overview

StudyPulse is a lightweight web application that helps you log your study sessions along with your mood.
The dashboard gives you a quick summary of total study time, completed sessions, and an approximate average mood for the day.

It’s designed as a clean, minimal student project that demonstrates the basics of a React frontend interacting with a Node/Express backend.

💠Features

Add study sessions with:

Title

Subject

Duration

Mood (😄 🙂 😐 ☹️)

Mark sessions as completed

View quick daily stats

Filter sessions (all / completed / pending)

Responsive UI

💠Tech Stack

Frontend: React.js (Hooks, Fetch API)
Backend: Node.js, Express.js
Other: CORS, basic REST API

Project Structure
study-pulse/
  ├── backend/
  │     └── server.js
  ├── frontend/
  │     └── (React application)
  ├── README.md

 💠Getting Started
1.Run the Backend
   ```bash
      cd backend
      npm install
      node server.js
   ```
2. Run the Frontend
 ```bash
cd frontend
npm install
npm start
   ```
💠API Endpoints
GET /api/sessions

Fetch all logged sessions.

POST /api/sessions

Add a new study session.

PATCH /api/sessions/:id/toggle

Toggle completion status.

GET /api/stats

Returns small summary stats.
