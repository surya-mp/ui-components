import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('showcase supports keyboard dialog flow without accessibility violations', async ({
  page,
}) => {
  await page.goto('/docs/overlays');
  await page.getByRole('button', { name: 'Fixed dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations).toEqual([]);
});
