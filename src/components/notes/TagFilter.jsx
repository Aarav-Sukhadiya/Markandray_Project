import { useMemo } from 'react';

export default function TagFilter({ notes = [], selected, onChange }) {
  const tags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => (n.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
          !selected
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selected === tag
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
