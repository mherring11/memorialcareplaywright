// Import the required modules from Playwright and Node.js
const { chromium } = require('playwright'); // For launching and controlling Chromium browser
const path = require('path');               // For handling and manipulating file paths
const fs = require('fs');                   // For interacting with the file system

// The first command-line argument (testFileName) is the name of the test file passed when executing the script
const testFileName = process.argv[2];  

// Immediately-invoked async function to allow the use of `await` for asynchronous operations
(async () => {
    // Launch a Chromium browser instance
    const browser = await chromium.launch();

    // Create a new page (tab) in the browser
    const page = await browser.newPage();

    // Define the URL of the Playwright report server (running on localhost:9323)
    const reportUrl = 'http://localhost:9323';
    
    // Navigate the page to the report URL
    await page.goto(reportUrl);
    console.log('Navigated to Playwright report');

    // Wait for the page to reach a network idle state, ensuring all content is fully loaded
    await page.waitForLoadState('networkidle');
    console.log('Page fully loaded');

    // Create the name for the screenshot file, based on the test file name passed as an argument
    const screenshotName = `${path.basename(testFileName, '.spec.js')}-spec-report.png`;

    // Define the full path where the screenshot will be saved
    const screenshotPath = path.join(__dirname, 'results', 'testResultsScreenshot', screenshotName);

    // Check if the directory where the screenshot should be saved exists, if not, create it
    if (!fs.existsSync(path.dirname(screenshotPath))) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true }); // Create the directory and any parent directories as needed
    }

    // Capture a full-page screenshot and save it to the specified path
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot taken and saved as ${screenshotPath}`);

    // Close the browser to clean up resources
    await browser.close();
})();