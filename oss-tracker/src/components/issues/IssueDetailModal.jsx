import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import NoteForm from '../notes/NoteForm';
import { repoFullName, ghItemType, isPullRequest } from '../../utils/githubHelpers';
import { relativeTime } from '../../utils/dateHelpers';
import { useNotes } from '../../hooks/useNotes';

export default function IssueDetailModal({ issue, open, onClose }) {
  const { notes, create, update, remove } = useNotes();
  const [editing, setEditing] = useState(null);

  const matchingNotes = useMemo(() => {
    if (!issue) return [];
    return notes.filter((n) => n.githubUrl === issue.html_url);
  }, [notes, issue]);

  if (!issue) return null;

  const repo = repoFullName(issue);

  const handleSubmit = async (data) => {
    const payload = {
      githubUrl: issue.html_url,
      itemType: ghItemType(issue),
      repo,
      itemNumber: issue.number,
      itemTitle: issue.title,
      content: data.content,
      tags: data.tags,
    };
    if (editing) {
      await update(editing.id, { content: data.content, tags: data.tags });
      setEditing(null);
    } else {
      await create(payload);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`${repo} #${issue.number}`} maxWidth="max-w-2xl">
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={issue.state === 'open' ? 'emerald' : 'rose'}>{issue.state}</Badge>
            {isPullRequest(issue) && <Badge tone="purple">PR</Badge>}
            <span className="text-xs text-slate-500 dark:text-slate-400">Updated {relativeTime(issue.updated_at)}</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{issue.title}</h3>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-xs text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View on GitHub ↗
          </a>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">Your notes</h4>
          {matchingNotes.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">No notes for this item yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {matchingNotes.map((note) => (
                <li key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-100">{note.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(note.tags ?? []).map((tag) => (
                      <Badge key={tag} tone="indigo">#{tag}</Badge>
                    ))}
                    <div className="ml-auto flex gap-1">
                      <Button variant="ghost" onClick={() => setEditing(note)}>Edit</Button>
                      <Button variant="ghost" onClick={() => remove(note.id)}>Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {editing ? 'Edit note' : 'Add a note'}
          </h4>
          <NoteForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    </Modal>
  );
}
