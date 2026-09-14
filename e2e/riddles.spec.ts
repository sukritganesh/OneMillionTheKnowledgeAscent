import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { RawContentPack } from '../src/content/types';

const slugs = ['hidden-in-plain-sight', 'the-midnight-detective', 'the-number-vault', 'the-rules-of-this-place'];
for (const slug of slugs) {
  const pack = JSON.parse(readFileSync(`content/sets/discovery/puzzles-and-games/riddles/${slug}.json`, 'utf8')) as RawContentPack;
  test(`browses Riddles and completes ${pack.title} offline at 1280x720`, async ({ page, context }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('button', { name: /Play as guest/i }).click();
    await page.getByRole('button', { name: /New game/i }).click();
    await page.getByLabel('Reduced motion').check();
    await page.getByRole('button', { name: /Choose a Set/i }).click();
    await page.getByRole('button', { name: 'Open folder Puzzles & Games', exact: true }).click();
    await page.getByRole('button', { name: 'Open folder Riddles', exact: true }).click();
    await expect(page.locator('.set-library__count')).toHaveText('4 sets');
    for (const title of ['Hidden in Plain Sight', 'The Midnight Detective', 'The Number Vault', 'The Rules of This Place']) {
      await expect(page.getByRole('button', { name: new RegExp(title) })).toBeVisible();
    }
    await page.getByRole('button', { name: new RegExp(pack.title) }).click();
    await page.getByRole('button', { name: /Continue/i }).click();
    await page.getByRole('button', { name: /^Begin Game$/i }).click();
    await page.getByRole('button', { name: /Begin Question 1/i }).click();
    const longest = [...pack.questions].sort((a, b) => b.prompt.length - a.prompt.length)[0].id;
    for (const q of pack.questions) {
      await expect(page.locator('#active-question')).toHaveText(q.prompt);
      if (q.id === longest) {
        await page.getByRole('button', { name: /^Hint/i }).click();
        await expect(page.getByLabel('Revealed hint')).toContainText(q.hint);
      }
      const fit = await page.locator('.gameplay-stage').evaluate((stage) => {
        const bounds = stage.getBoundingClientRect();
        const childBounds = [...stage.children].map((child) => child.getBoundingClientRect());
        const panel = stage.querySelector('.question-panel')!;
        const heading = stage.querySelector('#active-question')!;
        const p = panel.getBoundingClientRect(), h = heading.getBoundingClientRect();
        return { top: Math.min(...childBounds.map((b) => b.top)) - bounds.top, bottom: Math.max(...childBounds.map((b) => b.bottom)) - bounds.bottom, textFits: h.top >= p.top && h.bottom <= p.bottom && h.left >= p.left && h.right <= p.right, overflow: stage.scrollHeight - stage.clientHeight };
      });
      expect(fit.top).toBeGreaterThanOrEqual(-1);
      expect(fit.bottom).toBeLessThanOrEqual(1);
      expect(fit.textFits).toBe(true);
      expect(fit.overflow).toBeLessThanOrEqual(1);
      if (q.id === longest || q.level === 15) await page.screenshot({ path: `test-results/riddles-${slug}-${q.level}.png` });
      await page.locator(`[data-choice-id="${q.correctChoiceId}"]`).click();
      await page.getByRole('button', { name: /Lock In Answer/i }).click();
      await page.getByRole('button', { name: /Yes, Final Answer/i }).click();
      if (q.level < 15) {
        await expect(page.getByRole('heading', { name: /Correct/i })).toBeVisible();
        await page.getByRole('button', { name: new RegExp(`Continue to Question ${q.level + 1}`) }).click();
        await page.getByRole('button', { name: new RegExp(`Show question ${q.level + 1}`) }).click();
      }
    }
    await page.getByRole('button', { name: /Continue to results/i }).click();
    await expect(page.getByRole('heading', { name: 'ONE MILLION', exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Review answers/i }).click();
    await expect(page.locator('.review-item')).toHaveCount(15);
    await context.setOffline(false);
  });
}
