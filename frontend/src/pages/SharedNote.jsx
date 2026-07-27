import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { api } from "../lib/api";

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { fileUrl, previewUrl } = useMemo(() => {
    if (!note || !note.fileUrl) return { fileUrl: "", previewUrl: "" };
    const url = note.fileUrl;
    console.log("[SharedNote] Received fileUrl:", url);
    return {
      fileUrl: url,
      previewUrl: `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    };
  }, [note]);

  useEffect(() => {
    let mounted = true;
    async function loadSharedNote() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/notes/public/${token}`);
        if (mounted) {
          if (!res.data.note) {
            setError("Note data is missing");
          } else {
            setNote(res.data.note);
          }
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.error || "Could not load shared note");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (token) loadSharedNote();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-8">
        {loading ? (
          <Spinner label="Loading shared note..." />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        ) : note && fileUrl ? (
          <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{note.title}</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Subject: {note.subject}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Link expires: {new Date(note.expiresAt).toLocaleString()}
                </p>
              </div>
              <a
                href={fileUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Download PDF
              </a>
            </div>
            <div className="mt-6 h-[70vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <iframe title={note.title} src={previewUrl} className="h-full w-full" />
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Note or file content is unavailable.
          </div>
        )}
      </div>
    </div>
  );
}

