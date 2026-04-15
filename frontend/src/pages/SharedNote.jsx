import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { api, API_BASE_URL } from "../lib/api";

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pdfUrl = useMemo(() => (note ? `${API_BASE_URL}${note.fileUrl}` : ""), [note]);

  useEffect(() => {
    let mounted = true;
    async function loadSharedNote() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/notes/public/${token}`);
        if (mounted) setNote(res.data.note);
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
        ) : note ? (
          <>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{note.title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Subject: {note.subject}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Link expires: {new Date(note.expiresAt).toLocaleString()}
            </p>
            <div className="mt-6 h-[70vh] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <iframe title={note.title} src={pdfUrl} className="h-full w-full" />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

