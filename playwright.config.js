// playwright.config.js
const { devices } = require('@playwright/test');

module.exports = {
  use: {
    baseURL: 'https://www.memorialcare.org/providers',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Desktop Safari',
      use: { browserName: 'webkit' },
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 11'],
    },
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 4'],
    },
  ],

};
