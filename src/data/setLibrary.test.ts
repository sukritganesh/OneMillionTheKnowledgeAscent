import { afterEach, describe, expect, it } from 'vitest';
import { createDataRepositories, deleteAppDatabase, type DataRepositories } from './index';
import { folderPathError, parseFolderInput } from '../content/folders';

let repos: DataRepositories | undefined;
const name = 'set-library-tests';
afterEach(async () => { repos?.close(); await deleteAppDatabase(name); });

describe('set-library placement persistence', () => {
  it('starts empty on old databases, preserves IDs when moved, and round-trips full backups', async () => {
    repos = await createDataRepositories({ name });
    expect(await repos.setLibrary.list()).toEqual([]);
    const originalProfiles = await repos.profiles.list();
    await repos.setLibrary.move('builtin-set-astronomy-01', ['My collection', 'Space']);
    await repos.setLibrary.move('builtin-set-astronomy-01', ['Favourites']);
    expect(await repos.setLibrary.list()).toEqual([{ setId: 'builtin-set-astronomy-01', folderPath: ['Favourites'] }]);
    const backup = await repos.backup.export();
    await repos.setLibrary.move('builtin-set-astronomy-01', []);
    await repos.backup.restore(backup);
    expect(await repos.setLibrary.list()).toEqual([{ setId: 'builtin-set-astronomy-01', folderPath: ['Favourites'] }]);
    expect(await repos.profiles.list()).toEqual(originalProfiles);
    repos.close();
    repos = await createDataRepositories({ name });
    expect((await repos.setLibrary.list())[0].folderPath).toEqual(['Favourites']);
  });

  it('rejects unsafe folder paths without changing the saved placement', async () => {
    repos = await createDataRepositories({ name });
    await expect(repos.setLibrary.move('set', ['..', 'Other'])).rejects.toThrow();
    expect(await repos.setLibrary.list()).toEqual([]);
    expect(parseFolderInput('Science / Space')).toEqual(['Science', 'Space']);
    expect(parseFolderInput(' ')).toEqual([]);
    for (const input of [['a/b'], ['a\\b'], ['<script>'], [''], Array(7).fill('Folder'), ['__proto__']]) expect(folderPathError(input)).not.toBeNull();
  });
});
