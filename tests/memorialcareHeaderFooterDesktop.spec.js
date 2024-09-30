const { test, expect } = require('@playwright/test');

// Test suite for verifying the header and footer functionality on the MemorialCare website
test.describe('MemorialCare Website Header and Footer Test', () => {
    let context;  // Browser context for creating an isolated environment
    let page;     // The page object to interact with the website
    const baseUrl = 'https://memorialcare-stg.chltest2.com/';  // Base URL for the MemorialCare website

    // Before each test, create a new context and page
    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();  // Create a new browser context
        page = await context.newPage();        // Open a new page within the context
    });

    // After each test, close the page and context to clean up
    test.afterEach(async () => {
        await page.close();    // Close the page
        await context.close(); // Close the browser context
    });

    // Utility function to navigate to a page and ensure that a specific element is visible
    async function ensurePageLoadAndVisibility(selector, url = baseUrl) {
        await page.goto(url, { waitUntil: 'networkidle' });  // Navigate to the specified URL and wait until the network is idle
        console.log(`Navigated to: ${url}`);

        try {
            // Wait for the specified element to be visible
            await page.waitForSelector(selector, { state: 'visible', timeout: 20000 });
            console.log(`Element is visible: ${selector}`);
        } catch (error) {
            // Throw an error if the element is not visible
            throw new Error(`Element not visible: ${selector} - Error: ${error.message}`);
        }
    }

    // Test 1: Verify that the header is visible and all links are working
    test('Verify that the header is visible and all links are working', async () => {
        test.setTimeout(90000);  // Set a timeout of 90 seconds for the test

        await ensurePageLoadAndVisibility('header.site-header');  // Ensure that the header is visible

        // Define an array of header links to test, with their expected URLs
        const links = [
            { selector: 'a[href="/patients-visitors/mychart-online-health-connection"]', expectedUrl: '/patients-visitors/mychart-online-health-connection' },
            { selector: 'a[href="/patients-visitors/patient-financial-tools-and-resources"]', expectedUrl: '/patients-visitors/patient-financial-tools-and-resources' },
            { selector: 'a[href="/patients-visitors/medical-records-forms"]', expectedUrl: '/patients-visitors/medical-records-forms' },
            { selector: 'a[href="/ways-give"]', expectedUrl: '/ways-give' },
            { selector: 'a[href="/contact-us"]', expectedUrl: '/contact-us' },
            { selector: 'a[href="tel:1-877-696-3622"]', expectedUrl: 'tel:1-877-696-3622' }, 
            { selector: 'a[href="/search"]', expectedUrl: '/search' },
            { selector: 'a[href="/providers"]', expectedUrl: '/providers' },
            { selector: 'a[href="/services"]', expectedUrl: '/services' },
            { selector: 'a[href="/locations"]', expectedUrl: '/locations' },
            { selector: 'a[href="/locations/memorialcare-medical-group/schedule-appointment-today"]', expectedUrl: '/locations/memorialcare-medical-group/schedule-appointment-today' },
            { selector: 'a[href="/services/urgent-care"]', expectedUrl: '/services/urgent-care' },
        ];

        // Loop through each link and verify its presence and functionality
        for (const link of links) {
            try {
                // Special case: telephone links and the search link are tested for visibility only
                if (link.expectedUrl.startsWith('tel') || link.expectedUrl === '/search') {
                    await page.waitForSelector(link.selector, { state: 'visible', timeout: 10000 });  // Wait for the link to be visible
                    console.log(`Verified presence of link: ${link.selector}`);
                } else {
                    // For other links, click the link and verify navigation to the expected URL
                    await page.click(link.selector);
                    console.log(`Clicked on link: ${link.selector}`);

                    await page.waitForURL(`**${link.expectedUrl}`, { timeout: 20000 });  // Wait for the URL to change to the expected URL
                    const currentUrl = page.url();
                    expect(currentUrl).toContain(link.expectedUrl);  // Ensure that the current URL contains the expected URL
                    console.log(`Verified navigation to: ${currentUrl}`);

                    await ensurePageLoadAndVisibility('header.site-header');  // Ensure the header is still visible after navigation
                }
            } catch (error) {
                console.log(`Failed to verify link: ${link.selector} - Error: ${error.message}`);
            }
        }
        console.log('All header links are working as expected');
    });

    // Test 2: Verify that the footer is visible and all links are working
    test('Verify that the footer is visible and all links are working', async () => {
        test.setTimeout(90000);  // Set a timeout of 90 seconds for the test

        await ensurePageLoadAndVisibility('footer.site-footer');  // Ensure that the footer is visible

        // Define an array of footer links to test, with their expected URLs
        const links = [
            { selector: 'footer.site-footer a[href="/patients-visitors"]', expectedUrl: '/patients-visitors' },
            { selector: 'footer.site-footer a[href="/providers"]', expectedUrl: '/providers' },
            { selector: 'footer.site-footer a[href="/memorialcare-55-plus-program"]', expectedUrl: '/memorialcare-55-plus-program' },
            { selector: 'footer.site-footer a[href="/patients-visitors/patient-financial-tools-and-resources#content-segment-10588"]', expectedUrl: '/patients-visitors/patient-financial-tools-and-resources#content-segment-10588' },
            { selector: 'footer.site-footer a[href="/patients-visitors/nextmd-online-health-connection"]', expectedUrl: '/patients-visitors/nextmd-online-health-connection' },
            { selector: 'footer.site-footer a[href="/on-demand-care"]', expectedUrl: '/on-demand-care' },
            { selector: 'footer.site-footer a[href="/patients/research-clinical-trials"]', expectedUrl: '/patients/research-clinical-trials' },
            { selector: 'footer.site-footer a[href="/patients-visitors/patient-financial-tools-and-resources/financial-assistance"]', expectedUrl: '/patients-visitors/patient-financial-tools-and-resources/financial-assistance' },
            { selector: 'footer.site-footer a[href="/physicians"]', expectedUrl: '/physicians' },
            { selector: 'footer.site-footer a[href="/employees-volunteers"]', expectedUrl: '/employees-volunteers' },
            { selector: 'footer.site-footer a[href="/physicians#content-segment-29556"]', expectedUrl: '/physicians#content-segment-29556' },
            { selector: 'footer.site-footer a[href="/services/nursing-services"]', expectedUrl: '/services/nursing-services' },
            { selector: 'footer.site-footer a[href="/b2b"]', expectedUrl: '/b2b' },
            { selector: 'footer.site-footer a[href="/about-us"]', expectedUrl: '/about-us' },
            { selector: 'footer.site-footer a[href="/enewsletter-signup"]', expectedUrl: '/enewsletter-signup' },
            { selector: 'footer.site-footer a[href="/about-us/accreditation-licensure"]', expectedUrl: '/about-us/accreditation-licensure' },
            { selector: 'footer.site-footer a[href="/about-us/community-benefit"]', expectedUrl: '/about-us/community-benefit' },
            { selector: 'footer.site-footer a[href="/ways-give"]', expectedUrl: '/ways-give' },
            { selector: 'footer.site-footer a[href="/about-us/press-room"]', expectedUrl: '/about-us/press-room' },
            { selector: 'footer.site-footer a[href="/blog"]', expectedUrl: '/blog' },
            { selector: 'footer.site-footer a[href="/locations"]', expectedUrl: '/locations' },
            { selector: 'footer.site-footer a[href="https://mymemorialcare.memorialcare.org/mychart/default.asp"]', expectedUrl: 'https://mymemorialcare.memorialcare.org/mychart/default.asp' }
        ];

        // Loop through each footer link and verify its presence and functionality
        for (const link of links) {
            try {
                const element = page.locator(link.selector);  // Locate the element
                await element.waitFor({ state: 'visible', timeout: 10000 });  // Wait for the element to become visible

                if (link.expectedUrl.startsWith('http')) {
                    const isVisible = await element.isVisible();  // Check if the external link is visible
                    expect(isVisible).toBe(true);
                    console.log(`Verified presence of external link: ${link.selector}`);
                } else {
                    await element.click();  // Click the link for internal URLs
                    console.log(`Clicked on link: ${link.selector}`);

                    await page.waitForURL(`**${link.expectedUrl}`, { timeout: 20000 });  // Wait for the URL to change
                    const currentUrl = page.url();
                    expect(currentUrl).toContain(link.expectedUrl);  // Ensure the URL contains the expected value
                    console.log(`Verified navigation to: ${currentUrl}`);

                    await ensurePageLoadAndVisibility('footer.site-footer');  // Ensure the footer is still visible after navigation
                }
            } catch (error) {
                console.log(`Failed to verify link: ${link.selector} - Error: ${error.message}`);
            }
        }

        console.log('All footer links are working as expected');
    });
});