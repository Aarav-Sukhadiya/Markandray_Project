import { useMemo, useState } from 'react';
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';

function buildDailyCounts(events = []) {
  const map = new Map();
  events.forEach((event) => {
    const date = new Date(event.created_at);
    if (Number.isNaN(date.getTime())) return;
    const key = format(date, 'yyyy-MM-dd');
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return map;
}

function cellClass(count) {
  if (!count) return 'bg-slate-200 dark:bg-slate-800';
  if (count < 2) return 'bg-emerald-200 dark:bg-emerald-900/60';
  if (count < 5) return 'bg-emerald-400 dark:bg-emerald-700';
  if (count < 10) return 'bg-emerald-500 dark:bg-emerald-500';
  return 'bg-emerald-600 dark:bg-emerald-400';
}

export default function ContributionHeatmap({ events = [] }) {
  const [hover, setHover] = useState(null);

  const weeks = useMemo(() => {
    const counts = buildDailyCounts(events);
    const today = new Date();
    const start = startOfWeek(subDays(today, 365), { weekStartsOn: 0 });
    const result = [];
    let cursor = start;
    for (let w = 0; w < 53; w += 1) {
      const week = [];
      for (let d = 0; d < 7; d += 1) {
        const day = addDays(cursor, d);
        const key = format(day, 'yyyy-MM-dd');
        const count = counts.get(key) ?? 0;
        const inFuture = day > today;
        week.push({ date: day, count, inFuture, isToday: isSameDay(day, today) });
      }
      result.push(week);
      cursor = addDays(cursor, 7);
    }
    return result;
  }, [events]);

  const total = useMemo(() => {
    return events.length;
  }, [events]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">{total}</span> events in the last year
        </p>
        {hover && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {format(hover.date, 'MMM d, yyyy')} · {hover.count} event{hover.count === 1 ? '' : 's'}
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`h-3 w-3 rounded-sm ${day.inFuture ? 'bg-transparent' : cellClass(day.count)} ${day.isToday ? 'ring-1 ring-indigo-500' : ''}`}
                  onMouseEnter={() => setHover(day)}
                  onMouseLeave={() => setHover(null)}
                  title={`${format(day.date, 'MMM d, yyyy')}: ${day.count} events`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Less</span>
        <span className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
        <span className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
        <span className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
        <span className="h-3 w-3 rounded-sm bg-emerald-500" />
        <span className="h-3 w-3 rounded-sm bg-emerald-600 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
}
