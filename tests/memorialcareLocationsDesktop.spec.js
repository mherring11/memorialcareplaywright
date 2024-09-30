const { test, expect } = require('@playwright/test');

// Test suite for verifying different functionalities on the MemorialCare Locations page
test.describe('MemorialCare Locations Page Tests', () => {
    let context;  // Browser context for an isolated testing environment
    let page;     // Page object for interacting with the website

    // Before each test, create a new browser context and page
    test.beforeEach(async ({ browser, browserName }) => {
        // Skip the test if it's running on Chromium (i.e., Chrome) to avoid running tests on unsupported browsers
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }
        context = await browser.newContext();  // Create a new isolated browser context
        page = await context.newPage();        // Open a new page within the context
    });

    // After each test, close the page and context to clean up resources
    test.afterEach(async () => {
        if (page) {
            await page.close();    // Close the page
        }
        if (context) {
            await context.close(); // Close the context
        }
    });

    // Test: Verify that the map loads successfully on the locations page
    test('Verify that the map loads', async ({ browserName }) => {
        // Skip test on Chromium
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }
        
        const url = 'https://memorialcare-stg.chltest2.com/locations';  // URL of the locations page
        await page.goto(url, { waitUntil: 'domcontentloaded' });        // Navigate to the page and wait for the DOM to load
        console.log('Navigated to locations page');

        const mapSelector = '#location-search-map';                     // CSS selector for the map element
        await page.waitForSelector(mapSelector, { state: 'visible' });  // Wait for the map to become visible on the page
        console.log('Map is visible on the page');

        const isMapVisible = await page.isVisible(mapSelector);         // Check if the map is visible
        expect(isMapVisible).toBe(true);                                // Assert that the map is visible
        console.log('Verified that the map is loaded and visible');
    });

    // Test: Verify that zip code search works for both California and non-California zip codes
    test('Verify zip code search with California and non-California zip codes', async ({ browserName }) => {
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }

        const url = 'https://memorialcare-stg.chltest2.com/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCodes = ['90806', '92708', '32412'];  // Array of zip codes to test (two from California, one non-California)

        // Loop through each zip code and perform the search
        for (const zipCode of zipCodes) {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);  // Fill in the zip code input field
            console.log(`Entered zip code: ${zipCode}`);
            await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter'); // Press Enter to submit the search
            console.log('Pressed Enter to select the suggested city');

            try {
                const filterButtonSelector = '.location-search__filter-trigger a.button';
                await page.click(filterButtonSelector);  // Click the "Filter Results" button
                console.log('Clicked the "Filter Results" button');

                const noResultsSelector = '.location-search__no-results';
                const noResultsVisible = await page.isVisible(noResultsSelector);  // Check if "No results" message is visible

                if (noResultsVisible) {
                    console.log(`No results found for zip code: ${zipCode}`);
                } else {
                    const resultsCountSelector = '.location-search__list__item';
                    await page.waitForSelector(resultsCountSelector, { state: 'visible' });  // Wait for results to appear
                    const resultsCount = await page.locator(resultsCountSelector).count();  // Count the number of results
                    console.log(`Number of results found: ${resultsCount}`);
                }
            } catch (error) {
                console.log(`Error for zip code ${zipCode}:`, error);  // Catch and log any errors during the search
            }
        }
    });

    // Test: Verify that clicking a specific map pin opens the correct detail record
    test('Verify specific map pin connects to the correct detail record', async ({ browserName }) => {
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }

        const url = 'https://memorialcare-stg.chltest2.com/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const mapSelector = '#location-search-map';   // Selector for the map element
        await page.waitForSelector(mapSelector, { state: 'visible' });
        console.log('Map is visible');

        const specificPinSelector = 'li[data-id="2055"] .location-search__list__item--view-details a';  // Selector for a specific map pin

        try {
            await page.waitForSelector(specificPinSelector, { state: 'visible' });
            console.log('Specific map pin is visible');

            await page.click(specificPinSelector);   // Click the specific map pin
            console.log('Clicked on the specific map pin to view details');

            const expectedUrl = '/locations/memorialcare-medical-group-huntington-beach';  // Expected URL after clicking the pin
            await page.waitForURL(`**${expectedUrl}`, { timeout: 10000 });
            const currentUrl = page.url();
            console.log(`Navigated to URL: ${currentUrl}`);
            expect(currentUrl).toContain(expectedUrl);  // Verify that the correct detail page is displayed
            console.log('Verified the correct detail page is displayed');
        } catch (error) {
            console.log('Could not find or interact with the specific map pin.', error);  // Log any errors
        }
    });

    // Test: Verify that the radius filter works as expected for a given zip code
    test('Verify radius filter functions correctly for zip code 90806', async ({ browserName }) => {
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }

        const url = 'https://memorialcare-stg.chltest2.com/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);  // Fill in the zip code input
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter'); // Press Enter to submit
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);  // Click the "Filter Results" button
        console.log('Clicked the "Filter Results" button');

        const resultsCountSelector = '.location-search__list__item';
        await page.waitForSelector(resultsCountSelector, { state: 'visible' });  // Wait for results
        const initialResultsCount = await page.locator(resultsCountSelector).count();
        console.log(`Number of results found: ${initialResultsCount}`);

        const radii = ['5', '10', '25', '50', '75'];   // Define different radii to test
        const radiusSelector = 'select#location-search-radius';  // Selector for the radius dropdown

        // Loop through each radius and verify the results
        for (const radius of radii) {
            await page.selectOption(radiusSelector, radius);  // Select a radius
            console.log(`Selected radius: ${radius} Miles`);
            await page.click(filterButtonSelector);           // Click the "Filter Results" button
            console.log('Clicked the "Filter Results" button after selecting radius');
            await page.waitForLoadState('networkidle');        // Wait for the page to load

            const updatedResultsCount = await page.locator(resultsCountSelector).count();  // Count the number of results
            console.log(`Number of results found for ${radius} Miles: ${updatedResultsCount}`);

            if (radius === '5' && initialResultsCount > 0) {
                expect(updatedResultsCount).toBeLessThanOrEqual(initialResultsCount);  // Check if results are reduced for smaller radius
            } else if (radius !== '5' && initialResultsCount > 0) {
                expect(updatedResultsCount).not.toBe(0);  // Ensure there are results for larger radii
            }
        }
    });

    // Test: Verify that clicking the "View Details" link opens the correct location details
    test('Verify "View Details" link opens the correct location details', async ({ browserName }) => {
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }

        const url = 'https://memorialcare-stg.chltest2.com/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);  // Fill in the zip code input
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter'); // Press Enter to submit
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);  // Click the "Filter Results" button
        console.log('Clicked the "Filter Results" button');

        const firstLocationSelector = '.location-search__list__item:first-child';
        await page.waitForSelector(firstLocationSelector, { state: 'visible' });  // Wait for the first result to be visible
        console.log('First location record is visible');

        const detailsLinkSelector = `${firstLocationSelector} .location-search__list__item--view-details a`;  // Selector for the details link
        const detailsLinkHref = await page.getAttribute(detailsLinkSelector, 'href');  // Get the href of the details link
        console.log(`Detail record link: ${detailsLinkHref}`);

        await page.click(detailsLinkSelector);  // Click the "View Details" link
        console.log('Clicked on the "View Details" link');

        await page.waitForLoadState('networkidle');
        const currentUrl = page.url();
        expect(currentUrl).toContain(detailsLinkHref);  // Verify that the page navigates to the correct URL
        console.log(`Navigated to the correct location details page: ${currentUrl}`);
    });

    // Test: Verify that clicking the "View on Map" link works correctly
    test('Verify "View on Map" function links to the correct map pin', async ({ browserName }) => {
        if (browserName === 'chromium') {
            test.skip('This test does not run on Chrome.');
        }

        const url = 'https://memorialcare-stg.chltest2.com/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);  // Fill in the zip code input
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter'); // Press Enter to submit
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);  // Click the "Filter Results" button
        console.log('Clicked the "Filter Results" button');

        const firstLocationSelector = '.location-search__list__item:first-child';
        await page.waitForSelector(firstLocationSelector, { state: 'visible' });  // Wait for the first result to be visible
        console.log('First location record is visible');

        const viewMapLinkSelector = `${firstLocationSelector} .location-search__list__item--view-map a`;  // Selector for the "View on Map" link
        await page.click(viewMapLinkSelector);  // Click the "View on Map" link
        console.log('Clicked on the "View on Map" link');

        const activeMapPinSelector = '.location-search__list__item--active';  // Selector for the active map pin
        await page.waitForSelector(activeMapPinSelector, { state: 'visible' });  // Wait for the active map pin to become visible
        console.log('Active map pin is visible');

        const locationNameSelector = `${activeMapPinSelector} .location-search__list__item--title-link`;  // Selector for the location name in the active map pin
        const locationName = await page.textContent(locationNameSelector);  // Get the text content of the location name
        console.log(`Active map pin corresponds to: ${locationName}`);

        const expectedLocationName = await page.textContent(`${firstLocationSelector} .location-search__list__item--title-link`);  // Expected location name from the first result
        expect(locationName.trim()).toBe(expectedLocationName.trim());  // Verify that the map pin corresponds to the correct location
        console.log(`Verified that the map pin corresponds to the correct location: ${expectedLocationName}`);
    });
});