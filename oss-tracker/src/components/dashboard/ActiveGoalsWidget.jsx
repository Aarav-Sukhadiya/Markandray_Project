import { Link } from 'react-router-dom';
import GoalProgressBar from '../goals/GoalProgressBar';
import EmptyState from '../ui/EmptyState';

export default function ActiveGoalsWidget({ goals = [], githubData, loading }) {
  const active = goals.filter((g) => g.status !== 'completed' && g.status !== 'expired').slice(0, 4);

  if (!loading && active.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No active goals"
        description="Set a goal to keep yourself accountable."
        action={
          <Link to="/goals" className="btn-primary">
            Create goal
          </Link>
        }
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {active.map((goal) => (
        <li key={goal.id}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-100">{goal.title}</span>
          </div>
          <GoalProgressBar goal={goal} githubData={githubData} />
        </li>
      ))}
    </ul>
  );
}
