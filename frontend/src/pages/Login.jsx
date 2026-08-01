import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, API_BASE_URL, setToken, setUser } from "../lib/api";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = { email: email.trim(), password };
    console.log("[Login] Request URL:", `${API_BASE_URL}/api/auth/login`);
    console.log("[Login] Payload:", {
      email: payload.email,
      password: "[hidden]",
    });
    try {
      const res = await api.post("/api/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("[Login] Response:", res.status, res.data);
      const token = res?.data?.token;
      if (!token) {
        setError("Login response missing token");
        return;
      }
      setToken(token);
      setUser(res?.data?.user || null);
      toast.success("Logged in successfully");
      navigate("/upload", { replace: true });
    } catch (err) {
      console.error("[Login] Error:", err);
      const isNetworkErr = err?.message === "Network Error" || err?.code === "ERR_NETWORK";
      const backendMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (isNetworkErr
          ? `Cannot connect to server at ${API_BASE_URL}. Please ensure the backend server is running.`
          : err?.message) ||
        "Login failed";
      setError(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl place-items-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Continue to your notes dashboard.
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-slate-900 underline dark:text-slate-100"
            to="/signup"
          >
            Signup
          </Link>
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {loading ? <Spinner label="Signing in..." /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
