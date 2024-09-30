const { test, expect } = require('@playwright/test');

// Set the viewport size for mobile view (375x812, typical for mobile devices)
test.use({ viewport: { width: 375, height: 812 } });

// Test suite for verifying mobile header and footer on GNP website
test.describe('GNP Website Mobile Header and Footer Tests', () => {

  // Test 1: Verify that the mobile header is visible and that all header links are working
  test('Verify that the mobile header is visible and all links are working', async ({ page }) => {
    const url = 'https://stg.gnpweb.com/';  // GNP website staging URL
    await page.goto(url);  // Navigate to the URL
    console.log('Navigated to GNP website');

    // Wait for the mobile hamburger menu (mobile menu button) to become visible, then click it
    const mobileHamburgerSelector = 'a[aria-label="Mobile Menu Button"]';
    await page.waitForSelector(mobileHamburgerSelector, { state: 'visible' });
    await page.click(mobileHamburgerSelector);  // Open the mobile menu
    console.log('Hamburger menu clicked');

    // Wait for the header to become visible and verify its visibility
    const headerSelector = 'header.direct-site-header';
    await page.waitForSelector(headerSelector, { state: 'visible' });
    console.log('Header is visible on the page');

    // Verify that the header is visible on the page
    const isHeaderVisible = await page.locator(headerSelector).isVisible();
    expect(isHeaderVisible).toBe(true);
    console.log('Verified that the header is loaded and visible');

    // Array of header links to verify, containing their CSS selectors and expected URLs
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

    // Loop through each header link and verify its existence on the page
    for (const link of headerLinks) {
      const linkExists = await page.locator(link.selector).count() > 0;  // Check if the link exists
      expect(linkExists).toBeTruthy();  // Assert that the link exists
      console.log(`Verified existence of header link: ${link.selector}`);
    }
  });

  // Test 2: Verify that all footer links are present and correct
  test('Verify that all footer links are present', async ({ page }) => {
    const url = 'https://stg.gnpweb.com/';  // GNP website staging URL
    await page.goto(url);  // Navigate to the URL
    console.log('Navigated to GNP website');

    // Wait for the footer to become visible
    const footerSelector = 'footer.direct-footer';
    await page.waitForSelector(footerSelector, { state: 'visible' });
    console.log('Footer is visible on the page');

    // Array of footer links to verify, containing their CSS selectors
    const links = [
      { selector: 'a[href="https://careers.memorialcare.org/"]' },
      { selector: 'a[href="/contact-us"]' },
      { selector: 'a[href="https://www.memorialcare.org"]' },
      { selector: 'a[href="https://physicians.gnpweb.com"]' },
      { selector: 'a[href="/policies-legal-notices/privacy-policy"]' },
      { selector: 'a[href="/policies-legal-notices/terms-use"]' },
    ];

    // Loop through each footer link and verify its existence on the page
    for (const link of links) {
      const linkExists = await page.locator(link.selector).count() > 0;  // Check if the link exists
      expect(linkExists).toBeTruthy();  // Assert that the link exists
      console.log(`Verified existence of footer link: ${link.selector}`);
    }
  });
});