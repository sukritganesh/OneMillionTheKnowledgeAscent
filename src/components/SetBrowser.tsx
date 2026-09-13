import { useMemo, useState, type ReactNode } from 'react';
import type { CuratedSetDefinition } from '../game';
import { isWithinFolder, setFolder } from '../content/folders';

interface SetBrowserProps<T extends CuratedSetDefinition> {
  sets: readonly T[];
  renderSet: (set: T) => ReactNode;
}

export function SetBrowser<T extends CuratedSetDefinition>({ sets, renderSet }: SetBrowserProps<T>) {
  const [folder, setFolderPath] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);
  const search = query.trim().toLocaleLowerCase('en-US');
  const activeFolder = sets.some((set) => isWithinFolder(setFolder(set), folder)) ? folder : [];
  const folderSetCount = sets.filter((set) => isWithinFolder(setFolder(set), activeFolder)).length;
  const folders = useMemo(() => {
    const counts = new Map<string, number>();
    for (const set of sets) {
      const path = setFolder(set);
      if (isWithinFolder(path, activeFolder) && path.length > activeFolder.length) {
        const name = path[activeFolder.length];
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
    return [...counts].sort(([a], [b]) => a.localeCompare(b));
  }, [sets, activeFolder]);
  const visible = sets.filter((set) => search
    ? [set.title, set.description, set.theme, ...(set.tags ?? []), ...setFolder(set)].join(' ').toLocaleLowerCase('en-US').includes(search)
    : all || (setFolder(set).length === activeFolder.length && isWithinFolder(setFolder(set), activeFolder)))
    .slice().sort((a, b) => a.title.localeCompare(b.title));

  function navigate(path: string[]) { setFolderPath(path); setAll(false); setQuery(''); }
  return <section className="set-library" aria-label="Question set library">
    <div className="set-library__toolbar">
      <label className="field-stack"><span>Search all sets</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, topic, or folder" /></label>
      <div className="set-library__views" role="group" aria-label="Library view">
        <button type="button" className="secondary-button" aria-pressed={!all} onClick={() => { setAll(false); setQuery(''); }}>Folders</button>
        <button type="button" className="secondary-button" aria-pressed={all} onClick={() => { setAll(true); setQuery(''); }}>All sets</button>
      </div>
    </div>
    <nav className="set-library__breadcrumbs" aria-label="Set folders">
      <button type="button" onClick={() => navigate([])}>All folders</button>
      {!all && !search && activeFolder.map((part, index) => <span key={index}><span aria-hidden="true"> / </span><button type="button" aria-current={index === activeFolder.length - 1 ? 'location' : undefined} onClick={() => navigate(activeFolder.slice(0, index + 1))}>{part}</button></span>)}
      <span className="set-library__count" role="status">{search ? `${visible.length} search ${visible.length === 1 ? 'result' : 'results'}` : all ? `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}` : `${folders.length ? `${folders.length} ${folders.length === 1 ? 'folder' : 'folders'} · ` : ''}${folderSetCount} ${folderSetCount === 1 ? 'set' : 'sets'}`}</span>
    </nav>
    {!all && !search && folders.length > 0 && <div className="set-library__folders">{folders.map(([name, count]) => <button type="button" className="set-library__folder" key={name} aria-label={`Open folder ${name}`} onClick={() => navigate([...activeFolder, name])}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 6h7l2 3h9v11H3zM3 6V4h7l2 2h9v3" /></svg>
      <span><strong>{name}</strong><small>{count} {count === 1 ? 'set' : 'sets'}</small></span><span aria-hidden="true">›</span>
    </button>)}</div>}
    {visible.length > 0 && <div className="set-library__sets">{visible.map((set) => <div className="set-library__item" key={set.id}>
      {(all || search) && <span className="set-library__location">{setFolder(set).join(' / ')}</span>}
      {renderSet(set)}
    </div>)}</div>}
    {visible.length === 0 && (search || all || folders.length === 0) && <p className="set-library__empty">{search ? 'No sets match your search. Try a different title or topic.' : 'No sets here yet. Import a set or choose another folder.'}</p>}
  </section>;
}
