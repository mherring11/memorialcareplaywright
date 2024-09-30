const { test, expect } = require('@playwright/test');

// Test suite for verifying the MemorialCare Services page functionality on mobile devices
test.use({ viewport: { width: 375, height: 812 } });  // Set viewport to simulate mobile view

test.describe('MemorialCare Services Tests - Mobile View', () => {

  // Test: Verify that all expected alphabet letters for service selection are present
  test('Verify the presence of alphabet letters for service selection on mobile', async ({ page }) => {
    test.setTimeout(150000);  // Set timeout for this test

    const url = 'https://memorialcare-stg.chltest2.com/services';  // MemorialCare Services page URL
    await page.goto(url);  // Navigate to the Services page
    console.log('Navigated to MemorialCare Services page');

    const alphabeticalLinksSelector = '.search-marquee__glossary .facet-item.glossaryaz a';  // Selector for alphabet links
    const alphabetLetters = await page.$$eval(alphabeticalLinksSelector, links => links.map(link => link.textContent.trim()));  // Get the text of all alphabet letters

    const expectedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => !['X', 'Z'].includes(letter));  // Exclude X and Z as they are not expected

    // Loop through each expected letter and verify its presence
    for (const letter of expectedLetters) {
        const isPresent = alphabetLetters.includes(letter);  // Check if the letter is present
        expect(isPresent).toBe(true);  // Assert that the letter is present
        console.log(`Verified that letter ${letter} is present`);
    }
  });

  // Test: Verify that the condition filter (first option) functions correctly on mobile
  test('Verify the first condition selector functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);  // Set timeout for this test

    const url = 'https://memorialcare-stg.chltest2.com/services';  // MemorialCare Services page URL
    await page.goto(url);  // Navigate to the Services page
    console.log('Navigated to MemorialCare Services page');

    const applyMoreFiltersButton = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the "Apply More Filters" button
    await page.click(applyMoreFiltersButton);  // Click the button to reveal more filters
    console.log('Clicked on Apply More Filters button');

    const conditionDropdownSelector = '.sidebar-content__filter .facets-widget-dropdown';  // Selector for the condition dropdown
    const conditionOptionsSelector = `${conditionDropdownSelector} .choices__item--choice`;  // Selector for condition options

    // Get the first condition option (text and value)
    const firstConditionOption = await page.$eval(conditionOptionsSelector, option => ({
        text: option.textContent.trim(),
        value: option.getAttribute('data-value')
    }));

    console.log(`Testing condition filter: ${firstConditionOption.text}`);

    // Open the condition dropdown and select the first condition
    await page.click(`${conditionDropdownSelector} .choices__inner`);
    await page.waitForSelector(`.choices__item[data-value="${firstConditionOption.value}"]`, { visible: true });

    await page.click(`.choices__item[data-value="${firstConditionOption.value}"]`);  // Select the first condition
    await page.waitForLoadState('networkidle');  // Wait for the page to load after applying the filter

    const currentUrl = page.url();
    expect(currentUrl).toContain('condition');  // Verify that the URL contains the condition filter
    console.log(`Verified filter for condition ${firstConditionOption.text} with URL: ${currentUrl}`);
  });

  // Test: Verify that the location filter (first option) functions correctly on mobile
  test('Verify the first location selector functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);  // Set timeout for this test

    const url = 'https://memorialcare-stg.chltest2.com/services';  // MemorialCare Services page URL
    await page.goto(url);  // Navigate to the Services page
    console.log('Navigated to MemorialCare Services page');

    const applyMoreFiltersButton = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the "Apply More Filters" button
    await page.click(applyMoreFiltersButton);  // Click the button to reveal more filters
    console.log('Clicked on Apply More Filters button');

    const locationDropdownSelector = '#block-find-a-service-locations-all .facets-widget-dropdown';  // Selector for the location dropdown
    const locationOptionsSelector = `${locationDropdownSelector} .choices__item--choice`;  // Selector for location options

    // Get the first location option (text and value)
    const firstLocationOption = await page.$eval(locationOptionsSelector, option => ({
        text: option.textContent.trim(),
        value: option.getAttribute('data-value')
    }));

    console.log(`Testing location filter: ${firstLocationOption.text}`);

    // Open the location dropdown and select the first location
    await page.click(`${locationDropdownSelector} .choices__inner`);
    await page.waitForSelector(`.choices__item[data-value="${firstLocationOption.value}"]`, { visible: true });

    await page.click(`.choices__item[data-value="${firstLocationOption.value}"]`);  // Select the first location
    await page.waitForLoadState('networkidle');  // Wait for the page to load after applying the filter

    const currentUrl = page.url();
    expect(currentUrl).toContain('location');  // Verify that the URL contains the location filter
    console.log(`Verified filter for location ${firstLocationOption.text} with URL: ${currentUrl}`);
  });

  // Test: Verify that the search functionality works correctly for the term "lung" on mobile
  test('Verify that the search form functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);  // Set timeout for this test

    const url = 'https://memorialcare-stg.chltest2.com/services';  // MemorialCare Services page URL
    await page.goto(url);  // Navigate to the Services page
    console.log('Navigated to MemorialCare Services page');

    const searchInputSelector = '.search-marquee__input';  // Selector for the search input field
    await page.fill(searchInputSelector, 'lung');  // Enter the search term 'lung'
    console.log('Entered search term: lung');

    await page.press(searchInputSelector, 'Enter');  // Press Enter to submit the search
    await page.waitForLoadState('networkidle');  // Wait for the page to load after the search

    const currentUrl = page.url();
    expect(currentUrl).toContain('query=lung');  // Verify that the URL contains the search query
    console.log(`Verified search with query 'lung' in URL: ${currentUrl}`);
  });

});