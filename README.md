# 📚 NotesHub - PDF Notes Sharing & Management Platform

NotesHub is a modern, full-stack web application designed for students and professionals to upload, organize, preview, download, and securely share PDF notes.

---

## ✨ Features

- 🔐 **User Authentication**: Secure Signup and Login using **JWT (JSON Web Tokens)** and **Bcrypt** password hashing.
- 📤 **Cloud PDF Uploads**: Upload PDF files up to 25MB directly stored on **Cloudinary** using `multer` integration.
- 🗂️ **Interactive Dashboard**:
  - 🔍 Live search notes by title.
  - 🏷️ Filter notes dynamically by subject.
  - ⏳ Automatic sorting by latest uploaded.
- 👁️ **Inline PDF Preview & Viewer**:
  - Embedded modal preview powered by Google Docs Viewer.
  - Separate "Open in Browser" and direct "Download PDF" actions.
- 🔗 **Shareable Links**:
  - Generate share links for individual notes with automatic expiration dates.
  - Dedicated public preview page (`/share/:token`) accessible without requiring an account.
- 🎨 **Modern Responsive UI**: Built with React, Tailwind CSS, dark mode support, and clean micro-interactions.

---

## 🛠️ Tech Stack & Technologies Used

### **Frontend**
- **React (Vite)** - Fast, modern UI development
- **React Router DOM v6** - Client-side routing & protected navigation
- **Axios** - HTTP client with request interceptors for JWT authorization headers
- **Tailwind CSS** - Modern utility-first styling with dark mode support
- **Google Docs PDF Viewer** - Reliable cross-browser PDF rendering

### **Backend**
- **Node.js & Express.js** - REST API backend framework
- **MongoDB & Mongoose** - NoSQL Database for storing users, notes metadata, and share tokens
- **JSON Web Token (JWT)** - Stateless authentication & protected route middleware
- **Bcrypt.js** - Secure password hashing algorithm
- **Cloudinary SDK** (`cloudinary`, `multer-storage-cloudinary`, `multer`) - Cloud-based media storage and upload management
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```text
NotesHub/
├── server.js               # Express application entry point & DB connection
├── package.json            # Backend dependencies & scripts
├── .env.example            # Environment variables template for backend
├── middleware/             # Auth JWT verification middleware
├── middlewares/            # Multer & Cloudinary upload configuration middleware
├── models/                 # Mongoose schemas (User, Note)
├── routes/                 # Express API routes (auth, notes)
├── utils/                  # Cloudinary configuration utility
│
└── frontend/               # React Vite Frontend App
    ├── package.json        # Frontend dependencies & scripts
    ├── index.html          # HTML template
    ├── vite.config.js      # Vite configuration
    └── src/
        ├── App.jsx         # App routes & layout wrapper
        ├── lib/api.js      # Axios client instance & auth helpers
        ├── components/     # Reusable UI (Nav, PdfModal, Spinner, ToastProvider)
        └── pages/          # Application views (Landing, Login, Signup, Notes, Upload, SharedNote)
```

---

## 🚀 Getting Started & Local Setup

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` OR a **MongoDB Atlas** connection string)
- **Cloudinary Account** (for Cloud Name, API Key, and API Secret)

---

### 📥 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd NotesHub
```

---

### ⚙️ 2. Backend Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your environment credentials:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/notes  # Or your MongoDB Atlas connection URI
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3000`.*

---

### 💻 3. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the `frontend/` folder:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ No |
| `GET` | `/api/notes` | Get all notes uploaded by the current user | 🔒 Yes |
| `POST` | `/api/notes/upload-pdf` | Upload a PDF note to Cloudinary | 🔒 Yes |
| `POST` | `/api/notes/share/:id` | Generate a public 24-hour share token for a note | 🔒 Yes |
| `GET` | `/api/notes/public/:token` | Retrieve note metadata via public share token | ❌ No |
| `DELETE`| `/api/notes/:id` | Delete a note owned by the current user | 🔒 Yes |

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for details.
