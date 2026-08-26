import { expect, test } from '@playwright/test';

const pages = [
  '/',
  '/gestion_personnel.html',
  '/dematerialisation.html',
  '/covid.html',
  '/documents.html',
  '/cour_dappel.html',
  '/prestatech.html',
  '/others.html',
  '/en/',
  '/en/ihris-health-workforce.html',
  '/en/digital-hr-services.html',
  '/en/covid-test-authentication.html',
  '/en/digital-governance.html',
  '/en/election-results.html',
  '/en/banking-integrations.html',
  '/en/other-digital-solutions.html'
];

function monitorPage(page) {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => {
    if (request.url().startsWith('http://127.0.0.1:8767')) {
      errors.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
    }
  });
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:8767') && response.status() >= 400) {
      errors.push(`response: ${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

for (const pathname of pages) {
  test(`${pathname} loads without runtime or layout failures`, async ({ page }) => {
    const errors = monitorPage(page);
    const response = await page.goto(pathname, { waitUntil: 'load' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    const brokenImages = await page.locator('img').evaluateAll(async images => {
      const results = [];
      for (const image of images) {
        image.scrollIntoView({ block: 'center' });
        if (!image.complete) {
          await new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          });
        }
        if (image.naturalWidth === 0) results.push(image.currentSrc || image.src);
      }
      return results;
    });
    expect(brokenImages).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('language navigation opens the matching English home page', async ({ page }) => {
  await page.goto('/');
  await page.locator('.language-switch a[lang="en"]').click();
  await expect(page).toHaveURL(/\/en\/index\.html$/u);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('in-page navigation scrolls to the requested section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Découvrir les projets' }).click();
  await expect(page.locator('#realisations')).toBeInViewport();
});

test('mobile menu manages visibility, focus and Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.viewport.width > 800, 'Mobile navigation is only active at 800px and below.');
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  const navigation = page.locator('#navigation');
  await toggle.focus();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toHaveAttribute('aria-hidden', 'false');
  await expect(navigation).not.toHaveAttribute('inert', '');
  await expect(navigation.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toHaveAttribute('aria-hidden', 'true');
  await expect(navigation).toHaveAttribute('inert', '');
  await expect(toggle).toBeFocused();
});

test('reduced-motion users see reveal content immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const reveals = page.locator('.reveal');
  await expect(reveals.first()).toHaveClass(/\bis-visible\b/u);
  expect(await reveals.evaluateAll(elements => elements.every(element => element.classList.contains('is-visible')))).toBe(true);
});

test('video is loaded only after user activation', async ({ page }) => {
  await page.goto('/dematerialisation.html');
  const video = page.locator('[data-video]');
  await expect(video.locator('iframe')).toHaveCount(0);
  await video.getByRole('button').click();
  await expect(video.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/pWbGl4rHGRo/u);
});
