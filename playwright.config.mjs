import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'site.spec.mjs',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: 'output/playwright/report' }]
  ],
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: 'http://127.0.0.1:8767',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/server.mjs',
    url: 'http://127.0.0.1:8767',
    reuseExistingServer: false,
    timeout: 10_000
  },
  projects: [
    { name: 'desktop-1440', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'tablet-768', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 } } },
    { name: 'mobile-390', use: { browserName: 'chromium', viewport: { width: 390, height: 844 } } },
    { name: 'mobile-320', use: { browserName: 'chromium', viewport: { width: 320, height: 568 } } }
  ]
});
