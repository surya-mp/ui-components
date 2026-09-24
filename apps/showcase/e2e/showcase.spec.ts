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

test('showcase composes account settings from selectable sections', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Settings' }).click();

  await expect(page.getByText('Profile', { exact: true })).toBeVisible();
  await expect(page.getByText('Danger zone', { exact: true })).toBeVisible();
  await expect(page.getByText('API keys', { exact: true })).toBeVisible();
});

test('showcase renders keyboard-accessible advanced form primitives', async ({
  page,
}) => {
  await page.goto('/docs/forms');
  const role = page.getByRole('combobox', { name: 'Role' });
  await role.click();
  await page.getByRole('option', { name: 'Viewer' }).click();
  await expect(role).toHaveValue('Viewer');

  const bold = page.getByRole('button', { name: 'Bold' });
  await bold.click();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Advanced options' }).click();
  await expect(page.getByText('Extra configuration belongs here.')).toBeVisible();
});
