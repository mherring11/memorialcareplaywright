const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Mobile Header and Footer Test', () => {

    test.beforeEach(async ({ page }) => {
        // Set the viewport for mobile devices
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
        const url = 'https://www.memorialcare.org';
        await page.goto(url);
        console.log('Navigated to MemorialCare website');
    });

    test('Verify that the mobile header is visible, all links are working, and social media buttons are present', async ({ page }) => {
        // Set the viewport for mobile devices
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
        const url = 'https://www.memorialcare.org';
        await page.goto(url);
        console.log('Navigated to MemorialCare website');
    
        // Open the mobile menu
        await page.click('.site-header__primary-nav__hamburger__trigger');
        console.log('Hamburger menu clicked');
    
        const links = [
            { selector: 'a[href="/locations/memorialcare-medical-group/schedule-appointment-today"]', expectedUrl: '/locations/memorialcare-medical-group/schedule-appointment-today' },
            { selector: 'a[href="/services/urgent-care"]', expectedUrl: '/services/urgent-care' },
            { selector: 'a[href="/providers"]', expectedUrl: '/providers' },
            { selector: 'a[href="/services"]', expectedUrl: '/services' },
            { selector: 'a[href="/locations"]', expectedUrl: '/locations' },
            { selector: 'a[href="/events"]', expectedUrl: '/events' },
            { selector: 'a[href="/patients-visitors"]', expectedUrl: '/patients-visitors' },
            { selector: 'a[href="/patients-visitors/mychart-online-health-connection"]', expectedUrl: '/patients-visitors/mychart-online-health-connection' },
            { selector: 'a[href="/patients-visitors/patient-financial-tools-and-resources"]', expectedUrl: '/patients-visitors/patient-financial-tools-and-resources' },
            { selector: 'a[href="/patients-visitors/patient-financial-tools-and-resources/financial-assistance"]', expectedUrl: '/patients-visitors/patient-financial-tools-and-resources/financial-assistance' },
            { selector: 'a[href="/professionals/research-clinical-trials"]', expectedUrl: '/professionals/research-clinical-trials' },
            { selector: 'a[href="/patients-visitors/medical-records-forms"]', expectedUrl: '/patients-visitors/medical-records-forms' },
            { selector: 'a[href="/blog"]', expectedUrl: '/blog' },
            { selector: 'a[href="/ways-give"]', expectedUrl: '/ways-give' },
            { selector: 'a[href="/about-us"]', expectedUrl: '/about-us' },
            { selector: 'a[href="https://careers.memorialcare.org"]', expectedUrl: 'https://careers.memorialcare.org' },
            { selector: 'a[href="/b2b"]', expectedUrl: '/b2b' },
            { selector: 'a[href="/employees-volunteers"]', expectedUrl: '/employees-volunteers' },
            { selector: 'a[href="/physicians"]', expectedUrl: '/physicians' },
        ];
    
        // Verify phone and search presence
        const phoneSelector = 'a[href="tel:1-877-696-3622"]';
        const searchSelector = 'form.mobile-menu__input-container';
        const phoneVisible = await page.isVisible(phoneSelector);
        expect(phoneVisible).toBeTruthy();
        console.log('Phone number is visible');
    
        const searchVisible = await page.isVisible(searchSelector);
        expect(searchVisible).toBeTruthy();
        console.log('Search bar is visible');
    
        // Click and verify each link
        for (const link of links) {
            await page.click(link.selector);
            console.log(`Clicked on link: ${link.selector}`);
    
            await page.waitForURL(`**${link.expectedUrl}`);
            const currentUrl = page.url();
            expect(currentUrl).toContain(link.expectedUrl);
            console.log(`Verified navigation to: ${currentUrl}`);
    
            // Go back to the homepage and re-open the menu
            await page.goto('https://www.memorialcare.org');
            await page.click('.site-header__primary-nav__hamburger__trigger');
        }
    
        // Verify the presence of social media buttons
        const socialMediaSelectors = [
            'a[data-mobile-menu-social="facebook"]',
            'a[data-mobile-menu-social="tiktok"]',
            'a[data-mobile-menu-social="youtube"]',
            'a[data-mobile-menu-social="instagram"]',
            'a[data-mobile-menu-social="linkedin"]'
        ];
    
        for (const selector of socialMediaSelectors) {
            const isVisible = await page.isVisible(selector);
            expect(isVisible).toBeTruthy();
            console.log(`Verified presence of social media button: ${selector}`);
        }
    });
});