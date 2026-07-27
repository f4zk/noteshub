const cloudinary = require("cloudinary").v2;

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

// Validate credentials at startup so misconfigurations surface immediately
if (!cloud_name || !api_key || !api_secret) {
  console.error(
    "[Cloudinary] Missing credentials — check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env"
  );
} else {
  console.log(
    `[Cloudinary] Configured — cloud: ${cloud_name}, key: ${api_key.slice(0, 4)}****, secret length: ${api_secret.length} chars`
  );
}

cloudinary.config({ cloud_name, api_key, api_secret });

module.exports = cloudinary;
