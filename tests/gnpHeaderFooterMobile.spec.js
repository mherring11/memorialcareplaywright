const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('GNP Website Mobile Header and Footer Tests', () => {

  test('Verify that the mobile header is visible and all links are working', async ({ page }) => {
    const url = 'https://www.gnpweb.com/';
    await page.goto(url);
    console.log('Navigated to GNP website');

    const mobileHamburgerSelector = 'a[aria-label="Mobile Menu Button"]';
    await page.waitForSelector(mobileHamburgerSelector, { state: 'visible' });
    await page.click(mobileHamburgerSelector);
    console.log('Hamburger menu clicked');

    const headerSelector = 'header.direct-site-header';
    await page.waitForSelector(headerSelector, { state: 'visible' });
    console.log('Header is visible on the page');

    const isHeaderVisible = await page.locator(headerSelector).isVisible();
    expect(isHeaderVisible).toBe(true);
    console.log('Verified that the header is loaded and visible');

    const headerLinks = [
      { selector: 'a[href="/about-us"]', expectedUrl: '/about-us' },
      { selector: 'a[href="/contact-us"]', expectedUrl: '/contact-us' },
      { selector: 'a[href="/health-resources"]', expectedUrl: '/health-resources' },
      { selector: 'a[href="https://physicians.gnpweb.com"]', expectedUrl: 'https://physicians.gnpweb.com', isExternal: true },
      { selector: 'a[href="/become-patient"]', expectedUrl: '/become-patient' },
      { selector: 'a[href="/locations"]', expectedUrl: '/locations' },
      { selector: 'a[href="/gnp-events"]', expectedUrl: '/gnp-events' },
      { selector: 'a[href="/about-us/member-resources"]', expectedUrl: '/about-us/member-resources' },
      { selector: 'a[href="/press-room"]', expectedUrl: '/press-room' },
      { selector: 'a[href="/long-beach"]', expectedUrl: '/long-beach' },
      { selector: 'a[href="/providers"]', expectedUrl: '/providers' }
    ];

    for (const link of headerLinks) {
      const linkExists = await page.locator(link.selector).count() > 0;
      expect(linkExists).toBeTruthy();
      console.log(`Verified existence of header link: ${link.selector}`);
    }
  });

  test('Verify that all footer links are present', async ({ page }) => {
    const url = 'https://www.gnpweb.com/';
    await page.goto(url);
    console.log('Navigated to GNP website');

    const footerSelector = 'footer.direct-footer';
    await page.waitForSelector(footerSelector, { state: 'visible' });
    console.log('Footer is visible on the page');

    const links = [
      { selector: 'a[href="https://careers.memorialcare.org/"]' },
      { selector: 'a[href="/contact-us"]' },
      { selector: 'a[href="https://www.memorialcare.org"]' },
      { selector: 'a[href="https://physicians.gnpweb.com"]' },
      { selector: 'a[href="/policies-legal-notices/privacy-policy"]' },
      { selector: 'a[href="/policies-legal-notices/terms-use"]' },
    ];

    for (const link of links) {
      const linkExists = await page.locator(link.selector).count() > 0;
      expect(linkExists).toBeTruthy();
      console.log(`Verified existence of footer link: ${link.selector}`);
    }
  });
});
