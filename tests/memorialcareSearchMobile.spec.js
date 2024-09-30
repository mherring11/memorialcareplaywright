const { test, expect, chromium } = require('@playwright/test');

// Test suite for verifying MemorialCare site search functionality on mobile view
test.describe('MemorialCare Site Search Functionality - Mobile View', () => {

  // Test: Verify that the search form works and returns properly formatted results for "lungs" on mobile view
  test('Verify that the search form functions and returns properly formatted results for "lungs" on mobile', async () => {
    // Launch a new Chromium browser instance with mobile emulation settings
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },  // Set mobile viewport dimensions
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' // Emulate mobile browser user-agent
    });
    const page = await context.newPage();  // Create a new page in the context

    test.setTimeout(60000);  // Set the timeout for this test to 60 seconds
    const searchTerms = ['lungs'];  // Define the search terms to test

    // Loop through each search term and call the function to perform search and verification
    for (const searchTerm of searchTerms) {
      await performSearchAndVerify(page, searchTerm);  // Perform the search and verify the results
    }

    // Selector for the mobile hamburger menu button
    const mobileHamburgerButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    // Wait for the hamburger menu button to appear, then click it
    await page.waitForSelector(mobileHamburgerButtonSelector, { state: 'visible', timeout: 30000 });
    await page.click(mobileHamburgerButtonSelector);
    console.log('Clicked on the mobile hamburger menu');

    // Selector for the Services button in the mobile menu
    const servicesButtonSelector = '.mobile-menu__primary-nav-link[href="/services"]';
    // Wait for the Services button to appear, then click it
    await page.waitForSelector(servicesButtonSelector, { state: 'visible', timeout: 30000 });
    await page.click(servicesButtonSelector);
    console.log('Clicked on the Services button in the mobile menu');

    // Wait for the page to load and verify that the URL contains '/services'
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/services');
    console.log('Verified that the page navigated to the Services page');

    // Close the browser after the test
    await browser.close();
  });

});

// Helper function to perform search and verify results for a given search term
async function performSearchAndVerify(page, searchTerm) {
    const url = 'https://memorialcare-stg.chltest2.com/search';  // Search page URL
    await page.goto(url);  // Navigate to the search page
    console.log(`Navigated to MemorialCare search page for term: ${searchTerm}`);

    const searchInputSelector = 'input[data-drupal-selector="edit-query"]:visible';  // Selector for the search input field
    const searchButtonSelector = 'button[data-drupal-selector="edit-submit"]:visible';  // Selector for the search button

    // Wait for the search input field to be visible and fill it with the search term
    await page.waitForSelector(searchInputSelector, { state: 'visible', timeout: 15000 });
    await page.fill(searchInputSelector, searchTerm);
    console.log(`Entered search term: ${searchTerm}`);

    // Wait for the search button to be visible and click it to submit the search
    await page.waitForSelector(searchButtonSelector, { state: 'visible', timeout: 15000 });
    await page.click(searchButtonSelector);
    console.log(`Clicked search for term: ${searchTerm}`);

    const resultsContainerSelector = '.container-narrow.site-search__container';  // Selector for the results container
    // Wait for the search results container to be visible
    await page.waitForSelector(resultsContainerSelector, { state: 'visible', timeout: 15000 });
    console.log('Search results container is visible');

    // Define the tabs to verify on the search results page (e.g., All Results, Services, Providers)
    const tabs = [
        { name: 'All Results', param: 'all' },
        { name: 'Services', param: 'services' },
        { name: 'Providers', param: 'providers' },
        { name: 'Locations', param: 'locations' },
        { name: 'Events', param: 'events' }
    ];

    // Loop through each tab, click it, verify the URL, and ensure the results container is visible
    for (const tab of tabs) {
        const tabSelector = `.search-tabs__link:has-text("${tab.name}")`;  // Selector for the tab

        // Click the tab and verify the URL contains the correct tab parameter
        await page.click(tabSelector);
        console.log(`Clicked on tab: ${tab.name}`);

        await page.waitForTimeout(1000);  // Wait briefly to allow the page to load the new results
        const currentUrl = page.url();
        expect(currentUrl).toContain(`tab=${tab.param}`);
        console.log(`Verified URL contains the correct tab parameter: ${tab.param}`);

        // Check if the results container is visible after switching tabs
        const isResultsContainerVisible = await page.isVisible(resultsContainerSelector);
        expect(isResultsContainerVisible).toBe(true);
        console.log(`Search results container is visible after clicking on tab: ${tab.name}`);
    }

    // Selector for the individual search result links
    const resultsSelector = '.search-card .link-icon--internal';
    // Get all the result links on the page
    const results = await page.$$eval(resultsSelector, links => links.map(link => link.href));

    // Check if any results were returned
    if (results.length > 0) {
        console.log(`Verified that there are ${results.length} results for the term "${searchTerm}"`);
        // Verify that each result link is properly formatted
        results.forEach((link, index) => {
            expect(link).toMatch(/^https?:\/\/.+/);  // Ensure the link is a valid URL
            console.log(`Result ${index + 1}: ${link}`);
        });
        console.log(`Verified that each result has a valid link to the result page for term "${searchTerm}"`);
    } else {
        // If no results were found, log it
        console.log(`No results found for the term "${searchTerm}".`);
    }
}