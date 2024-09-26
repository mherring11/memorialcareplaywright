const { devices } = require('@playwright/test');

const isMobileTest = process.env.TEST_FILE && process.env.TEST_FILE.includes('Mobile');

module.exports = {
  use: {
    baseURL: 'https://www.memorialcare.org/providers',
    headless: false,
    viewport: null,
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure', 
    trace: 'retain-on-failure',    
    retries: 2,
  },
  maxFailures: 0, 
  projects: isMobileTest
    ? [
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 4'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 13'] },
        },
      ]
    : [
        {
          name: 'Desktop Chrome',
          use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } },
        },
        {
          name: 'Desktop Safari',
          use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } },
        },
        {
          name: 'Desktop Firefox',
          use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } },
        },
      ],
  reporter: isMobileTest
    ? [
        ['json', { outputFile: 'results/mobile-report.json' }],
        ['html', { outputFolder: 'results/mobile', open: 'never' }],
      ]
    : [
        ['json', { outputFile: 'results/desktop-report.json' }],
        ['html', { outputFolder: 'results/desktop', open: 'never' }],
      ],
};
