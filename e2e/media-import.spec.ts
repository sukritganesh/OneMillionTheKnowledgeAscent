import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { RawContentPack } from '../src/content/types';

test('imports and exports embedded media, then resumes video offline after removing its pack', async ({ page, context }) => {
  test.setTimeout(90_000);
  const source = JSON.parse(readFileSync('content/sets/science/space/moonlight-and-shadows.json', 'utf8')) as RawContentPack;
  const video = source.questions[4].media![0];
  const embedded = { ...video, src: `data:${video.mimeType};base64,${readFileSync('public' + video.src).toString('base64')}` };
  const pack: RawContentPack = {
    ...source, id: 'portable-video-test', title: 'Portable Video Test',
    questions: source.questions.map((q, i) => ({ ...q, id: `q-${i + 1}`, media: i === 0 ? [embedded] : undefined, usage: { freshMix: false, setIds: ['ladder'] } })),
    sets: [{ ...source.sets[0], id: 'ladder', title: 'Portable Video Ladder', questionIds: source.questions.map((_, i) => `q-${i + 1}`) }]
  };
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.getByRole('button', { name: /Play as guest/i }).click();
  await page.getByRole('button', { name: 'Question packs', exact: true }).click();
  await page.getByRole('button', { name: /Import & templates/ }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: 'portable.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(pack)) });
  await page.getByRole('button', { name: 'Validate & preview', exact: true }).click();
  await page.getByRole('button', { name: 'Import entire pack', exact: true }).click();
  await page.getByRole('button', { name: /Library Built-in/ }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.content-pack-card').filter({ hasText: 'Portable Video Test' }).getByRole('button', { name: 'Export', exact: true }).click();
  const downloaded = await downloadEvent;
  const exported = JSON.parse(readFileSync((await downloaded.path())!, 'utf8')) as RawContentPack;
  expect(exported.questions[0].media).toEqual([embedded]);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: /New game/i }).click();
  await page.getByRole('radio', { name: 'Include my enabled packs' }).click();
  await page.getByRole('button', { name: /Choose a Set/i }).click();
  await page.getByRole('searchbox', { name: 'Search all sets' }).fill('Portable Video Ladder');
  await page.getByRole('button', { name: /Portable Video Ladder/ }).click();
  await page.getByRole('button', { name: /Continue/i }).click();
  await page.getByRole('button', { name: /^Begin Game$/i }).click();
  await page.getByRole('button', { name: /Begin Question 1/i }).click();
  const player = page.locator('video');
  await expect.poll(() => player.evaluate((v) => (v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
  await player.evaluate((v) => (v as HTMLVideoElement).play());
  await expect.poll(() => player.evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
  await page.getByRole('button', { name: /Pause game/i }).click();
  await page.getByRole('button', { name: 'Save and exit', exact: true }).click();
  await page.getByRole('button', { name: 'Question packs', exact: true }).click();
  await page.locator('.content-pack-card').filter({ hasText: 'Portable Video Test' }).getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('button', { name: 'Remove pack', exact: true }).click();
  await expect(page.locator('.content-pack-card').filter({ hasText: 'Portable Video Test' })).toHaveCount(0);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: /Play as guest/i }).click();
  await page.getByRole('button', { name: /Saved game/i }).click();
  await page.getByRole('button', { name: 'Resume game', exact: true }).click();
  await expect(page.locator('#active-question')).toHaveText(pack.questions[0].prompt);
  await expect.poll(() => player.evaluate((v) => (v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
  await player.evaluate((v) => (v as HTMLVideoElement).play());
  await expect.poll(() => player.evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
  await context.setOffline(false);
});
