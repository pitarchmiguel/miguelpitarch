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

test('motion can be paused and respects reduced-motion preferences', async ({ page }) => {
  await page.goto('/');
  const track = page.locator('.name-track');
  await expect(track).toHaveAttribute('data-ready', 'true');
  const pause = page.getByRole('button', { name: 'Pausar movimiento del nombre' });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Reanudar movimiento del nombre' })).toHaveAttribute('aria-pressed', 'true');
  expect(await track.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('paused');
  await page.getByRole('button', { name: 'Reanudar movimiento del nombre' }).click();
  expect(await track.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('running');
  await page.locator('#trabajos').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-row').first()).toHaveClass(/is-revealed/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pause).toBeHidden();
  expect(await track.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.locator('.motion-reveal')).toHaveCount(0);
  await page.locator('.project-row').first().click();
  await expect(page).toHaveURL('/proyectos/palabrio');
  await page.getByRole('link', { name: 'Todos los proyectos' }).click();
  await expect(page).toHaveURL('/#trabajos');
  expect(await track.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('video project preview follows the mouse and switches artwork, with a touch fallback', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.locator('#trabajos').scrollIntoViewIfNeeded();
  const picture = page.locator('.floating-project-image');
  if (isMobile) {
    await expect(picture).toBeHidden();
    await expect(page.locator('.project-row .project-cover').first()).toBeVisible();
    return;
  }
  const first = page.locator('.project-row').first();
  await expect(first).toHaveClass(/is-revealed/);
  const bounds = await first.boundingBox();
  if (!bounds) throw new Error('Missing project row');
  const x = bounds.x + bounds.width - 45, y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await expect(picture).toHaveClass(/is-active/);
  await expect(picture).toHaveAttribute('data-project', 'palabrio');
  await expect.poll(async () => Math.abs(await picture.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41) - x)).toBeLessThan(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.project-row').nth(1).hover();
  await expect(picture).toHaveAttribute('data-project', 'qr-carta');
  await expect(page.locator('.preview-strip')).toHaveAttribute('style', /translateY\(-100%\)/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(picture).toBeHidden();
  await expect(page.locator('.work-list')).not.toHaveClass(/has-floating-preview/);
});

test('scroll reverses the name and controls the desktop footer curve', async ({ page, isMobile }) => {
  await page.goto('/');
  const track = page.locator('.name-track');
  await expect(track).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => scrollTo(0, 250));
  await page.waitForTimeout(450);
  await page.evaluate(() => scrollTo(0, 100));
  await expect.poll(() => track.evaluate(element => element.getAnimations()[0]?.playbackRate)).toBe(-1);
  await page.evaluate(() => scrollTo(0, 350));
  await expect.poll(() => track.evaluate(element => element.getAnimations()[0]?.playbackRate)).toBe(1);
  if (!isMobile) {
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await expect(page.locator('#contacto')).toHaveAttribute('data-scroll-motion', 'true');
    expect(await page.locator('#contacto').evaluate(element => element.style.getPropertyValue('--footer-curve'))).toMatch(/px$/);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await track.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.locator('[data-scroll-motion]')).toHaveCount(0);
});
