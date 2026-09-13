import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { SetBrowser } from './SetBrowser';

const sets = [
  { id: 'space', title: 'First Light', folderPath: ['Science', 'Space'], questionIds: [] },
  { id: 'plant', title: 'Plant Life', folderPath: ['Science', 'Plants'], questionIds: [] },
  { id: 'old-import', title: 'Old Import', questionIds: [] }
];
const renderSet = (set: typeof sets[number]) => <button>{set.title}</button>;
afterEach(cleanup);

describe('curated set browser', () => {
  it('navigates nested folders, breadcrumbs, and the flat all-sets view', async () => {
    const user = userEvent.setup();
    render(<SetBrowser sets={sets} renderSet={renderSet} />);
    expect(screen.queryByRole('button', { name: 'First Light' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open folder Science' }));
    await user.click(screen.getByRole('button', { name: 'Open folder Space' }));
    expect(screen.getByRole('button', { name: 'First Light' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Science' }));
    expect(screen.getByRole('button', { name: 'Open folder Plants' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'All sets' }));
    expect(screen.getByRole('button', { name: 'Plant Life' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Old Import' })).toBeVisible();
  });

  it('searches the whole library from inside a folder and handles legacy imports', async () => {
    const user = userEvent.setup();
    render(<SetBrowser sets={sets} renderSet={renderSet} />);
    await user.click(screen.getByRole('button', { name: 'Open folder Unfiled' }));
    expect(screen.getByRole('button', { name: 'Old Import' })).toBeVisible();
    await user.type(screen.getByRole('searchbox', { name: 'Search all sets' }), 'space');
    expect(screen.getByRole('button', { name: 'First Light' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Old Import' })).not.toBeInTheDocument();
    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'no-such-topic');
    expect(screen.getByText(/No sets match/)).toBeVisible();
  });
});
