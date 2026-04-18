import { useEffect, useState } from 'react';
import {
  createNote,
  deleteNote,
  subscribeToNotes,
  updateNote,
} from '../services/notesService';
import { useAuth } from './useAuth';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setNotes([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const unsub = subscribeToNotes(
      user.uid,
      (list) => {
        setNotes(list);
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
    notes,
    loading,
    error,
    create: (data) => createNote(user.uid, data),
    update: (id, patch) => updateNote(user.uid, id, patch),
    remove: (id) => deleteNote(user.uid, id),
  };
}
