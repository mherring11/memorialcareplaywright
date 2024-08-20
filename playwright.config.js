const { devices } = require('@playwright/test');

module.exports = {
  use: {
    baseURL: 'https://www.memorialcare.org/providers',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'off',
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
    // {
    //   name: 'Mobile Safari',
    //   use: devices['iPhone 11'],
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: devices['Pixel 4'],
    // },
  ],
  reporter: [
    ['json', { outputFile: 'results/report.json' }],
    ['html', { outputFolder: 'results/', open: 'never' }]
  ]
};
