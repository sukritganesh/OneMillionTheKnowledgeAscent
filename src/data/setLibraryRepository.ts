import type { IDBPDatabase } from 'idb';
import { folderPathError } from '../content/folders';
import type { AppDatabase } from './types';

export interface SetPlacement { setId: string; folderPath: string[] }
export const SET_LIBRARY_KEY = 'setLibrary.v1';

/** Uses the existing extensible metadata store; old databases and backups need no migration. */
export class SetLibraryRepository {
  constructor(private readonly database: IDBPDatabase<AppDatabase>) {}

  async list(): Promise<SetPlacement[]> {
    const record = await this.database.get('metadata', SET_LIBRARY_KEY);
    return decodePlacements(record?.value);
  }

  async move(setId: string, folderPath: string[]): Promise<SetPlacement[]> {
    if (!setId || setId.length > 257) throw new Error('Invalid set identity.');
    const error = folderPathError(folderPath);
    if (error) throw new Error(error);
    const tx = this.database.transaction('metadata', 'readwrite');
    const placements = decodePlacements((await tx.store.get(SET_LIBRARY_KEY))?.value);
    const next = [...placements.filter((item) => item.setId !== setId), { setId, folderPath: [...folderPath] }];
    await tx.store.put({ key: SET_LIBRARY_KEY, value: { version: 1, placements: next.map((item) => ({ setId: item.setId, folderPath: item.folderPath })) } });
    await tx.done;
    return next;
  }
}

function decodePlacements(value: unknown): SetPlacement[] {
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 ||
    !('placements' in value) || !Array.isArray(value.placements)) return [];
  return value.placements.filter((item): item is SetPlacement =>
    item && typeof item === 'object' && typeof item.setId === 'string' && !folderPathError(item.folderPath)
  ).map((item) => ({ setId: item.setId, folderPath: [...item.folderPath] }));
}
