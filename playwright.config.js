// Import the devices from Playwright for defining mobile and desktop browser configurations
const { devices } = require('@playwright/test');

// Determine if the current test is a mobile test based on the environment variable TEST_FILE
// This will be used to conditionally configure the test settings.
const isMobileTest = process.env.TEST_FILE && process.env.TEST_FILE.includes('Mobile');

// Export the Playwright configuration object
module.exports = {
  use: {
    // Set the base URL for the test, which is the MemorialCare providers page
    baseURL: 'https://www.memorialcare.org/providers',
    
    // Do not run the browser in headless mode (i.e., the browser window will be visible)
    headless: false,
    
    // Disable the viewport setting (default viewports will be applied based on the browser/device)
    viewport: null,

    // Ignore HTTPS errors (useful for testing on staging servers with invalid certificates)
    ignoreHTTPSErrors: true,

    // Disable video recording of tests (useful to save resources)
    video: 'off',

    // Take screenshots only when a test fails
    screenshot: 'only-on-failure', 

    // Retain the trace file for debugging only when a test fails
    trace: 'retain-on-failure',    
    
    // Retry failed tests up to 2 times to handle flaky test failures
    retries: 2,
  },

  // Set the maximum number of test failures allowed before stopping the entire test run
  // A value of 0 means no limit (continue running tests even if there are failures)
  maxFailures: 0, 

  // Conditionally define the projects (test configurations) based on whether it is a mobile test
  projects: isMobileTest
    ? [
        {
          // Define a mobile test project for Google Chrome on a Pixel 4 device
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 4'] }, // Use Playwright's predefined settings for Pixel 4
        },
        {
          // Define a mobile test project for Safari on an iPhone 13 device
          name: 'Mobile Safari',
          use: { ...devices['iPhone 13'] }, // Use Playwright's predefined settings for iPhone 13
        },
      ]
    : [
        {
          // Define a desktop test project for Google Chrome on a desktop (Chromium)
          name: 'Desktop Chrome',
          use: { browserName: 'chromium', viewport: { width: 1280, height: 720 } }, // Set custom viewport size for desktop
        },
        {
          // Define a desktop test project for Safari on a desktop (WebKit)
          name: 'Desktop Safari',
          use: { browserName: 'webkit', viewport: { width: 1280, height: 720 } }, // Set custom viewport size for desktop
        },
        {
          // Define a desktop test project for Firefox on a desktop
          name: 'Desktop Firefox',
          use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } }, // Set custom viewport size for desktop
        },
      ],

  // Conditionally define the test reporters (for results) based on whether it is a mobile test
  reporter: isMobileTest
    ? [
        // For mobile tests, save the results in JSON format and generate an HTML report in the 'results/mobile' folder
        ['json', { outputFile: 'results/mobile-report.json' }],
        ['html', { outputFolder: 'results/mobile', open: 'never' }],
      ]
    : [
        // For desktop tests, save the results in JSON format and generate an HTML report in the 'results/desktop' folder
        ['json', { outputFile: 'results/desktop-report.json' }],
        ['html', { outputFolder: 'results/desktop', open: 'never' }],
      ],
};