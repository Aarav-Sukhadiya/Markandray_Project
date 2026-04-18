import { useMemo, useState } from 'react';
import { usePinned } from '../../hooks/usePinned';
import Button from '../ui/Button';

export default function PinButton({ url, type = 'issue', title = '', repo = '', customLabel = '' }) {
  const { pinned, create, remove } = usePinned();
  const [busy, setBusy] = useState(false);

  const existing = useMemo(() => pinned.find((p) => p.githubUrl === url), [pinned, url]);

  const handleClick = async () => {
    if (!url) return;
    setBusy(true);
    try {
      if (existing) {
        await remove(existing.id);
      } else {
        await create({
          githubUrl: url,
          itemType: type,
          customLabel,
          cachedTitle: title,
          cachedRepo: repo,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant={existing ? 'secondary' : 'ghost'} onClick={handleClick} disabled={busy}>
      {existing ? '📌 Unpin' : '📍 Pin'}
    </Button>
  );
}
