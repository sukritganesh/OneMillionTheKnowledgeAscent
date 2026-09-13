import { describe, expect, it } from 'vitest';
import { questionMediaError, type QuestionMedia } from './questionMedia';
import { SAMPLE_PACK, rawPackFromStored } from '../app/packTransfer';
import { prepareCustomPackImport } from '../content';
import { gameQuestionFromNormalized, importedBundleFromNormalized, savedQuestionFromResolved, resolvedQuestionFromSaved } from '../app/adapters';
import { resolveQuestionWithSeed } from '../game/questionSelection';

export const imageFixture: QuestionMedia = { kind: 'image', src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=', mimeType: 'image/png', alt: 'A light square', credit: 'Test fixture', license: 'CC0', sourceUrl: 'https://example.org/fixture' };

describe('portable question media', () => {
  it('keeps legacy questions valid and bounds media arrays', () => {
    expect(questionMediaError(undefined)).toBeNull();
    expect(questionMediaError([imageFixture])).toBeNull();
    for (const value of [null, [], {}, [imageFixture, imageFixture, imageFixture, imageFixture]]) expect(questionMediaError(value)).not.toBeNull();
  });
  it.each(['https://example.org/tracker.png', '//example.org/x', 'javascript:alert(1)', '/question-media/../x.png', 'data:image/svg+xml;base64,PHN2Zy8+'])('rejects unsafe or remote sources: %s', (src) => {
    expect(questionMediaError([{ ...imageFixture, src }])).not.toBeNull();
  });
  it('checks type, bytes, attribution, descriptions and size', () => {
    for (const patch of [{ mimeType: 'video/mp4' }, { src: 'data:image/png;base64,SGVsbG8=' }, { src: 'data:image/png;base64,' + 'A'.repeat(1400000) }, { sourceUrl: 'javascript:alert(1)' }, { credit: '' }, { alt: '<script>' }, { kind: 'video', mimeType: 'video/mp4', src: 'data:video/mp4;base64,AAAAAGZ0eXBpc29t' }]) expect(questionMediaError([{ ...imageFixture, ...patch }])).not.toBeNull();
    expect(questionMediaError([{ ...imageFixture, kind: 'video', mimeType: 'video/mp4', description: 'A silent animation.', src: 'data:video/mp4;base64,AAAAAGZ0eXBpc29t' }])).toBeNull();
  });
  it('restricts bundled paths to trusted built-in content', () => {
    const media = [{ ...imageFixture, src: `/question-media/${'a'.repeat(64)}.png` }];
    expect(questionMediaError(media)).toBeNull();
    expect(questionMediaError(media, true)).not.toBeNull();
  });
  it('round-trips import, normalization, shuffle, saved snapshot and export without losing bytes', async () => {
    const pack = { ...SAMPLE_PACK, questions: [{ ...SAMPLE_PACK.questions[0], media: [imageFixture] }] };
    const imported = prepareCustomPackImport(pack);
    expect(imported.status).toBe('ready');
    const normalized = imported.payload!.pack;
    const resolved = resolveQuestionWithSeed(gameQuestionFromNormalized(normalized.questions[0]), 42).question;
    expect(resolved.media).toEqual([imageFixture]);
    expect(Object.isFrozen(resolved.media![0])).toBe(true);
    const saved = savedQuestionFromResolved(resolved);
    expect(resolvedQuestionFromSaved(JSON.parse(JSON.stringify(saved)))?.media).toEqual([imageFixture]);
    const bundle = await importedBundleFromNormalized(normalized);
    const exported = rawPackFromStored(bundle.pack as Parameters<typeof rawPackFromStored>[0], bundle.questions as Parameters<typeof rawPackFromStored>[1], []);
    expect(exported.questions[0].media).toEqual([imageFixture]);
    expect(prepareCustomPackImport(exported).status).toBe('ready');
    const invalid = { ...saved, media: [{ ...imageFixture, src: 'https://example.org/track' }] };
    expect(resolvedQuestionFromSaved(invalid)).toBeNull();
  });
  it('rejects invalid media atomically and applies the pack byte limit to object input too', () => {
    const pack = { ...SAMPLE_PACK, questions: [{ ...SAMPLE_PACK.questions[0], media: [{ ...imageFixture, src: 'https://example.org/track' }] }] };
    expect(prepareCustomPackImport(pack).payload).toBeNull();
    expect(prepareCustomPackImport({ ...SAMPLE_PACK, extra: 'x'.repeat(5 * 1024 * 1024) }).payload).toBeNull();
  });
});
