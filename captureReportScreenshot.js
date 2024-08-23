const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testFileName = process.argv[2];  

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const reportUrl = 'http://localhost:9323';
    
    await page.goto(reportUrl);
    console.log('Navigated to Playwright report');

    await page.waitForLoadState('networkidle');
    console.log('Page fully loaded');

    const screenshotName = `${path.basename(testFileName, '.spec.js')}-spec-report.png`;
    const screenshotPath = path.join(__dirname, 'results', 'testResultsScreenshot', screenshotName);

    if (!fs.existsSync(path.dirname(screenshotPath))) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot taken and saved as ${screenshotPath}`);

    await browser.close();
})();
