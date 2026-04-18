import { useCallback, useMemo, useState } from 'react';
import GoalForm from '../components/goals/GoalForm';
import GoalList from '../components/goals/GoalList';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useGoals } from '../hooks/useGoals';
import { useAuthoredPRs } from '../hooks/useAuthoredPRs';
import { useAssignedIssues } from '../hooks/useAssignedIssues';
import { useGitHubContext } from '../hooks/useGitHub';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'expired', label: 'Expired' },
];

export default function GoalsPage() {
  const { githubUser } = useGitHubContext();
  const { goals, loading, error, create, update, remove } = useGoals();
  const prsQ = useAuthoredPRs(githubUser?.login);
  const issuesQ = useAssignedIssues();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [filter, setFilter] = useState('all');

  const githubData = useMemo(
    () => ({ authoredPRs: prsQ.data?.items ?? [], assignedIssues: Array.isArray(issuesQ.data) ? issuesQ.data : [] }),
    [prsQ.data, issuesQ.data],
  );

  const handleEdit = useCallback((goal) => {
    setEditing(goal);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((goal) => {
    setConfirming(goal);
  }, []);

  const confirmDelete = async () => {
    if (!confirming) return;
    await remove(confirming.id);
    setConfirming(null);
  };

  const handleSubmit = async (data) => {
    if (editing) await update(editing.id, data);
    else await create(data);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Goals</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Progress is re-derived from GitHub — source of truth never duplicated.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>+ New goal</Button>
      </header>

      {error && <ErrorMessage error={error} />}

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <GoalList
        goals={goals}
        loading={loading}
        githubData={githubData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filter={filter}
      />

      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit goal' : 'New goal'}
      >
        <GoalForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete goal"
      >
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Delete <span className="font-semibold">{confirming?.title}</span>? This can't be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
