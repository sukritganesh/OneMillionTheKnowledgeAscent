import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { validateContentPack, parseJsonData } from '../../src/content/validators';
import { normalizePack } from '../../src/content/normalize';
import { createSerializedCatalog } from '../../src/content/catalog/createCatalog';
import { PRIMARY_CATEGORIES, type RawContentPack, type ValidationIssue } from '../../src/content/types';
import { folderPathError } from '../../src/content/folders';
import type { ContentPipelineResult } from './pipeline';

export const SET_LIBRARY_ROOT = path.resolve('content/sets');
export interface SetLibraryManifest {
  schemaVersion: 1;
  version: string;
  validatedAt: string;
  files: { path: string; packId: string; sha256: string }[];
}

export function safeSetFile(relative: string): string {
  if (!relative || relative.includes('\\') || relative.split('/').some((part) => !part || part === '.' || part === '..') ||
    !relative.endsWith('.json') || relative === 'manifest.json') throw new Error(`Invalid set file path: ${relative}`);
  const resolved = path.resolve(SET_LIBRARY_ROOT, relative);
  if (!resolved.startsWith(SET_LIBRARY_ROOT + path.sep)) throw new Error(`Unsafe set file path: ${relative}`);
  return resolved;
}

export async function readSetFile(relative: string) {
  const bytes = await readFile(safeSetFile(relative));
  const parsed = parseJsonData(bytes.toString('utf8'));
  const validated = validateContentPack(parsed.value, { origin: 'built-in', inputBytes: bytes.length, expectedContentType: 'curated-sets' });
  if (!parsed.valid || !validated.valid || !validated.value) throw new Error(`${relative}: ${[...parsed.errors, ...validated.errors].map((e) => e.message).join('; ')}`);
  const pack = validated.value;
  if (pack.sets.length !== 1 || pack.questions.length !== 15 || pack.questions.some((q) => q.usage.freshMix)) {
    throw new Error(`${relative}: each library file must contain one 15-question set and no Fresh Mix questions.`);
  }
  if (folderPathError(pack.sets[0].folderPath) || !pack.sets[0].folderPath?.length) throw new Error(`${relative}: built-in sets need a valid folderPath.`);
  return { bytes, pack, digest: createHash('sha256').update(bytes).digest('hex') };
}

