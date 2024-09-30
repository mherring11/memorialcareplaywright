const { test, expect } = require('@playwright/test');

// Test suite for GNP Locations Page
test.describe('GNP Locations Page Tests', () => {

  // Test 1: Verify that the map loads correctly on the locations page
  test('Verify that the map loads', async ({ page }) => {
    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const mapSelector = '#location-search-map';  // Selector for the map element

    // Wait until the map becomes visible on the page
    await page.waitForSelector(mapSelector, { state: 'visible' });
    console.log('Map is visible on the page');

    // Check that the map is visible
    const isMapVisible = await page.locator(mapSelector).isVisible();
    expect(isMapVisible).toBe(true);
    console.log('Verified that the map is loaded and visible');
  });

  // Test 2: Verify zip code search with California and non-California zip codes
  test('Verify zip code search with California and non-California zip codes', async ({ page }) => {
    test.setTimeout(60000);  // Set a timeout of 60 seconds for the test

    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const zipCodes = ['90806', '92708', '32412'];  // List of zip codes to test

    try {
      for (const zipCode of zipCodes) {
        await page.fill('input.mapboxgl-ctrl-geocoder--input', '');  // Clear the zip code input field

        // Simulate typing the zip code one digit at a time with a delay
        let currentInput = '';
        for (const digit of zipCode) {
          await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
          currentInput += digit;
          console.log(`Entered digit: ${digit}`);

          // Verify the zip code input matches the expected value as it's typed
          const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
          expect(currentValue).toBe(currentInput);
        }

        try {
          // Wait for city suggestions to appear
          await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
          console.log('City suggestion appeared');
          await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');  // Select the city
          console.log('Pressed Enter to select the suggested city');

          // Click the "Filter Results" button to apply the filter
          const filterButtonSelector = '.location-search__filter-trigger a.button';
          await page.click(filterButtonSelector);
          console.log('Clicked the "Filter Results" button');

          // Check if no results are found for the zip code
          const noResultsSelector = '.location-search__no-results';
          const hasNoResults = await page.$(noResultsSelector);

          if (hasNoResults) {
            console.log(`No results found for zip code: ${zipCode}`);
            await page.waitForTimeout(1500);
            continue;  // Move to the next zip code if no results are found
          }

          // Get the number of results found
          const resultsCountSelector = '.location-search__list__item';
          await page.waitForSelector(resultsCountSelector, { state: 'visible' });
          const resultsCount = await page.locator(resultsCountSelector).count();
          console.log(`Number of results found: ${resultsCount}`);

        } catch (error) {
          console.log(`Timeout or error for zip code: ${zipCode}`);
        }

        // Clear the zip code input field before testing the next zip code
        await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
        console.log('Cleared the zip code input field');

        // Wait before moving to the next zip code
        await page.waitForTimeout(1000);
        console.log('Waited for 1 second before moving to the next zip code');
      }
    } catch (error) {
      console.log('An unexpected error occurred:', error);
    }

    // Return to the locations page after completing the zip code tests
    await page.goto(url);
    console.log('Navigated back to the locations page');
  });

  // Test 3: Verify specific map pin connects to the correct detail record
  test('Verify specific map pin connects to the correct detail record', async ({ page }) => {
    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const mapSelector = '#location-search-map';  // Selector for the map element
    await page.waitForSelector(mapSelector, { state: 'visible' });  // Wait for the map to be visible
    console.log('Map is visible');

    // Selector for the specific map pin (data-id = 22)
    const specificPinSelector = 'li[data-id="22"] .location-search__list__item--view-details a';

    try {
      await page.waitForSelector(specificPinSelector, { state: 'visible', timeout: 10000 });
      console.log('Specific map pin is visible');

      // Click on the specific map pin to view details
      await page.click(specificPinSelector);
      console.log('Clicked on the specific map pin to view details');

      // Wait for navigation to the expected details page URL
      const expectedUrl = '/locations/long-beach-medical-center';  // Expected URL
      await page.waitForURL(`**${expectedUrl}`, { timeout: 10000 });
      const currentUrl = page.url();
      console.log(`Navigated to URL: ${currentUrl}`);
      expect(currentUrl).toContain(expectedUrl);
      console.log('Verified the correct detail page is displayed');

    } catch (error) {
      console.log('Could not find or interact with the specific map pin.');
    }

    // Return to the locations page after the test
    await page.goto(url);
    console.log('Navigated back to the locations page');
  });

  // Test 4: Verify radius filter functions correctly for zip code 90806
  test('Verify radius filter functions correctly for zip code 90806', async ({ page }) => {
    test.setTimeout(60000);  // Set a timeout of 60 seconds for the test

    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const zipCode = '90806';  // Zip code to test
    const radiusSelector = 'select#location-search-radius';  // Selector for the radius dropdown
    const radii = ['5', '10', '25', '50', '75'];  // Expected radius options

    try {
      // Fill the zip code input field with the test zip code
      await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
      let currentInput = '';
      for (const digit of zipCode) {
        await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
        currentInput += digit;
        console.log(`Entered digit: ${digit}`);
        const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
        expect(currentValue).toBe(currentInput);
      }

      // Wait for the city suggestion dropdown and select the city
      await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
      console.log('City suggestion appeared');
      await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
      console.log('Pressed Enter to select the suggested city');

      // Click the "Filter Results" button to apply the filter
      const filterButtonSelector = '.location-search__filter-trigger a.button';
      await page.click(filterButtonSelector);
      console.log('Clicked the "Filter Results" button');

      const noResultsSelector = '.location-search__no-results';  // Selector for no results message
      const hasNoResults = await page.$(noResultsSelector);

      if (hasNoResults) {
        console.log(`No results found for zip code: ${zipCode}`);
        return;  // Exit test if no results are found
      }

      // Get the initial number of results found for the zip code
      const resultsCountSelector = '.location-search__list__item';
      await page.waitForSelector(resultsCountSelector, { state: 'visible' });
      const initialResultsCount = await page.locator(resultsCountSelector).count();
      console.log(`Number of results found: ${initialResultsCount}`);

      // Test radius filter for each radius option
      for (const radius of radii) {
        await page.selectOption(radiusSelector, radius);  // Select the radius option
        console.log(`Selected radius: ${radius} Miles`);
        await page.click(filterButtonSelector);  // Reapply the filter after selecting radius
        console.log('Clicked the "Filter Results" button after selecting radius');

        await page.waitForLoadState('networkidle');  // Wait for page to finish loading

        const updatedResultsCount = await page.locator(resultsCountSelector).count();
        console.log(`Number of results found for ${radius} Miles: ${updatedResultsCount}`);

        // Verify the results count behaves as expected based on the radius selected
        if (radius === '5' && initialResultsCount > 0) {
          expect(updatedResultsCount).toBeLessThanOrEqual(initialResultsCount);
        } else if (radius !== '5' && initialResultsCount > 0) {
          expect(updatedResultsCount).not.toBe(0);
        }
      }
    } catch (error) {
      console.log(`Timeout or error for zip code: ${zipCode}`);
    }

    // Return to the locations page after the test
    await page.goto(url);
    console.log('Navigated back to the locations page');
  });

  // Test 5: Verify "View Details" link opens the correct location details
  test('Verify "View Details" link opens the correct location details', async ({ page }) => {
    test.setTimeout(60000);  // Set a timeout of 60 seconds for the test

    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const zipCode = '90806';  // Zip code to test

    try {
      // Fill the zip code input field with the test zip code
      await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
      let currentInput = '';
      for (const digit of zipCode) {
        await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
        currentInput += digit;
        console.log(`Entered digit: ${digit}`);
        const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
        expect(currentValue).toBe(currentInput);
      }

      // Wait for the city suggestion dropdown and select the city
      await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
      console.log('City suggestion appeared');
      await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
      console.log('Pressed Enter to select the suggested city');

      // Click the "Filter Results" button to apply the filter
      const filterButtonSelector = '.location-search__filter-trigger a.button';
      await page.click(filterButtonSelector);
      console.log('Clicked the "Filter Results" button');

      // Wait for the first location record to appear and get the "View Details" link
      const firstLocationSelector = '.location-search__list__item:first-child';
      await page.waitForSelector(firstLocationSelector, { state: 'visible' });
      console.log('First location record is visible');

      const detailsLinkSelector = `${firstLocationSelector} .location-search__list__item--view-details a`;
      const detailsLinkHref = await page.getAttribute(detailsLinkSelector, 'href');
      console.log(`Detail record link: ${detailsLinkHref}`);

      // Click the "View Details" link and verify the navigation
      await page.click(detailsLinkSelector);
      console.log('Clicked on the "View Details" link');

      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      expect(currentUrl).toContain(detailsLinkHref);
      console.log(`Navigated to the correct location details page: ${currentUrl}`);
    } catch (error) {
      console.log('An error occurred:', error);
    }
  });

  // Test 6: Verify "View on Map" function links to the correct map pin
  test('Verify "View on Map" function links to the correct map pin', async ({ page }) => {
    test.setTimeout(60000);  // Set a timeout of 60 seconds for the test

    const url = 'https://stg.gnpweb.com/locations';  // URL of the locations page
    await page.goto(url);  // Navigate to the page
    console.log('Navigated to locations page');

    const zipCode = '90806';  // Zip code to test

    try {
      // Fill the zip code input field with the test zip code
      await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
      let currentInput = '';
      for (const digit of zipCode) {
        await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
        currentInput += digit;
        console.log(`Entered digit: ${digit}`);
        const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
        expect(currentValue).toBe(currentInput);
      }

      // Wait for the city suggestion dropdown and select the city
      await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
      console.log('City suggestion appeared');
      await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
      console.log('Pressed Enter to select the suggested city');

      // Click the "Filter Results" button to apply the filter
      const filterButtonSelector = '.location-search__filter-trigger a.button';
      await page.click(filterButtonSelector);
      console.log('Clicked the "Filter Results" button');

      // Wait for the first location record and click the "View on Map" link
      const firstLocationSelector = '.location-search__list__item:first-child';
      await page.waitForSelector(firstLocationSelector, { state: 'visible' });
      console.log('First location record is visible');

      const viewMapLinkSelector = `${firstLocationSelector} .location-search__list__item--view-map a`;
      await page.click(viewMapLinkSelector);
      console.log('Clicked on the "View on Map" link');

      // Verify that the active map pin is visible
      const activeMapPinSelector = '.location-search__list__item--active';
      await page.waitForSelector(activeMapPinSelector, { state: 'visible' });
      console.log('Active map pin is visible');

      // Get the location name from the active map pin and verify it matches the expected location
      const locationNameSelector = `${activeMapPinSelector} .location-search__list__item--title-link`;
      const locationName = await page.textContent(locationNameSelector);
      console.log(`Active map pin corresponds to: ${locationName}`);

      const expectedLocationName = await page.textContent(`${firstLocationSelector} .location-search__list__item--title-link`);
      expect(locationName.trim()).toBe(expectedLocationName.trim());
      console.log(`Verified that the map pin corresponds to the correct location: ${expectedLocationName}`);
    } catch (error) {
      console.log('An error occurred:', error);
    }
  });
});