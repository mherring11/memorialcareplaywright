const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Mobile Header and Footer Tests', () => {

    test('Verify that the mobile header is visible, all other links are present, and social media buttons are present', async ({ page }) => {
        const url = 'https://www.memorialcare.org';
        await page.goto(url);
        console.log('Navigated to MemorialCare website');

        const mobileHamburgerSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
        await page.waitForSelector(mobileHamburgerSelector, { state: 'visible' });
        await page.click(mobileHamburgerSelector);
        console.log('Hamburger menu clicked');

        const mobileMenuSelector = 'nav.mobile-menu';
        await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
        await page.waitForTimeout(1000); 

        const phoneSelector = '.mobile-menu__primary-callout[href="tel:1-877-696-3622"]';
        const phoneExists = await page.locator(phoneSelector).count() > 0;
        expect(phoneExists).toBeTruthy();
        console.log('Phone number is present');

        const searchSelector = 'form.mobile-menu__input-container';
        const searchExists = await page.locator(searchSelector).count() > 0;
        expect(searchExists).toBeTruthy();
        console.log('Search bar is present');

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
            const linkExists = await page.locator(link).count() > 0;
            if (!linkExists) {
                console.log(`Link not found: ${link}`);
            }
            expect(linkExists).toBeTruthy();
            console.log(`Verified existence of link: ${link}`);
        }
        
        const socialMediaSelectors = [
            'a[data-mobile-menu-social="facebook"]',
            'a[data-mobile-menu-social="tiktok"]',
            'a[data-mobile-menu-social="youtube"]',
            'a[data-mobile-menu-social="instagram"]',
            'a[data-mobile-menu-social="linkedin"]'
        ];

        for (const selector of socialMediaSelectors) {
            const socialExists = await page.locator(selector).count() > 0;
            if (!socialExists) {
                console.log(`Social media button not found: ${selector}`);
            }
            expect(socialExists).toBeTruthy();
            console.log(`Verified existence of social media button: ${selector}`);
        }
    });

});
