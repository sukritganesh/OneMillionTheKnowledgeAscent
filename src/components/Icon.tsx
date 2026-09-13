type IconName = 'settings' | 'help' | 'expand' | 'packs' | 'user' | 'add' | 'stats' | 'history' | 'switch' | 'hint' | 'phone';

const paths: Record<IconName, string> = {
  settings: 'M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6',
  help: 'M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3h.01',
  expand: 'M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4',
  packs: 'M5 4h11v15H5zM9 1h10v15M8 8h5m-5 4h5',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  add: 'M12 5v14M5 12h14',
  stats: 'M5 20V10m7 10V4m7 16v-7',
  history: 'M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7m2-4v6l4 2',
  switch: 'M3 7h17l-4-4m5 14H4l4 4M20 7l-4 4M4 17l4-4',
  hint: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2',
  phone: 'm5 3 4 1 1 5-3 2a15 15 0 0 0 6 6l2-3 5 1 1 4c0 2-3 3-5 2A22 22 0 0 1 3 8C2 6 3 3 5 3Z',
};

export function Icon({ name }: { name: IconName }) {
  return <svg className="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === 'help' && <circle cx="12" cy="12" r="9" />}
    <path d={paths[name]} />
  </svg>;
}
