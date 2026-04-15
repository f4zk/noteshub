require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use("/uploads", express.static(uploadsDir));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment. Copy .env.example to .env and set it.");
    process.exit(1);
  }
  if (!JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment. Copy .env.example to .env and set it.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
