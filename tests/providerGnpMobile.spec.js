// Importing required modules from Playwright
const { test, expect } = require('@playwright/test');

// The URL for the GNP providers page
const url = 'https://stg.gnpweb.com/providers';

// Define the viewport size for mobile devices (width 375, height 812)
test.use({ viewport: { width: 375, height: 812 } });

// Function to check if the browser is Chrome or Safari
// Playwright refers to Chrome as 'chromium' and Safari as 'webkit'
async function isChromeOrSafari(page) {
  const browserName = page.context().browser().browserType().name();
  return browserName === 'chromium' || browserName === 'webkit';
}

// Test suite for GNP Provider tests for mobile devices
test.describe('GNP Provider Tests - Mobile', () => {

  // Test 1: Filter providers by Doctor/Provider name
  test('Filter by Doctor/Provider Name', async ({ page }) => {
    
    // Skip the test if the browser is Firefox (we're only testing on Chrome and Safari)
    if (!(await isChromeOrSafari(page))) {
      console.log('Skipping test on Firefox');
      test.skip();
    }

    // Navigate to the provider's page
    await page.goto(url);
    console.log('Navigated to providers page');

    // Click the hamburger menu to open the mobile navigation
    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    // Wait for the mobile menu to become visible
    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    // Click on "Find a Doctor" in the mobile menu
    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    // Click the "Filter Results" button to display the filtering options
    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    // Fill the Doctor/Provider name input field with 'pak' and submit the search
    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const providerCardsSelector = '.find-a-provider__provider-card';
    const expectedProviderText = 'pak';

    await page.fill(providerNameSelector, expectedProviderText);
    console.log(`Filled Doctor/Provider Name with "${expectedProviderText}"`);
    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search');

    // Wait for the network to be idle before proceeding
    await page.waitForLoadState('networkidle');

    // Wait until the number of results changes from the initial count (e.g., from a default value like 4679)
    await page.waitForFunction((selector, initialCount) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const text = element.textContent || '';
        const match = text.match(/(\d+) results/);
        if (!match) return false;
        const currentCount = parseInt(match[1], 10);
        return currentCount !== initialCount;
    }, resultsCountSelector, 4679);
    
    console.log('Provider records loaded');

    // Retrieve and display the results count from the page
    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);

    // Extract the number of results from the text
    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
    expect(numberOfResults).toBeGreaterThan(0);

    // Verify that the number of provider cards matches the results count
    const providerCards = await page.locator(providerCardsSelector).all();
    expect(providerCards.length).toBe(numberOfResults);
    console.log('Verified number of provider cards matches the results count');

    // Clear the Doctor/Provider name field and submit the search again
    await page.fill(providerNameSelector, '');
    console.log('Cleared Doctor/Provider Name field');
    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search after clearing the field');

    // Wait for the network to be idle before proceeding
    await page.waitForLoadState('networkidle');

    // Retrieve and log the results after clearing the field
    const resultsTextAfterClear = await page.textContent(resultsCountSelector);
    console.log(`Results count text after clearing the Doctor/Provider Name field: ${resultsTextAfterClear}`);

    // Extract the number of results after clearing the field
    const resultsMatchAfterClear = resultsTextAfterClear.match(/(\d+) results/);
    const numberOfResultsAfterClear = resultsMatchAfterClear ? parseInt(resultsMatchAfterClear[1], 10) : 0;
    console.log(`Number of provider records found after clearing the field: ${numberOfResultsAfterClear}`);
    expect(numberOfResultsAfterClear).toBeGreaterThan(0);

    // Verify that the number of provider cards matches the results count after clearing the field
    const providerCardsAfterClear = await page.locator(providerCardsSelector).all();
    expect(providerCardsAfterClear.length).toBe(numberOfResultsAfterClear);
    console.log('Verified number of provider cards matches the results count after clearing the field');
  })
});
