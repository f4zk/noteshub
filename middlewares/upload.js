const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Use async params function — the most reliable pattern for multer-storage-cloudinary v4.
// Avoids signature computation issues that occur with mixed static/function param objects.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Sanitize filename: strip extension, replace non-alphanumeric with underscores
    const rawName = file.originalname
      .replace(/\.[^/.]+$/, "")           // remove extension
      .replace(/[^a-zA-Z0-9_-]/g, "_")   // replace special chars
      .substring(0, 80);                  // limit length

    return {
      folder: "notes_app",
      resource_type: "raw",
      public_id: `${Date.now()}_${rawName}`,
    };
  },
});

// Configure multer with Cloudinary storage and constraints
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max size
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");
    if (isPdfName) {
      cb(null, true);
    } else {
      // If wrong file type -> return error
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

module.exports = upload;
