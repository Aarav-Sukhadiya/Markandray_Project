import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { relativeTime } from '../../utils/dateHelpers';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="card flex flex-col gap-2 p-4">
      <header className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Badge tone="indigo">{note.itemType}</Badge>
        <span className="font-mono">{note.repo}</span>
        <span>#{note.itemNumber}</span>
        <span className="ml-auto">{relativeTime(note.updatedAt ?? note.createdAt)}</span>
      </header>

      <a
        href={note.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-100"
      >
        {note.itemTitle || note.githubUrl}
      </a>

      <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{note.content}</p>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        {(note.tags ?? []).map((tag) => (
          <Badge key={tag} tone="slate">#{tag}</Badge>
        ))}
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" onClick={() => onEdit?.(note)}>Edit</Button>
          <Button variant="ghost" onClick={() => onDelete?.(note)}>Delete</Button>
        </div>
      </div>
    </article>
  );
}
