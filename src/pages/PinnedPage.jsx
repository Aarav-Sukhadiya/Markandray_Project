import { useState } from 'react';
import PinnedList from '../components/pinned/PinnedList';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ErrorMessage from '../components/ui/ErrorMessage';
import { usePinned } from '../hooks/usePinned';

export default function PinnedPage() {
  const { pinned, loading, error, create, update, remove } = usePinned();
  const [formOpen, setFormOpen] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url) return;
    let itemType = 'repo';
    let repo = '';
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length === 2) itemType = 'repo';
      else if (parts[2] === 'pull') itemType = 'pr';
      else if (parts[2] === 'issues') itemType = 'issue';
      if (parts[0] && parts[1]) repo = `${parts[0]}/${parts[1]}`;
    } catch {
      // ignore
    }
    await create({ githubUrl: url, itemType, customLabel: label, cachedTitle: label || url, cachedRepo: repo });
    setUrl('');
    setLabel('');
    setFormOpen(false);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renaming) return;
    await update(renaming.id, { customLabel: renaming.customLabel });
    setRenaming(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Pinned items</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Keep your most important issues, PRs, or repos one click away.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>+ Pin item</Button>
      </header>

      {error && <ErrorMessage error={error} />}

      <PinnedList
        pinned={pinned}
        loading={loading}
        onRemove={setConfirmRemove}
        onRelabel={(pin) => setRenaming({ ...pin })}
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Pin an item">
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <div>
            <label className="label" htmlFor="pin-url">GitHub URL</label>
            <input
              id="pin-url"
              type="url"
              required
              className="input"
              placeholder="https://github.com/owner/repo/issues/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="pin-label">Label (optional)</label>
            <input
              id="pin-label"
              type="text"
              className="input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Short custom label"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit">Pin</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(renaming)} onClose={() => setRenaming(null)} title="Rename pin">
        <form onSubmit={handleRename} className="flex flex-col gap-3">
          <div>
            <label className="label" htmlFor="pin-rename">Custom label</label>
            <input
              id="pin-rename"
              type="text"
              className="input"
              value={renaming?.customLabel ?? ''}
              onChange={(e) => setRenaming((prev) => ({ ...prev, customLabel: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(confirmRemove)} onClose={() => setConfirmRemove(null)} title="Unpin item">
        <p className="text-sm text-slate-700 dark:text-slate-200">Remove this pin?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmRemove(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={async () => {
              await remove(confirmRemove.id);
              setConfirmRemove(null);
            }}
          >
            Unpin
          </Button>
        </div>
      </Modal>
    </div>
  );
}
