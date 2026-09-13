import { useId, useState } from 'react';
import { Modal } from './Modal';
import { parseFolderInput } from '../content/folders';
import type { CuratedSetDefinition } from '../game';

export function MoveSetDialog({ set, sets, onMove, onClose }: {
  set: CuratedSetDefinition;
  sets: readonly CuratedSetDefinition[];
  onMove: (id: string, path: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const [text, setText] = useState((set.folderPath ?? []).join(' / '));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const listId = useId();
  const paths = [...new Set(sets.flatMap((item) => (item.folderPath ?? []).map((_, i) => item.folderPath!.slice(0, i + 1).join(' / '))))].sort();
  async function save() {
    setError(''); setBusy(true);
    try { await onMove(set.id, parseFolderInput(text)); onClose(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not move this set.'); }
    finally { setBusy(false); }
  }
  return <Modal title="Move set" onClose={busy ? undefined : onClose} actions={<><button className="secondary-button" type="button" disabled={busy} onClick={onClose}>Cancel</button><button className="primary-button" type="button" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Move set'}</button></>}>
    <p>{set.title}</p><label className="field-stack"><span>Destination folder</span><input type="text" list={listId} value={text} onChange={(event) => setText(event.target.value)} placeholder="For example: Science & Nature / Space" /><small className="field-help">Choose an existing folder or type a new path. Separate levels with /. Leave blank for Unfiled.</small></label>
    <datalist id={listId}>{paths.map((path) => <option key={path} value={path} />)}</datalist>
    <p className="field-help">This only changes your library in this browser. Your progress and saved games stay the same. Folder choices are included in full backups.</p>
    {error && <p className="field-error" role="alert">{error}</p>}
  </Modal>;
}
