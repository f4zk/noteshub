import { useEffect, useMemo, useState } from "react";
import PdfModal from "../components/PdfModal";
import Spinner from "../components/Spinner";
import { useToast } from "../components/ToastProvider";
import { api, API_BASE_URL, getUser } from "../lib/api";

export default function Notes() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [sortBy] = useState("latest");
  const [selectedNote, setSelectedNote] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [sharingId, setSharingId] = useState("");
  const [shareInfo, setShareInfo] = useState(null);

  const base = useMemo(() => API_BASE_URL, []);
  const subjects = useMemo(
    () => ["all", ...new Set(notes.map((n) => n.subject).filter(Boolean))],
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...notes];
    if (q) {
      list = list.filter((n) => n.title?.toLowerCase().includes(q));
    }
    if (subject !== "all") {
      list = list.filter((n) => n.subject === subject);
    }
    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [notes, query, sortBy, subject]);
  const currentUserId = getUser()?.id;

  async function handleDelete(note) {
    const confirmed = window.confirm(`Delete "${note.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(note.id);
    try {
      await api.delete(`/api/notes/${note.id}`);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (selectedNote?.id === note.id) {
        setSelectedNote(null);
      }
      toast.success("Note deleted successfully");
    } catch (err) {
      const message = err?.response?.data?.error || "Could not delete note";
      toast.error(message);
    } finally {
      setDeletingId("");
    }
  }

  async function handleShare(note) {
    setSharingId(note.id);
    try {
      const res = await api.post(`/api/notes/share/${note.id}`);
      setShareInfo({
        title: note.title,
        link: res.data.shareLink,
        expiresAt: res.data.expiresAt,
      });
      toast.success("Share link generated");
    } catch (err) {
      const message = err?.response?.data?.error || "Could not create share link";
      toast.error(message);
    } finally {
      setSharingId("");
    }
  }

  async function handleCopyLink() {
    if (!shareInfo?.link) return;
    try {
      await navigator.clipboard.writeText(shareInfo.link);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/notes");
        if (mounted) setNotes(res.data.notes || []);
      } catch (err) {
        if (mounted) {
          const message = err?.response?.data?.error || "Could not fetch notes";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [toast]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="border-b border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                Notes Dashboard
              </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Search, preview, and download your uploaded PDFs.
              </p>
            </div>
            <div className="inline-flex shrink-0 items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Sorted by latest first
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Subjects" : s}
                </option>
              ))}
            </select>
            <div className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredNotes.length} matching note{filteredNotes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200 md:mx-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          </div>
        ) : null}

        <div className="p-6 md:p-8">
          {loading ? (
            <Spinner label="Loading notes..." />
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 px-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <svg className="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No notes found</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                We couldn't find any notes matching your current filters. Try adjusting your search or subject.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((n) => (
                <article
                  key={n.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {n.title}
                      </h3>
                      <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-500/30">
                        {n.subject}
                      </span>
                    </div>
                    <p className="mb-6 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                      <svg className="mr-2 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedNote(n)}
                      className="flex w-full flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
                    >
                      Preview
                    </button>
                    <a
                      href={`${base}${n.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 sm:w-auto"
                    >
                      Open
                    </a>
                    <a
                      href={`${base}${n.fileUrl}`}
                      download
                      className="flex w-full flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 sm:w-auto"
                    >
                      Download
                    </a>
                    {n.uploadedBy?.id === currentUserId && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleShare(n)}
                          disabled={sharingId === n.id}
                          className="flex w-full flex-1 items-center justify-center rounded-xl border border-transparent bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 sm:w-auto"
                        >
                          {sharingId === n.id ? "Sharing..." : "Share"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(n)}
                          disabled={deletingId === n.id}
                          className="flex w-full flex-1 items-center justify-center rounded-xl border border-transparent bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 sm:w-auto"
                        >
                          {deletingId === n.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <PdfModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      {shareInfo ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setShareInfo(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-label="Close share modal"
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Share Note</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{shareInfo.title}</p>
            </div>
            <div className="space-y-3 px-5 py-4">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Share Link</label>
              <input
                readOnly
                value={shareInfo.link}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expires at {new Date(shareInfo.expiresAt).toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => setShareInfo(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

