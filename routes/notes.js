const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const User = require("../models/User");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.pdf`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdfName) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

function handleMulterUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError
          ? err.code === "LIMIT_FILE_SIZE"
            ? "File too large"
            : err.message
          : err.message;
      return res.status(400).json({ error: message });
    }
    next();
  });
}

router.post("/upload", auth, handleMulterUpload, async (req, res) => {
  const { title, subject } = req.body;
  const uploadedBy = req.user?.id;

  if (!req.file) {
    return res.status(400).json({ error: "PDF file is required (field name: file)" });
  }

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof subject !== "string" ||
    !subject.trim()
  ) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      error: "title and subject are required",
    });
  }

  if (!uploadedBy || !mongoose.Types.ObjectId.isValid(uploadedBy)) {
    fs.unlink(req.file.path, () => {});
    return res.status(401).json({ error: "Invalid token user" });
  }

  const user = await User.findById(uploadedBy);
  if (!user) {
    fs.unlink(req.file.path, () => {});
    return res.status(404).json({ error: "User not found" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const note = await Note.create({
      title: title.trim(),
      subject: subject.trim(),
      fileUrl,
      uploadedBy,
    });

    return res.status(201).json({
      message: "Note uploaded",
      note: {
        id: note._id.toString(),
        title: note.title,
        subject: note.subject,
        fileUrl: note.fileUrl,
        uploadedBy: note.uploadedBy.toString(),
        createdAt: note.createdAt,
      },
    });
  } catch {
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: "Could not save note" });
  }
});

router.get("/", auth, async (req, res) => {
  const userId = req.user?.id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Invalid token user" });
  }

  try {
    const notes = await Note.find({ uploadedBy: userId })
      .populate("uploadedBy", "email")
      .sort({ createdAt: -1 })
      .lean();

    const list = notes.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      subject: n.subject,
      fileUrl: n.fileUrl,
      uploadedBy: n.uploadedBy
        ? { id: n.uploadedBy._id.toString(), email: n.uploadedBy.email }
        : null,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));

    return res.json({ notes: list });
  } catch {
    return res.status(500).json({ error: "Could not list notes" });
  }
});

router.post("/share/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Invalid token user" });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    if (note.uploadedBy.toString() !== userId) {
      return res.status(403).json({ error: "You can only share your own notes" });
    }

    const shareToken = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    note.shareToken = shareToken;
    note.isPublic = true;
    note.expiresAt = expiresAt;
    await note.save();

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const shareLink = `${frontendBaseUrl}/share/${shareToken}`;
    return res.json({
      message: "Share link created",
      shareLink,
      expiresAt,
    });
  } catch {
    return res.status(500).json({ error: "Could not create share link" });
  }
});

router.get("/public/:token", async (req, res) => {
  const { token } = req.params;
  if (!token || token.length < 12) {
    return res.status(400).json({ error: "Invalid share token" });
  }

  try {
    const note = await Note.findOne({ shareToken: token, isPublic: true }).lean();
    if (!note) {
      return res.status(404).json({ error: "Shared note not found" });
    }
    if (!note.expiresAt || new Date(note.expiresAt) < new Date()) {
      return res.status(410).json({ error: "Share link expired" });
    }

    return res.json({
      note: {
        id: note._id.toString(),
        title: note.title,
        subject: note.subject,
        fileUrl: note.fileUrl,
        expiresAt: note.expiresAt,
      },
    });
  } catch {
    return res.status(500).json({ error: "Could not fetch shared note" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  console.log("[DELETE /api/notes/:id] hit", { noteId: id, userId });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note id" });
  }
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: "Invalid token user" });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.uploadedBy.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own notes" });
    }

    await note.deleteOne();

    if (note.fileUrl) {
      const fileName = path.basename(note.fileUrl);
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.unlink(filePath, () => {});
    }

    return res.json({ message: "Note deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Could not delete note" });
  }
});

module.exports = router;
