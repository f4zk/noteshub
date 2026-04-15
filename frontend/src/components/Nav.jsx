import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getToken, getUser } from "../lib/api";

export default function Nav() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="font-semibold text-slate-900 dark:text-slate-100">
          NotesHub
        </Link>
        <nav className="flex items-center gap-2">
          {!token ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClass}>
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/upload" className={linkClass}>
                Upload
              </NavLink>
              <NavLink to="/notes" className={linkClass}>
                Notes
              </NavLink>
              <span className="hidden rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-700 md:inline dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {user?.email || "User"}
              </span>
              <button
                onClick={onLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

