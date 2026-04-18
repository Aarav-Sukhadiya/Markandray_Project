import { useMemo } from 'react';
import GoalCard from './GoalCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { computeGoalProgress } from '../../utils/goalProgressCalculator';

export default function GoalList({ goals = [], loading, githubData, onEdit, onDelete, filter = 'all' }) {
  const visible = useMemo(() => {
    return goals
      .map((g) => ({ ...g, _computed: computeGoalProgress(g, githubData) }))
      .map((g) => ({ ...g, status: g._computed.status }))
      .filter((g) => {
        if (filter === 'all') return true;
        return g.status === filter;
      });
  }, [goals, githubData, filter]);

  if (loading) return <LoadingSpinner label="Loading goals…" />;

  if (visible.length === 0) {
    return <EmptyState icon="🎯" title="No goals yet" description="Set a target to stay accountable." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {visible.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          githubData={githubData}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
