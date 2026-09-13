import { describe, expect, it, vi } from 'vitest';
import { prepareSetRegistration, type SetRegistrationReader } from '../../scripts/content/set-registration';
import type { SetLibraryManifest } from '../../scripts/content/set-library';

const pinned = { path: 'old/original.json', packId: 'builtin-original', sha256: 'a'.repeat(64) };
const added = { path: 'new/addition.json', packId: 'builtin-addition', sha256: 'b'.repeat(64) };

function manifest(): SetLibraryManifest {
  return { schemaVersion: 1, version: '2.0.0', validatedAt: '2026-09-13T00:00:00Z', files: [{ ...pinned }] };
}

function readerFor(entries: SetLibraryManifest['files']) {
  return vi.fn<SetRegistrationReader>(async (relative) => {
    const entry = entries.find((file) => file.path === relative);
    if (!entry) throw new Error(`Missing file: ${relative}`);
    return { pack: { id: entry.packId }, digest: entry.sha256 };
  });
}

describe('explicit set registration', () => {
  it('moves a stable pack without reading its missing old path', async () => {
    const original = manifest();
    const moved = { ...pinned, path: 'new/original.json', sha256: 'c'.repeat(64) };
    const read = readerFor([moved]);

    const result = await prepareSetRegistration(original, [moved.path], read);

    expect(result.files).toEqual([moved]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(moved.path);
    expect(original).toEqual(manifest());
  });

  it('rejects unrelated changed bytes instead of refreshing their pinned hash', async () => {
    const original = manifest();
    const changed = { ...pinned, sha256: 'c'.repeat(64) };
    const read = readerFor([changed, added]);

    await expect(prepareSetRegistration(original, [added.path], read))
      .rejects.toThrow(`${pinned.path} changed without being explicitly registered`);
    expect(original).toEqual(manifest());
  });

  it('also rejects an unrelated identity change even when the supplied hash matches', async () => {
    const changed = { ...pinned, packId: 'builtin-unexpected' };

    await expect(prepareSetRegistration(manifest(), [added.path], readerFor([changed, added])))
      .rejects.toThrow('changed without being explicitly registered');
  });

  it('rejects two explicitly supplied paths with the same pack ID', async () => {
    const duplicate = { ...added, path: 'another/addition.json' };

    await expect(prepareSetRegistration(manifest(), [added.path, duplicate.path], readerFor([pinned, added, duplicate])))
      .rejects.toThrow(`Duplicate pack ID in explicitly registered files: ${added.packId}`);
  });

  it('adds a new pack while retaining unrelated pins and release metadata', async () => {
    const original = manifest();
    const result = await prepareSetRegistration(original, [added.path], readerFor([pinned, added]));

    expect(result).toEqual({ ...original, files: [added, pinned] });
    expect(result.files.find((file) => file.path === pinned.path)).toEqual(pinned);
    expect(original).toEqual(manifest());
  });

  it('refreshes an explicitly named existing file without accepting unrelated edits', async () => {
    const changed = { ...pinned, sha256: 'c'.repeat(64) };
    const read = readerFor([changed]);

    expect((await prepareSetRegistration(manifest(), [pinned.path], read)).files).toEqual([changed]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(pinned.path);
  });

  it('deduplicates repeated arguments without treating them as separate pack copies', async () => {
    const read = readerFor([pinned]);

    expect((await prepareSetRegistration(manifest(), [pinned.path, pinned.path], read)).files).toEqual([pinned]);
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(pinned.path);
  });

  it('does not mutate the manifest if reading an explicit addition fails', async () => {
    const original = manifest();

    await expect(prepareSetRegistration(original, ['missing.json'], readerFor([pinned])))
      .rejects.toThrow('Missing file: missing.json');
    expect(original).toEqual(manifest());
  });
});
