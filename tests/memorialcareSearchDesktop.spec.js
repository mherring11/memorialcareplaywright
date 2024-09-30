const { test, expect } = require('@playwright/test');

// Test suite for verifying search functionality on the MemorialCare website
test.describe('MemorialCare Site Search Functionality', () => {

  // Test: Verify that the search form returns properly formatted results for the search term "lungs"
  test('Verify that the search form functions and returns properly formatted results for "lungs"', async ({ page }) => {
    test.setTimeout(60000);  // Set a timeout for the test to 60 seconds
    const searchTerms = ['lungs'];  // Define the search terms to test

    // Loop through each search term and run the search verification function
    for (const searchTerm of searchTerms) {
      await performSearchAndVerify(page, searchTerm);  // Call the helper function to perform the search and verify results
    }
  });

});

// Helper function to perform the search and verify results for a given search term
async function performSearchAndVerify(page, searchTerm) {
    const url = 'https://memorialcare-stg.chltest2.com/search';  // The URL of the search page
    await page.goto(url);  // Navigate to the search page
    console.log(`Navigated to MemorialCare search page for term: ${searchTerm}`);

    const searchInputSelector = 'input[data-drupal-selector="edit-query"]:visible';  // Selector for the search input field
    const searchButtonSelector = 'button[data-drupal-selector="edit-submit"]:visible';  // Selector for the search button

    // Wait for the search input field to be visible and then fill it with the search term
    await page.waitForSelector(searchInputSelector, { state: 'visible', timeout: 15000 });
    await page.fill(searchInputSelector, searchTerm);
    console.log(`Entered search term: ${searchTerm}`);

    // Wait for the search button to be visible and click it to submit the search
    await page.waitForSelector(searchButtonSelector, { state: 'visible', timeout: 15000 });
    await page.click(searchButtonSelector);
    console.log(`Clicked search for term: ${searchTerm}`);

    const resultsContainerSelector = '.container-narrow.site-search__container';  // Selector for the results container
    // Wait for the search results container to become visible
    await page.waitForSelector(resultsContainerSelector, { state: 'visible', timeout: 15000 });
    console.log('Search results container is visible');

    // Define the tabs to verify on the search results page
    const tabs = [
        { name: 'All Results', param: 'all' },
        { name: 'Services', param: 'services' },
        { name: 'Providers', param: 'providers' },
        { name: 'Locations', param: 'locations' },
        { name: 'Events', param: 'events' }
    ];

    // Loop through each tab, click it, verify the URL, and ensure the results container is visible
    for (const tab of tabs) {
        const tabSelector = `.search-tabs__link:has-text("${tab.name}")`;  // Selector for the tab link

        await page.click(tabSelector);  // Click the tab
        console.log(`Clicked on tab: ${tab.name}`);

        await page.waitForTimeout(1000);  // Wait briefly to allow the page to load the new results
        const currentUrl = page.url();
        expect(currentUrl).toContain(`tab=${tab.param}`);  // Verify that the URL contains the correct tab parameter
        console.log(`Verified URL contains the correct tab parameter: ${tab.param}`);

        // Check if the results container is still visible after switching tabs
        const isResultsContainerVisible = await page.isVisible(resultsContainerSelector);
        expect(isResultsContainerVisible).toBe(true);
        console.log(`Search results container is visible after clicking on tab: ${tab.name}`);
    }

    const resultsSelector = '.search-card .link-icon--internal';  // Selector for the individual search result links
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