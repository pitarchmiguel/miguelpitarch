import { expect, test } from '@playwright/test';

test('portfolio, accessible menu and project pages work end to end', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Miguel Pitarch —');
  await expect(page.locator('.project-row')).toHaveCount(2);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#contenido')).toBeFocused();

  await page.locator('#trabajos').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Navegación', exact: true });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  await dialog.getByRole('link', { name: 'Trabajos', exact: true }).click();
  await expect(page).toHaveURL('/#trabajos');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

  await page.locator('.project-row').first().click();
  await expect(page).toHaveURL('/proyectos/palabrio');
  await expect(page.getByRole('heading', { name: 'Palabrio', exact: true })).toBeVisible();
  await expect(page.getByText('Una herramienta para aprender inglés.', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Siguiente proyecto QR Carta' }).click();
  await expect(page).toHaveURL('/proyectos/qr-carta');
  await expect(page.getByRole('heading', { name: 'QR Carta', exact: true })).toBeVisible();
  await expect(page.getByText('Aún sin enlace público')).toBeVisible();
  await page.getByRole('link', { name: 'Todos los proyectos' }).click();
  await expect(page).toHaveURL('/#trabajos');
  await expect(page.locator('.contact-options a').first()).toHaveAttribute('href', 'mailto:hello@miguelpitarch.com');
  expect(errors).toEqual([]);
});

test('responsive layouts load their visible imagery and preserve viewport width', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('.hero-portrait').evaluate((image: HTMLImageElement) => image.decode());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await page.locator('.contact-avatar').evaluate((image: HTMLImageElement) => image.decode());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('unknown projects return the custom 404', async ({ page }) => {
  const response = await page.goto('/proyectos/no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Por aquí no era.' })).toBeVisible();
  await page.getByRole('link', { name: 'Volver al inicio' }).click();
  await expect(page).toHaveURL('/');
});
