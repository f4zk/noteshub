const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SALT_ROUNDS = 10;

function validateEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({
      error: "Invalid input",
      details: "Valid email and password (min 8 characters) are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ email: normalizedEmail, passwordHash });
    return res.status(201).json({
      message: "User created",
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: "Could not create user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Temporary debug logs for login troubleshooting.
    console.log("Entered password:", password);
    console.log("DB password:", user.passwordHash);

    let isMatch = false;
    const looksHashed = typeof user.passwordHash === "string" && user.passwordHash.startsWith("$2");

    if (looksHashed) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else if (typeof user.passwordHash === "string") {
      // Support legacy users that were saved without hashing.
      isMatch = password === user.passwordHash;
      if (isMatch) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        user.passwordHash = await bcrypt.hash(password, salt);
        await user.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfigured (JWT_SECRET missing)" });
    }

    const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: "1d" });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id.toString(), email: user.email },
    });
  } catch {
    return res.status(500).json({ error: "Could not log in" });
  }
});

module.exports = router;
