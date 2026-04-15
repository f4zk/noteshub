export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
      <span>{label}</span>
    </div>
  );
}

