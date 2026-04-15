import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastProvider from "./components/ToastProvider";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import SharedNote from "./pages/SharedNote";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";

export default function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <ToastProvider>
      <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {!isLandingPage && <Nav />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/share/:token" element={<SharedNote />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/notes" element={<Notes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}
