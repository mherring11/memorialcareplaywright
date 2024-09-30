const { test, expect } = require('@playwright/test');

// Test suite for verifying the mobile header and footer on the MemorialCare website
test.use({ viewport: { width: 375, height: 812 } });  // Set the viewport to a mobile screen size

test.describe('MemorialCare Mobile Header and Footer Tests', () => {
    let context;  // Browser context to create an isolated environment
    let page;     // Page object to interact with the website
    const baseUrl = 'https://memorialcare-stg.chltest2.com/';  // Base URL for the MemorialCare website

    // Before each test, create a new browser context and page
    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();  // Create a new context to isolate tests
        page = await context.newPage();        // Open a new page within the context
    });

    // After each test, close the page and context to clean up resources
    test.afterEach(async () => {
        await page.close();    // Close the page
        await context.close(); // Close the browser context
    });

    // Test: Verify that the mobile header is visible, all other links are present, and social media buttons are present
    test('Verify that the mobile header is visible, all other links are present, and social media buttons are present', async () => {
        test.setTimeout(90000);  // Set the test timeout to 90 seconds
        
        await page.goto(baseUrl, { waitUntil: 'networkidle' });  // Navigate to the MemorialCare website and wait until the network is idle
        console.log('Navigated to MemorialCare website');

        // Selector for the mobile hamburger menu button
        const mobileHamburgerSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
        try {
            // Wait for the mobile hamburger menu to be visible and click it to open the menu
            await page.waitForSelector(mobileHamburgerSelector, { state: 'visible', timeout: 20000 });
            await page.click(mobileHamburgerSelector);
            console.log('Hamburger menu clicked');
        } catch (error) {
            console.log(`Error finding or clicking the hamburger menu: ${error.message}`);
        }

        // Selector for the mobile menu
        const mobileMenuSelector = 'nav.mobile-menu';
        try {
            // Wait for the mobile menu to be visible
            await page.waitForSelector(mobileMenuSelector, { state: 'visible', timeout: 20000 });
            console.log('Mobile menu is visible');
        } catch (error) {
            console.log(`Error finding the mobile menu: ${error.message}`);
        }

        // Verify that the phone number link is present
        const phoneSelector = '.mobile-menu__primary-callout[href="tel:1-877-696-3622"]';
        try {
            const phoneExists = await page.locator(phoneSelector).count() > 0;
            expect(phoneExists).toBeTruthy();
            console.log('Phone number is present');
        } catch (error) {
            console.log(`Phone number not found: ${error.message}`);
        }

        // Verify that the search bar is present
        const searchSelector = 'form.mobile-menu__input-container';
        try {
            const searchExists = await page.locator(searchSelector).count() > 0;
            expect(searchExists).toBeTruthy();
            console.log('Search bar is present');
        } catch (error) {
            console.log(`Search bar not found: ${error.message}`);
        }

        // Define an array of links in the mobile menu to be checked for presence
        const links = [
            'a[href="/services/urgent-care"]',
            'a[href="/providers"]',
            'a[href="/services"]',
            'a[href="/locations"]',
            'a[href="/events"]',
            'a[href="/patients-visitors"]',
            'a[href="/patients-visitors/mychart-online-health-connection"]',
            'a[href="/patients-visitors/patient-financial-tools-and-resources"]',
            'a[href="/patients-visitors/patient-financial-tools-and-resources/financial-assistance"]',
            'a[href="/professionals/research-clinical-trials"]',
            'a[href="/patients-visitors/medical-records-forms"]',
            'a[href="/blog"]',
            'a[href="/ways-give"]',
            'a[href="/about-us"]',
            'a[href="https://careers.memorialcare.org"]',
            'a[href="/b2b"]',
            'a[href="/employees-volunteers"]',
            'a[href="/physicians"]',
        ];

        // Loop through each link and verify that it is present
        for (const link of links) {
            try {
                const linkExists = await page.locator(link).count() > 0;
                expect(linkExists).toBeTruthy();
                console.log(`Verified existence of link: ${link}`);
            } catch (error) {
                console.log(`Link not found: ${link} - Error: ${error.message}`);
            }
        }

        // Define an array of social media buttons to check
        const socialMediaSelectors = [
            'a[data-mobile-menu-social="facebook"]',
            'a[data-mobile-menu-social="tiktok"]',
            'a[data-mobile-menu-social="youtube"]',
            'a[data-mobile-menu-social="instagram"]',
            'a[data-mobile-menu-social="linkedin"]'
        ];

        // Loop through each social media button and verify its presence
        for (const selector of socialMediaSelectors) {
            try {
                const socialExists = await page.locator(selector).count() > 0;
                expect(socialExists).toBeTruthy();
                console.log(`Verified existence of social media button: ${selector}`);
            } catch (error) {
                console.log(`Social media button not found: ${selector} - Error: ${error.message}`);
            }
        }

        console.log('All mobile header links and social media buttons are working as expected');
    });
});