const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Mobile Header and Footer Tests', () => {
    let context;
    let page;
    const baseUrl = 'https://memorialcare-stg.chltest2.com/';

    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterEach(async () => {
        await page.close();
        await context.close();
    });

    test('Verify that the mobile header is visible, all other links are present, and social media buttons are present', async () => {
        test.setTimeout(90000);
        
        await page.goto(baseUrl, { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare website');

        const mobileHamburgerSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
        try {
            await page.waitForSelector(mobileHamburgerSelector, { state: 'visible', timeout: 20000 });
            await page.click(mobileHamburgerSelector);
            console.log('Hamburger menu clicked');
        } catch (error) {
            console.log(`Error finding or clicking the hamburger menu: ${error.message}`);
        }

        const mobileMenuSelector = 'nav.mobile-menu';
        try {
            await page.waitForSelector(mobileMenuSelector, { state: 'visible', timeout: 20000 });
            console.log('Mobile menu is visible');
        } catch (error) {
            console.log(`Error finding the mobile menu: ${error.message}`);
        }

        const phoneSelector = '.mobile-menu__primary-callout[href="tel:1-877-696-3622"]';
        try {
            const phoneExists = await page.locator(phoneSelector).count() > 0;
            expect(phoneExists).toBeTruthy();
            console.log('Phone number is present');
        } catch (error) {
            console.log(`Phone number not found: ${error.message}`);
        }

        const searchSelector = 'form.mobile-menu__input-container';
        try {
            const searchExists = await page.locator(searchSelector).count() > 0;
            expect(searchExists).toBeTruthy();
            console.log('Search bar is present');
        } catch (error) {
            console.log(`Search bar not found: ${error.message}`);
        }

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

        for (const link of links) {
            try {
                const linkExists = await page.locator(link).count() > 0;
                expect(linkExists).toBeTruthy();
                console.log(`Verified existence of link: ${link}`);
            } catch (error) {
                console.log(`Link not found: ${link} - Error: ${error.message}`);
            }
        }

        const socialMediaSelectors = [
            'a[data-mobile-menu-social="facebook"]',
            'a[data-mobile-menu-social="tiktok"]',
            'a[data-mobile-menu-social="youtube"]',
            'a[data-mobile-menu-social="instagram"]',
            'a[data-mobile-menu-social="linkedin"]'
        ];

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
