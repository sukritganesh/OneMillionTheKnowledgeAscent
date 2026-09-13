import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SET_LIBRARY_ROOT, readSetFile, type SetLibraryManifest } from './set-library';
import { prepareSetRegistration } from './set-registration';

// Explicit arguments authorize inclusion; the build itself never auto-registers files.
const additions = process.argv.slice(2);
if (!additions.length) throw new Error('Usage: npm run register:sets -- relative/set-file.json [...]');
const manifestPath = path.join(SET_LIBRARY_ROOT, 'manifest.json');
const existing = JSON.parse(await readFile(manifestPath, 'utf8')) as SetLibraryManifest;
const registered = await prepareSetRegistration(existing, additions, readSetFile);
await writeFile(manifestPath, JSON.stringify(registered, null, 2) + '\n');
console.log(`Registered ${registered.files.length} curated set files. Review the manifest diff before committing.`);
