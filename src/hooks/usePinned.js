import { useEffect, useState } from 'react';
import {
  createPin,
  deletePin,
  subscribeToPinned,
  updatePin,
} from '../services/pinnedService';
import { useAuth } from './useAuth';

export function usePinned() {
  const { user } = useAuth();
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setPinned([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const unsub = subscribeToPinned(
      user.uid,
      (list) => {
        setPinned(list);
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
    pinned,
    loading,
    error,
    create: (data) => createPin(user.uid, data),
    update: (id, patch) => updatePin(user.uid, id, patch),
    remove: (id) => deletePin(user.uid, id),
  };
}
