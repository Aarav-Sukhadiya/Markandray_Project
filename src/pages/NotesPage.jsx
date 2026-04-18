import { useCallback, useState } from 'react';
import NoteList from '../components/notes/NoteList';
import NoteForm from '../components/notes/NoteForm';
import TagFilter from '../components/notes/TagFilter';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useNotes } from '../hooks/useNotes';

export default function NotesPage() {
  const { notes, loading, error, create, update, remove } = useNotes();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [tag, setTag] = useState('');

  const handleEdit = useCallback((note) => {
    setEditing(note);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((note) => {
    setConfirming(note);
  }, []);

  const confirmDelete = async () => {
    if (!confirming) return;
    await remove(confirming.id);
    setConfirming(null);
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      if (!data.githubUrl) throw new Error('GitHub URL is required');
      const u = new URL(data.githubUrl);
      const parts = u.pathname.split('/').filter(Boolean);
      const [owner, repoName, kind, num] = parts;
      const itemType = kind === 'pull' ? 'pr' : 'issue';
      await create({
        ...data,
        itemType,
        repo: owner && repoName ? `${owner}/${repoName}` : '',
        itemNumber: Number(num) || 0,
        itemTitle: data.itemTitle ?? '',
      });
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Notes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Private annotations on GitHub items — only you can see them.</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>+ New note</Button>
      </header>

      {error && <ErrorMessage error={error} />}

      <TagFilter notes={notes} selected={tag} onChange={setTag} />

      <NoteList
        notes={notes}
        loading={loading}
        selectedTag={tag}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit note' : 'New note'}
      >
        <NoteForm
          initial={editing}
          showTargetUrl={!editing}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <Modal
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete note"
      >
        <p className="text-sm text-slate-700 dark:text-slate-200">Delete this note? This can't be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
