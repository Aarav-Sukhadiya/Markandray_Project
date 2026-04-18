import { useState } from 'react';
import Button from '../ui/Button';
import { toDate, dateKey } from '../../utils/dateHelpers';

const GOAL_TYPES = [
  { value: 'prs_merged', label: 'PRs merged' },
  { value: 'issues_closed', label: 'Issues closed' },
  { value: 'reviews_given', label: 'Reviews given' },
  { value: 'custom', label: 'Custom' },
];

function defaultEnd() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}

export default function GoalForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [type, setType] = useState(initial?.type ?? 'prs_merged');
  const [target, setTarget] = useState(initial?.target ?? 5);
  const [startDate, setStartDate] = useState(dateKey(toDate(initial?.startDate) ?? new Date()));
  const [endDate, setEndDate] = useState(dateKey(toDate(initial?.endDate) ?? defaultEnd()));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        type,
        target: Number(target),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } catch (err) {
      setError(err.message ?? 'Failed to save goal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="label" htmlFor="goal-title">Title</label>
        <input
          id="goal-title"
          type="text"
          className="input"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Merge 5 PRs in May"
        />
      </div>

      <div>
        <label className="label" htmlFor="goal-description">Description (optional)</label>
        <textarea
          id="goal-description"
          className="input min-h-[60px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="goal-type">Type</label>
          <select id="goal-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {GOAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="goal-target">Target</label>
          <input
            id="goal-target"
            type="number"
            min="1"
            className="input"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="goal-start">Start</label>
          <input
            id="goal-start"
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="goal-end">Deadline</label>
          <input
            id="goal-end"
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create goal'}
        </Button>
      </div>
    </form>
  );
}
