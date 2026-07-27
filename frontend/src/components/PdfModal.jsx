export default function PdfModal({ note, onClose }) {
  if (!note) return null;
  const pdfUrl = note.fileUrl;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close preview"
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{note.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{note.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
        <div className="h-[70vh]">
          <iframe 
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`} 
            title={note.title} 
            className="h-full w-full" 
          />
        </div>
      </div>
    </div>
  );
}

