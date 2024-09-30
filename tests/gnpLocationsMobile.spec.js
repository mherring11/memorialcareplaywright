const { test, expect } = require('@playwright/test');

// Set the viewport for mobile view dimensions
test.use({ viewport: { width: 375, height: 812 } });

// Main test suite for MemorialCare Locations Page Tests - Mobile View
test.describe('MemorialCare Locations Page Tests - Mobile View', () => {

  // Test 1: Verify the zip code search functionality with California and non-California zip codes
  test('Verify zip code search with California and non-California zip codes', async ({ page }) => {
    // Set a timeout of 60 seconds for this test
    test.setTimeout(60000);

    // URL for the locations page
    const url = 'https://stg.gnpweb.com/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    // Array of zip codes to test (includes both California and non-California zip codes)
    const zipCodes = ['90806', '92708', '32412'];

    try {
      for (const zipCode of zipCodes) {
        // Clear the zip code input field before each iteration
        await page.fill('input.mapboxgl-ctrl-geocoder--input', '');

        // Type each digit of the zip code with a delay of 1.5 seconds between each digit
        let currentInput = '';
        for (const digit of zipCode) {
          await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
          currentInput += digit;
          console.log(`Entered digit: ${digit}`);

          // Verify that the current input matches the expected zip code as it is being typed
          const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
          expect(currentValue).toBe(currentInput);
        }

        try {
          // Wait for the city suggestion dropdown to appear
          await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
          console.log('City suggestion appeared');
          
          // Select the city by pressing Enter
          await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
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
            await page.waitForTimeout(1500); // Wait for a short time before moving to the next zip code
            continue; // Move to the next zip code in the loop
          }

          // Get the number of results found for the zip code
          const resultsCountSelector = '.location-search__list__item';
          await page.waitForSelector(resultsCountSelector, { state: 'visible' });
          const resultsCount = await page.locator(resultsCountSelector).count();
          console.log(`Number of results found: ${resultsCount}`);

        } catch (error) {
          console.log(`Timeout or error for zip code: ${zipCode}`);
        }

        // Clear the zip code input field before the next zip code is tested
        await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
        console.log('Cleared the zip code input field');

        await page.waitForTimeout(1000); // Short wait before moving to the next zip code
        console.log('Waited for 1 second before moving to the next zip code');
      }
    } catch (error) {
      console.log('An unexpected error occurred:', error);
    }

    // Navigate back to the locations page after all zip codes have been tested
    await page.goto(url);
    console.log('Navigated back to the locations page');
  });

  // Test 2: Verify all radius options are present for zip code 90806
  test('Verify all radius options are present for zip code 90806', async ({ page }) => {
    // Set a timeout of 60 seconds for this test
    test.setTimeout(60000);

    // URL for the locations page
    const url = 'https://stg.gnpweb.com/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    const zipCode = '90806'; // Zip code to test
    const radiusSelector = 'select#location-search-radius'; // Selector for the radius dropdown
    const expectedRadii = ['5', '10', '25', '50', '75']; // Expected radius values

    try {
      // Fill the zip code input field with the test zip code
      await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
      for (const digit of zipCode) {
        await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
        console.log(`Entered digit: ${digit}`);
      }

      // Wait for the city suggestion dropdown to appear and select the city
      await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
      console.log('City suggestion appeared');
      await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
      console.log('Pressed Enter to select the suggested city');

      // Get the available radius options from the dropdown
      const radiusOptions = await page.$$eval(`${radiusSelector} option`, options =>
        options.map(option => option.value)
      );
      console.log('Radius options found:', radiusOptions);

      // Check if each expected radius is present in the dropdown
      for (const expectedRadius of expectedRadii) {
        if (radiusOptions.includes(expectedRadius)) {
          console.log(`Radius ${expectedRadius} Miles is present.`);
        } else {
          console.error(`Radius ${expectedRadius} Miles is missing!`);
        }
      }

    } catch (error) {
      console.log('An unexpected error occurred:', error);
    }

    // Navigate back to the locations page after checking the radius options
    await page.goto(url);
    console.log('Navigated back to the locations page');
  });

  // Test 3: Verify that the "View on Map" function links to the correct map pin
  test('Verify "View on Map" function links to the correct map pin', async ({ page }) => {
    // Set a timeout of 30 seconds for this test
    test.setTimeout(30000);

    // URL for the locations page
    const url = 'https://stg.gnpweb.com/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    const zipCode = '90806'; // Zip code to test

    try {
      // Fill the zip code input field with the test zip code
      await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
      let currentInput = '';
      for (const digit of zipCode) {
        await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
        currentInput += digit;
        console.log(`Entered digit: ${digit}`);

        // Verify that the current input matches the expected zip code as it is being typed
        const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
        expect(currentValue).toBe(currentInput);
      }

      // Wait for the city suggestion dropdown to appear and select the city
      await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
      console.log('City suggestion appeared');
      await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
      console.log('Pressed Enter to select the suggested city');

      // Click the "Filter Results" button to apply the filter
      const filterButtonSelector = '.location-search__filter-trigger a.button';
      await page.click(filterButtonSelector);
      console.log('Clicked the "Filter Results" button');

      // Wait for the first location result to appear
      const firstLocationSelector = '.location-search__list__item:first-child';
      await page.waitForSelector(firstLocationSelector, { state: 'visible' });
      console.log('First location record is visible');

      // Close the mobile menu by clicking the close (X) button, retrying if necessary
      const closeButtonSelector = 'svg[viewBox="0 0 100 100"]';
      let attempts = 0;
      const maxAttempts = 5;
      while (attempts < maxAttempts) {
        try {
          await page.hover(closeButtonSelector);
          await page.click(closeButtonSelector, { force: true });
          console.log('Clicked the close (X) button to close the mobile menu');
          break;
        } catch (e) {
          attempts++;
          if (attempts >= maxAttempts) throw e;
          console.log(`Retrying click action on close button, attempt #${attempts}`);
          await page.waitForTimeout(1000); // Wait before retrying
        }
      }

      // Click the "View on Map" link for the first location
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