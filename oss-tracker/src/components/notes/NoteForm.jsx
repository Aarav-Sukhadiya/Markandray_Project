import { useState } from 'react';
import Button from '../ui/Button';

export default function NoteForm({ initial, onSubmit, onCancel, showTargetUrl = false }) {
  const [content, setContent] = useState(initial?.content ?? '');
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(', '));
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
      await onSubmit({
        content: content.trim(),
        tags,
        ...(showTargetUrl ? { githubUrl } : {}),
      });
      if (!initial) {
        setContent('');
        setTagsInput('');
      }
    } catch (err) {
      setError(err.message ?? 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {showTargetUrl && (
        <div>
          <label className="label" htmlFor="note-url">GitHub URL</label>
          <input
            id="note-url"
            type="url"
            required
            className="input"
            placeholder="https://github.com/owner/repo/issues/123"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="note-content">Note</label>
        <textarea
          id="note-content"
          required
          className="input min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Supports markdown. e.g. ask maintainer about edge case X."
        />
      </div>

      <div>
        <label className="label" htmlFor="note-tags">Tags (comma separated)</label>
        <input
          id="note-tags"
          type="text"
          className="input"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="blocked, idea, ask-maintainer"
        />
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Save note'}
        </Button>
      </div>
    </form>
  );
}
