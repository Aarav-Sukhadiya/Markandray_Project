import { useEffect, useState } from 'react';
import {
  createGoal,
  deleteGoal,
  subscribeToGoals,
  updateGoal,
} from '../services/goalsService';
import { useAuth } from './useAuth';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setGoals([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const unsub = subscribeToGoals(
      user.uid,
      (list) => {
        setGoals(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [user?.uid]);

  return {
    goals,
    loading,
    error,
    create: (data) => createGoal(user.uid, data),
    update: (id, patch) => updateGoal(user.uid, id, patch),
    remove: (id) => deleteGoal(user.uid, id),
  };
}
