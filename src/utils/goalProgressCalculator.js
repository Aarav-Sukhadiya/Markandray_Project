import { toDate, daysUntil } from './dateHelpers';
import { prState } from './githubHelpers';

function withinRange(dateValue, start, end) {
  const d = toDate(dateValue);
  if (!d) return false;
  const s = start ? toDate(start) : null;
  const e = end ? toDate(end) : null;
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
}

export function computeGoalProgress(goal, githubData = {}) {
  if (!goal) return { current: 0, percentage: 0, status: 'active', daysLeft: null };

  const prs = githubData.authoredPRs ?? [];
  const issues = githubData.assignedIssues ?? [];
  const reviews = githubData.reviewedPRs ?? [];

  let current = 0;

  switch (goal.type) {
    case 'prs_merged':
      current = prs.filter(
        (pr) =>
          prState(pr) === 'merged' &&
          withinRange(pr.closed_at ?? pr.updated_at, goal.startDate, goal.endDate),
      ).length;
      break;
    case 'issues_closed':
      current = issues.filter(
        (i) =>
          i.state === 'closed' &&
          withinRange(i.closed_at ?? i.updated_at, goal.startDate, goal.endDate),
      ).length;
      break;
    case 'reviews_given':
      current = reviews.filter((r) =>
        withinRange(r.submitted_at ?? r.updated_at, goal.startDate, goal.endDate),
      ).length;
      break;
    case 'custom':
    default:
      current = Number(goal.current ?? 0);
      break;
  }

  const target = Math.max(Number(goal.target ?? 1), 1);
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const daysLeft = daysUntil(goal.endDate);

  let status = goal.status ?? 'active';
  if (current >= target) status = 'completed';
  else if (daysLeft !== null && daysLeft < 0) status = 'expired';
  else status = 'active';

  return { current, percentage, status, daysLeft };
}
