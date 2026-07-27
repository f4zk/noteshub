import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";

export default function Upload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!file) {
      const message = "Please choose a PDF file.";
      setError(message);
      toast.error(message);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      const message = "Only .pdf files are allowed.";
      setError(message);
      toast.error(message);
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("subject", subject);
    form.append("file", file);

    setLoading(true);
    setProgress(0);
    try {
      await api.post("/api/notes/upload-pdf", form, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      toast.success("Uploaded successfully");
      setTimeout(() => navigate("/notes", { replace: true }), 600);
    } catch (err) {
      const message = err?.response?.data?.error || "Upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-8">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Upload a Note</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Add a title, subject, and PDF to share with your team.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-400"
              placeholder="e.g. Unit 1 Notes"
              required
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-400"
              placeholder="e.g. Database"
              required
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">PDF File</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Only PDF files are accepted.</p>
          </div>

          {(loading || progress > 0) && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Upload progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all dark:bg-slate-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="md:col-span-2 lg:col-span-3">
            <button
              disabled={loading}
              className="inline-flex min-w-40 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {loading ? <Spinner label="Uploading..." /> : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

