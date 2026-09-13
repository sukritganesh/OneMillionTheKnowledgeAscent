import type { SetLibraryManifest } from './set-library';

export type SetRegistrationReader = (relative: string) => Promise<{
  pack: { id: string };
  digest: string;
}>;

/** Prepare a manifest update without writing it or changing the caller's manifest. */
export async function prepareSetRegistration(
  existing: SetLibraryManifest,
  additions: readonly string[],
  readSet: SetRegistrationReader
): Promise<SetLibraryManifest> {
  const explicitPaths = new Set(additions);
  if (!explicitPaths.size) throw new Error('At least one set file must be explicitly registered.');

  const explicitPackIds = new Set<string>();
  const registered: SetLibraryManifest['files'] = [];
  for (const relative of explicitPaths) {
    const file = await readSet(relative);
    if (explicitPackIds.has(file.pack.id)) {
      throw new Error(`Duplicate pack ID in explicitly registered files: ${file.pack.id}`);
    }
    explicitPackIds.add(file.pack.id);
    registered.push({ path: relative, packId: file.pack.id, sha256: file.digest });
  }

  // The same stable pack at a new path replaces its old location before any
  // unchanged files are read, so a move need not leave the old file behind.
  const pinned = existing.files.filter(
    (entry) => !explicitPaths.has(entry.path) && !explicitPackIds.has(entry.packId)
  );
  for (const entry of pinned) {
    const file = await readSet(entry.path);
    if (file.digest !== entry.sha256 || file.pack.id !== entry.packId) {
      throw new Error(`${entry.path} changed without being explicitly registered. Its pinned manifest entry was not updated.`);
    }
  }

  const files = [...pinned, ...registered].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  if (new Set(files.map((entry) => entry.path)).size !== files.length ||
      new Set(files.map((entry) => entry.packId)).size !== files.length) {
    throw new Error('Duplicate library manifest entries.');
  }
  return { ...existing, files };
}
