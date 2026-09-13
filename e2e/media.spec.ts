import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { RawContentPack } from '../src/content/types';

const sets = ['culture/visual-arts/closer-look-art', 'science/earth-sky/earth-from-above', 'science/space/moonlight-and-shadows'];
for (const file of sets) {
  const pack = JSON.parse(readFileSync(`content/sets/${file}.json`, 'utf8')) as RawContentPack;
  test(`plays every question in ${pack.title}, with offline media and bounded layout`, async ({ page, context, baseURL }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    const external: string[] = [];
    page.on('request', (request) => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url()); });
    await page.goto('/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('button', { name: /Play as guest/i }).click();
    await page.getByRole('button', { name: /New game/i }).click();
    await page.getByLabel('Reduced motion').check();
    await page.getByRole('button', { name: /Choose a Set/i }).click();
    await page.getByRole('searchbox', { name: 'Search all sets' }).fill(pack.title);
    await page.getByRole('button', { name: new RegExp(pack.title) }).click();
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /^Begin Game$/i }).click();
    await page.getByRole('button', { name: /Begin Question 1/i }).click();
    for (const question of pack.questions) {
      await expect(page.locator('#active-question')).toHaveText(question.prompt);
      for (const [i, media] of (question.media ?? []).entries()) {
        if (question.media!.length > 1) await page.locator('.question-media__navigation').getByRole('button', { name: String(i + 1), exact: true }).click();
        await expect(page.getByRole('link', { name: 'Source', exact: true })).toHaveCount(0);
        if (media.kind === 'image') {
          await expect.poll(() => page.locator('.question-media__image img').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
          await page.getByRole('button', { name: 'Enlarge question image' }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible();
          expect((await dialog.boundingBox())!.width).toBeGreaterThan(600);
          await page.keyboard.press('a');
          await expect(page.locator('[data-state="selected"]')).toHaveCount(0);
          await page.keyboard.press('Escape');
          await expect(dialog).toHaveCount(0);
        } else {
          const video = page.locator('video');
          await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
          await expect(video).not.toHaveAttribute('autoplay');
          await video.evaluate((v) => (v as HTMLVideoElement).play());
          await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
          await video.evaluate((v) => { (v as HTMLVideoElement).currentTime = Math.min(3, (v as HTMLVideoElement).duration / 2); });
          await page.screenshot({ path: `test-results/${pack.id}-q${question.level}-video.png` });
          await page.getByRole('button', { name: /Pause game/i }).click();
          await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
          await page.getByRole('button', { name: 'Resume game', exact: true }).click();
        }
      }
      const bounds = await page.locator('.gameplay-stage').evaluate((stage) => {
        const box = stage.getBoundingClientRect();
        const children = [...stage.children].map((child) => child.getBoundingClientRect());
        return { top: Math.min(...children.map((c) => c.top)) - box.top, bottom: Math.max(...children.map((c) => c.bottom)) - box.bottom };
      });
      expect(bounds.top).toBeGreaterThanOrEqual(-1);
      expect(bounds.bottom).toBeLessThanOrEqual(1);
      if (question.level === 1 || (question.media?.length ?? 0) > 1) await page.screenshot({ path: `test-results/${pack.id}-q${question.level}.png` });
      await page.locator(`[data-choice-id="${question.correctChoiceId}"]`).click();
      await page.getByRole('button', { name: /Lock In Answer/i }).click();
      await page.getByRole('button', { name: /Yes, Final Answer/i }).click();
      if (question.level < 15) {
        await expect(page.getByRole('heading', { name: /Correct/i })).toBeVisible();
        if (question.media) await expect(page.getByRole('link', { name: 'Source', exact: true })).toBeVisible();
        await page.getByRole('button', { name: new RegExp(`Continue to Question ${question.level + 1}`) }).click();
        await page.getByRole('button', { name: new RegExp(`Show question ${question.level + 1}`) }).click();
      }
    }
    expect(external).toEqual([]);
    await context.setOffline(false);
  });
}
