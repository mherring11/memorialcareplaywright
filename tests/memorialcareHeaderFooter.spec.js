const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Website Header Test', () => {

    test('Verify that the header is visible and all links are working', async ({ page }) => {
       test.setTimeout(90000);
       
        const url = 'https://www.memorialcare.org';
        await page.goto(url);
        console.log('Navigated to MemorialCare website');

        const headerSelector = 'header.site-header';
        await page.waitForSelector(headerSelector, { state: 'visible' });
        console.log('Header is visible');

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

      
        for (const link of links) {
            if (link.expectedUrl.startsWith('tel') || link.expectedUrl === '/search') {
                const isVisible = await page.isVisible(link.selector);
                expect(isVisible).toBe(true);
                console.log(`Verified presence of link: ${link.selector}`);
            } else {
                await page.click(link.selector);
                console.log(`Clicked on link: ${link.selector}`);

                await page.waitForURL(`**${link.expectedUrl}`);
                const currentUrl = page.url();
                expect(currentUrl).toContain(link.expectedUrl);
                console.log(`Verified navigation to: ${currentUrl}`);

                await page.goto(url);
            }
        }
        console.log('All header links are working as expected');
    });

    test('Verify that the footer is visible and all links are working', async ({ page }) => {
    
        test.setTimeout(60000);
        const url = 'https://www.memorialcare.org';
        await page.goto(url);
        console.log('Navigated to MemorialCare website');
    
        const footerSelector = 'footer.site-footer';
        await page.waitForSelector(footerSelector, { state: 'visible', timeout: 20000 });
        console.log('Footer is visible');
    
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
    
        for (const link of links) {
            const element = page.locator(link.selector);
            await element.waitFor({ state: 'visible', timeout: 10000 });
    
            if (link.expectedUrl.startsWith('http')) {
                const isVisible = await element.isVisible();
                expect(isVisible).toBe(true);
                console.log(`Verified presence of external link: ${link.selector}`);
            } else {
                await element.click();
                console.log(`Clicked on link: ${link.selector}`);
    
                await page.waitForURL(`**${link.expectedUrl}`, { timeout: 20000 });
                const currentUrl = page.url();
                expect(currentUrl).toContain(link.expectedUrl);
                console.log(`Verified navigation to: ${currentUrl}`);
    
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            }
        }
    
        console.log('All footer links are working as expected');
    }, 60000);
});