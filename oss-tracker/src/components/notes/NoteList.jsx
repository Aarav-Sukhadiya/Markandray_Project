import { useMemo } from 'react';
import NoteCard from './NoteCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

export default function NoteList({ notes = [], loading, selectedTag, onEdit, onDelete }) {
  const filtered = useMemo(() => {
    if (!selectedTag) return notes;
    return notes.filter((n) => (n.tags ?? []).includes(selectedTag));
  }, [notes, selectedTag]);

  if (loading) return <LoadingSpinner label="Loading notes…" />;

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No notes yet"
        description="Open an issue or PR from the tracker and add your first note."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {filtered.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