async function discoverFiles(directory = SET_LIBRARY_ROOT, prefix = ''): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Set-library symlinks are not supported: ${relative}`);
    if (entry.isDirectory()) result.push(...await discoverFiles(path.join(directory, entry.name), relative + '/'));
    else if (entry.name.endsWith('.json') && relative !== 'manifest.json') result.push(relative);
  }
  return result.sort();
}

export async function buildSetLibrary(archive: ContentPipelineResult): Promise<ContentPipelineResult> {
  const manifest = JSON.parse(await readFile(path.join(SET_LIBRARY_ROOT, 'manifest.json'), 'utf8')) as SetLibraryManifest;
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files) || !/^\d+\.\d+\.\d+$/.test(manifest.version) || !Number.isFinite(Date.parse(manifest.validatedAt))) throw new Error('Invalid set library manifest.');
  const listed = manifest.files.map((entry) => entry.path);
  if (new Set(listed).size !== listed.length || new Set(manifest.files.map((entry) => entry.packId)).size !== listed.length) throw new Error('Duplicate library manifest entries.');
  if (JSON.stringify([...listed].sort()) !== JSON.stringify(await discoverFiles())) throw new Error('Set files and manifest differ. Register added/moved files explicitly with npm run register:sets.');
  const errors: ValidationIssue[] = [];
  const sets = [];
  const rawPacks: RawContentPack[] = [];
  const sourceFiles = archive.report.sourceIntegrity.sourceFiles.filter((file) => file.kind === 'pool');
  for (const entry of manifest.files) {
    const { pack, bytes, digest } = await readSetFile(entry.path);
    if (digest !== entry.sha256 || pack.id !== entry.packId) throw new Error(`${entry.path}: manifest identity or SHA-256 mismatch.`);
    const sourceFile = `content/sets/${entry.path}`;
    rawPacks.push(pack);
    sets.push(normalizePack(pack, { origin: 'built-in', sourceFile, enabled: true, sourceSha256: digest }));
    sourceFiles.push({ manifestPath: sourceFile, repositoryPath: sourceFile, packId: pack.id, kind: 'set', byteLength: bytes.length, utf8Bom: bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf, sourceSha256: digest, expectedSha256: entry.sha256, hashMatches: true, questionCount: 15, setCount: 1, categories: [...pack.categories] });
  }
  const packs = [...archive.packs.filter((pack) => pack.source.contentType === 'pool'), ...sets];
  const rawPoolPacks = await Promise.all(archive.report.sourceIntegrity.sourceFiles.filter((file) => file.kind === 'pool').map(async (file) => {
    const parsed = parseJsonData(await readFile(path.resolve('content/source/release-001', file.repositoryPath), 'utf8'));
    return parsed.value as RawContentPack;
  }));
  const activeRawPacks = [...rawPoolPacks, ...rawPacks];
  const signatures = (values: object[]) => {
    const counts = new Map<string, number>();
    for (const value of values) {
      const key = Object.keys(value).join(',');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts].map(([key, count]) => ({ keys: key.split(','), count }));
  };
  const allRawQuestions = activeRawPacks.flatMap((pack) => pack.questions);
  const schemaSignatures = {
    pack: signatures(activeRawPacks), question: signatures(allRawQuestions),
    choice: signatures(allRawQuestions.flatMap((question) => question.choices)),
    usage: signatures(allRawQuestions.map((question) => question.usage)),
    packMetadata: signatures(activeRawPacks.map((pack) => pack.metadata)),
    curatedSet: signatures(activeRawPacks.flatMap((pack) => pack.sets))
  };
  const catalog = createSerializedCatalog(packs, { releaseId: archive.manifest.id, releaseVersion: manifest.version, eligibilityDate: manifest.validatedAt });
  const questionById = new Map(catalog.questions.map((question) => [question.id, question]));
  const archivedQuestionById = new Map(archive.catalog.questions.map((question) => [question.id, question]));
  const setById = new Map(catalog.sets.map((set) => [set.id, set]));
  const prompts = catalog.questions.map((q) => q.prompt.trim().toLocaleLowerCase('en-US').replace(/\s+/g, ' '));
  if (new Set(prompts).size !== prompts.length) errors.push({ severity: 'error', code: 'duplicate-library-prompt', path: 'content/sets', message: 'Question prompts must be unique across the complete catalog.' });
  // The original set identities and gameplay content are a migration contract.
  for (const oldSet of archive.catalog.sets) {
    const next = setById.get(oldSet.id);
    if (!next || JSON.stringify(next.questionIds) !== JSON.stringify(oldSet.questionIds)) throw new Error(`Archived set identity/order changed: ${oldSet.id}`);
    for (const id of oldSet.questionIds) {
      const before = archivedQuestionById.get(id)!;
      const after = questionById.get(id);
      for (const key of ['level', 'category', 'prompt', 'choices', 'correctChoiceId', 'hint', 'explanation', 'usage'] as const) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after?.[key])) throw new Error(`Archived question changed: ${id}.${key}`);
      }
    }
  }
  const curated = catalog.questions.filter((q) => !q.usage.freshMix);
  const singleCategorySets = catalog.sets.filter((set) => new Set(set.questionIds.map((id) => questionById.get(id)!.category)).size === 1).length;
  const activeManifest = { ...archive.manifest, version: manifest.version, totals: { ...archive.manifest.totals, curatedSetFiles: sets.length, curatedSetQuestions: curated.length, curatedSets: sets.length, totalUniqueQuestions: catalog.questions.length }, files: [...archive.manifest.files.filter((file) => file.kind === 'pool'), ...manifest.files.map((entry, index) => ({ kind: 'set' as const, path: `content/sets/${entry.path}`, packId: entry.packId, questionCount: 15, categories: rawPacks[index].categories, sha256: entry.sha256, defaultEnabled: true }))], integrity: { ...archive.manifest.integrity, validatedAt: manifest.validatedAt } };
  const report = { ...archive.report, releaseVersion: manifest.version, validatedAt: manifest.validatedAt, valid: errors.length === 0, errors, archive: { manifest: 'content/source/release-001/manifests/manifest.json', report: archive.report }, sourceIntegrity: { algorithm: 'SHA-256' as const, allHashesMatch: true, sourceFiles }, totals: { ...archive.report.totals, sourceFiles: packs.length, curatedSetFiles: sets.length, questions: catalog.questions.length, curatedQuestions: curated.length, curatedSets: sets.length }, coverage: catalog.summary, releaseCoverage: { ...archive.report.releaseCoverage, curatedQuestionsPerCategory: Object.fromEntries(PRIMARY_CATEGORIES.map((category) => [category, curated.filter((q) => q.category === category).length])), allQuestionsPerLevel: catalog.summary.byLevel, singleCategorySets, mixedCategorySets: sets.length - singleCategorySets } };
  report.schemaSignatures = schemaSignatures;
  return { manifest: activeManifest, packs, catalog, report, release: { ...archive.release, version: manifest.version, sourceManifest: 'content/sets/manifest.json + content/source/release-001/manifests/manifest.json (pool)', sourceValidatedAt: manifest.validatedAt, sources: packs.map((pack) => pack.source), questions: catalog.questions, sets: catalog.sets } };
}
