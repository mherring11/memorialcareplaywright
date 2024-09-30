const { test, expect } = require('@playwright/test');

// Test suite for verifying GNP website header and footer on Desktop
test.describe.serial('GNP Website Header and Footer Desktop Tests', () => {

  // Test 1: Verify that the desktop header is visible and all links are working
  test('Verify that the header is visible and all links are working on Desktop', async ({ page }) => {
    test.setTimeout(120000);  // Set a timeout of 2 minutes for the test

    const url = 'https://stg.gnpweb.com/';  // GNP website staging URL
    await page.goto(url);  // Navigate to the GNP website
    console.log('Navigated to GNP website');

    // Wait for the header to become visible and ensure it is visible
    const headerSelector = 'header.direct-site-header';
    await page.waitForSelector(headerSelector, { state: 'visible' });
    console.log('Header is visible on the page');

    const isHeaderVisible = await page.locator(headerSelector).isVisible();
    expect(isHeaderVisible).toBe(true);  // Assert that the header is visible
    console.log('Verified that the header is loaded and visible');

    // Array of header links to verify, including their CSS selectors and expected URLs
    const headerLinks = [
      { selector: 'a[href="/about-us"]', expectedUrl: '/about-us' },
      { selector: 'a[href="/contact-us"]', expectedUrl: '/contact-us' },
      { selector: 'a[href="/health-resources"]', expectedUrl: '/health-resources' },
      { selector: 'a[href="https://physicians.gnpweb.com"]', expectedUrl: 'https://physicians.gnpweb.com', isExternal: true },  // External link
      { selector: 'a[href="/become-patient"]', expectedUrl: '/become-patient' },
      { selector: 'a[href="/locations"]', expectedUrl: '/locations' },
      { selector: 'a[href="/gnp-events"]', expectedUrl: '/gnp-events' },
      { selector: 'a[href="/about-us/member-resources"]', expectedUrl: '/about-us/member-resources' },
      { selector: 'a[href="/press-room"]', expectedUrl: '/press-room' },
      { selector: 'a[href="/long-beach"]', expectedUrl: '/long-beach' },
      { selector: 'a[href="/providers"]', expectedUrl: '/providers' }
    ];

    // Loop through each header link and verify its existence
    for (const link of headerLinks) {
      const linkExists = await page.locator(link.selector).count() > 0;  // Check if the link exists
      expect(linkExists).toBeTruthy();  // Assert that the link exists
      console.log(`Verified existence of header link: ${link.selector}`);

      // Handle external links that open in a new tab
      if (link.isExternal) {
        const [newPage] = await Promise.all([
          page.waitForEvent('popup'),  // Wait for the new tab to open
          page.click(link.selector)  // Click the external link
        ]);
        expect(newPage.url()).toContain(link.expectedUrl);  // Verify the new tab URL
        console.log(`Verified that external link opens in a new tab: ${link.expectedUrl}`);
        await newPage.close();  // Close the new tab
      } else {
        // Handle internal links
        await page.click(link.selector);  // Click the internal link
        await page.waitForLoadState('networkidle');  // Wait for the page to load
        const currentUrl = page.url();  // Get the current URL
        expect(currentUrl).toContain(link.expectedUrl);  // Verify the URL contains the expected URL
        console.log(`Verified navigation to: ${currentUrl}`);

        // Go back to the previous page (header page) and wait for the page to load
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  // Test 2: Verify that all footer links are present and correct on Desktop
  test('Verify that all footer links are present on Desktop', async ({ page }) => {
    const url = 'https://stg.gnpweb.com/';  // GNP website staging URL
    await page.goto(url);  // Navigate to the GNP website
    console.log('Navigated to GNP website');

    // Wait for the footer to become visible and verify its visibility
    const footerSelector = 'footer.direct-footer';
    await page.waitForSelector(footerSelector, { state: 'visible' });
    console.log('Footer is visible on the page');

    // Array of footer links to verify, including their CSS selectors
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