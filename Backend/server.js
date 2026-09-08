require("dotenv").config();
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const Entry = require("./models/result");
const authRoutes = require("./routes/auth");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// SERVE FRONTEND
// =========================

// Frontend is now one folder outside backend
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "dashboard.html"));
});

app.get("/history", (req, res) => {
  res.sendFile(path.join(frontendPath, "history.html"));
});

// =========================
// AUTH MIDDLEWARE
// =========================

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No authorization token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId || decoded.id || decoded._id;

    if (!req.userId) {
      return res.status(401).json({
        message: "Invalid token: user ID missing"
      });
    }

    next();

  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

// =========================
// AUTH ROUTES
// =========================

app.use("/api/auth", authRoutes);

// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DATABASE CONNECTED SUCCESSFULLY!");
    console.log("Connected to database:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  });

// =========================
// SUBMIT ASSESSMENT
// =========================

app.post("/api/submit", authMiddleware, async (req, res) => {
  try {
    console.log("\n========== NEW SUBMISSION ==========");
    console.log("User ID:", req.userId);
    console.log("Request body:", req.body);

    let {
      mood,
      energy,
      questions,
      journalEntry,
      score,
      sentimentScore
    } = req.body;

    mood = Number(mood);
    energy = Number(energy);
    questions = Number(questions);
    score = Number(score);
    sentimentScore = Number(sentimentScore);

    if (
      Number.isNaN(mood) ||
      Number.isNaN(energy) ||
      Number.isNaN(questions) ||
      Number.isNaN(score)
    ) {
      return res.status(400).json({
        message: "Invalid assessment data",
        received: req.body
      });
    }

    if (Number.isNaN(sentimentScore)) {
      sentimentScore = 0.5;
    }

    const entry = new Entry({
      userId: req.userId,
      mood,
      energy,
      questions,
      journalEntry: journalEntry || "",
      score,
      sentimentScore
    });

    const savedEntry = await entry.save();

    console.log("✅ ENTRY SAVED TO MONGODB");
    console.log(savedEntry);
    console.log("====================================\n");

    return res.status(201).json({
      message: "Assessment saved successfully",
      data: savedEntry
    });

  } catch (error) {
    console.error("❌ ERROR SAVING ENTRY:");
    console.error(error);

    return res.status(500).json({
      message: "Failed to save assessment",
      error: error.message
    });
  }
});

// =========================
// HISTORY: MOOD
// =========================

app.get("/api/history/mood", authMiddleware, async (req, res) => {
  try {
    const entries = await Entry
      .find({ userId: req.userId })
      .sort({ createdAt: 1 });

    const moodCount = {};

    entries.forEach((entry) => {
      const mood = entry.mood;
      moodCount[mood] = (moodCount[mood] || 0) + 1;
    });

    res.json(moodCount);

  } catch (error) {
    console.error("Mood history error:", error);

    res.status(500).json({
      message: "Failed to load mood history"
    });
  }
});

// =========================
// HISTORY: ENERGY
// =========================

app.get("/api/history/energy", authMiddleware, async (req, res) => {
  try {
    const entries = await Entry
      .find({ userId: req.userId })
      .sort({ createdAt: 1 });

    res.json(
      entries.map((entry) => ({
        date: entry.createdAt,
        energy: entry.energy
      }))
    );

  } catch (error) {
    console.error("Energy history error:", error);

    res.status(500).json({
      message: "Failed to load energy history"
    });
  }
});

// =========================
// HISTORY: EMOTIONAL INDEX
// =========================

app.get(
  "/api/history/emotional-index",
  authMiddleware,
  async (req, res) => {
    try {
      const entries = await Entry
        .find({ userId: req.userId })
        .sort({ createdAt: 1 });

      res.json(
        entries.map((entry) => ({
          date: entry.createdAt.toISOString().split("T")[0],
          value: Math.round(entry.score * 100)
        }))
      );

    } catch (error) {
      console.error("Emotional index history error:", error);

      res.status(500).json({
        message: "Failed to load emotional index history"
      });
    }
  }
);

// =========================
// HISTORY: ALL ENTRIES
// =========================

app.get("/api/history/all", authMiddleware, async (req, res) => {
  try {
    const entries = await Entry
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(entries);

  } catch (error) {
    console.error("Full history error:", error);

    res.status(500).json({
      message: "Failed to load history"
    });
  }
});

// =========================
// START SERVER
// =========================

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});