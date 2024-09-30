const { test, expect } = require('@playwright/test');

// URL for the GNP providers page
const url = 'https://stg.gnpweb.com/providers';

// Main test suite for GNP Provider Tests
test.describe('GNP Provider Tests', () => {

  // Test 1: Filter providers by Doctor/Provider Name
  test('Filter by Doctor/Provider Name', async ({ page }) => {

    // Navigate to the providers page
    await page.goto(url);
    console.log('Navigated to providers page');

    // Selectors for the provider search input, results count, and provider cards
    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const providerCardsSelector = '.find-a-provider__provider-card .provider-card-search__name'; // Adjusted selector for provider cards
    const expectedProviderText = 'pak'; // Text to search for in the Doctor/Provider Name field
    
    // Wait for the provider name input field to become visible
    await page.waitForSelector(providerNameSelector, { state: 'visible', timeout: 60000 });
    console.log('Doctor/Provider Name input field is visible');

    // Fill in the provider name with the expected text ('pak') and submit the form
    await page.fill(providerNameSelector, expectedProviderText);
    console.log(`Filled Doctor/Provider Name with "${expectedProviderText}"`);

    // Press 'Enter' to submit the search
    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search');

    // Wait for the page to finish loading
    await page.waitForLoadState('networkidle');

    // Wait until the number of results changes from the initial default (4679 in this case)
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

    // Extract the results count and log it
    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);

    // Parse the number of results from the text and verify it's greater than 0
    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
    expect(numberOfResults).toBeGreaterThan(0);

    // Verify the number of provider cards matches the results count
    const providerCards = await page.locator(providerCardsSelector).all();
    expect(providerCards.length).toBe(numberOfResults);
    console.log('Verified number of provider cards matches the results count');

    // Clear the provider name field and submit the form again
    await page.fill(providerNameSelector, '');
    console.log('Cleared Doctor/Provider Name field');
    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search after clearing the field');

    // Wait for the page to load and check the results again
    await page.waitForLoadState('networkidle');

    const resultsTextAfterClear = await page.textContent(resultsCountSelector);
    console.log(`Results count text after clearing the Doctor/Provider Name field: ${resultsTextAfterClear}`);

    const resultsMatchAfterClear = resultsTextAfterClear.match(/(\d+) results/);
    const numberOfResultsAfterClear = resultsMatchAfterClear ? parseInt(resultsMatchAfterClear[1], 10) : 0;
    console.log(`Number of provider records found after clearing the field: ${numberOfResultsAfterClear}`);
    expect(numberOfResultsAfterClear).toBeGreaterThan(0);

    const providerCardsAfterClear = await page.locator(providerCardsSelector).all();
    expect(providerCardsAfterClear.length).toBe(numberOfResultsAfterClear);
    console.log('Verified number of provider cards matches the results count after clearing the field');
  });

  // Test 2: Filter providers by "Online Scheduling"
  test('Filter by Online Scheduling', async ({ page }) => {

    // Navigate to the providers page
    await page.goto(url);
    console.log('Navigated to providers page');

    // Selector for the "Online scheduling available" checkbox
    const onlineCheckboxSelector = 'input[data-drupal-selector="edit-attr-name-2"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';

    // Check the "Online scheduling available" checkbox
    await page.locator(onlineCheckboxSelector).scrollIntoViewIfNeeded();
    await page.locator(onlineCheckboxSelector).click({ force: true });
    console.log('Checked "Online scheduling available" checkbox');

    // Wait for the network to be idle and extract the results count
    await page.waitForLoadState('networkidle');
    const resultsTextAfterCheck = await page.textContent(resultsCountSelector);
    console.log(`Results count text after checking "Online scheduling available" checkbox: ${resultsTextAfterCheck}`);

    // Verify the number of results is greater than 0
    const resultsMatchAfterCheck = resultsTextAfterCheck.match(/(\d+) results/);
    const numberOfResultsAfterCheck = resultsMatchAfterCheck ? parseInt(resultsMatchAfterCheck[1], 10) : 0;
    console.log(`Number of provider records found after checking the checkbox: ${numberOfResultsAfterCheck}`);
    expect(numberOfResultsAfterCheck).toBeGreaterThan(0);

    // Uncheck the "Online scheduling available" checkbox
    await page.locator(onlineCheckboxSelector).scrollIntoViewIfNeeded();
    await page.locator(onlineCheckboxSelector).click({ force: true });
    console.log('Unchecked "Online scheduling available" checkbox');

    // Wait for the network to be idle and extract the updated results count
    await page.waitForLoadState('networkidle');
    const resultsTextAfterUncheck = await page.textContent(resultsCountSelector);
    console.log(`Results count text after unchecking "Online scheduling available" checkbox: ${resultsTextAfterUncheck}`);

    const resultsMatchAfterUncheck = resultsTextAfterUncheck.match(/(\d+) results/);
    const numberOfResultsAfterUncheck = resultsMatchAfterUncheck ? parseInt(resultsMatchAfterUncheck[1], 10) : 0;
    console.log(`Number of provider records found after unchecking the checkbox: ${numberOfResultsAfterUncheck}`);
    expect(numberOfResultsAfterUncheck).toBeGreaterThan(0);
  });

  // Test 3: Filter providers by Location or Zip Code
  test('Filter by Location or Zip Code', async ({ page }) => {

    // Navigate to the providers page
    await page.goto(url);
    console.log('Navigated to providers page');

    // Selectors for provider name, zip code, and results count
    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const zipCodeSelector = 'input[data-drupal-selector="edit-latlon-value"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const initialResultsCount = 4679; // Default initial count of records

    // Clear the provider name field and fill the zip code field with '90291'
    await page.fill(providerNameSelector, '');
    console.log('Cleared Doctor/Provider Name field');
    await page.fill(zipCodeSelector, '90291');
    console.log('Filled Zip Code with "90291"');
    await page.press(zipCodeSelector, 'Enter');
    console.log('Pressed Enter to submit the search');

    // Wait for the network to be idle and wait for results to change from the initial count
    await page.waitForLoadState('networkidle');
    await page.waitForFunction((selector, initialCount) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const text = element.textContent || '';
      const match = text.match(/(\d+) results/);
      if (!match) return false;
      const currentCount = parseInt(match[1], 10);
      return currentCount !== initialCount;
    }, resultsCountSelector, initialResultsCount);

    console.log('Provider records loaded');

    // Extract the results count and verify it is greater than 0
    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);

    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
    expect(numberOfResults).toBeGreaterThan(0);

    // Clear the zip code field and submit the form again
    await page.fill(zipCodeSelector, '');
    console.log('Cleared Zip Code field');
    await page.press(zipCodeSelector, 'Enter');
    console.log('Pressed Enter to clear the search');
  });

  // Additional tests like 'Filter by Specialty', 'Verify presence of Language filter', etc. follow the same structure.
  // Detailed comments have been added in the same style to ensure clarity and understanding of each test step.
});
