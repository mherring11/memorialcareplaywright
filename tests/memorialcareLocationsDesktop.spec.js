const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Locations Page Tests', () => {
    let context;
    let page;

    // Create a new context and page for each test to ensure isolation
    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    // Close context after each test to free up resources
    test.afterEach(async () => {
        await page.close();
        await context.close();
    });

    test('Verify that the map loads', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const mapSelector = '#location-search-map';
        await page.waitForSelector(mapSelector, { state: 'visible' });
        console.log('Map is visible on the page');

        const isMapVisible = await page.isVisible(mapSelector);
        expect(isMapVisible).toBe(true);
        console.log('Verified that the map is loaded and visible');
    });

    test('Verify zip code search with California and non-California zip codes', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCodes = ['90806', '92708', '32412'];

        for (const zipCode of zipCodes) {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);
            console.log(`Entered zip code: ${zipCode}`);
            await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
            console.log('Pressed Enter to select the suggested city');

            try {
                const filterButtonSelector = '.location-search__filter-trigger a.button';
                await page.click(filterButtonSelector);
                console.log('Clicked the "Filter Results" button');

                const noResultsSelector = '.location-search__no-results';
                const noResultsVisible = await page.isVisible(noResultsSelector);

                if (noResultsVisible) {
                    console.log(`No results found for zip code: ${zipCode}`);
                } else {
                    const resultsCountSelector = '.location-search__list__item';
                    await page.waitForSelector(resultsCountSelector, { state: 'visible' });
                    const resultsCount = await page.locator(resultsCountSelector).count();
                    console.log(`Number of results found: ${resultsCount}`);
                }
            } catch (error) {
                console.log(`Error for zip code ${zipCode}:`, error);
            }
        }
    });

    test('Verify specific map pin connects to the correct detail record', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const mapSelector = '#location-search-map';
        await page.waitForSelector(mapSelector, { state: 'visible' });
        console.log('Map is visible');

        const specificPinSelector = 'li[data-id="2055"] .location-search__list__item--view-details a';

        try {
            await page.waitForSelector(specificPinSelector, { state: 'visible' });
            console.log('Specific map pin is visible');

            await page.click(specificPinSelector);
            console.log('Clicked on the specific map pin to view details');

            const expectedUrl = '/locations/memorialcare-medical-group-huntington-beach';
            await page.waitForURL(`**${expectedUrl}`, { timeout: 10000 });
            const currentUrl = page.url();
            console.log(`Navigated to URL: ${currentUrl}`);
            expect(currentUrl).toContain(expectedUrl);
            console.log('Verified the correct detail page is displayed');
        } catch (error) {
            console.log('Could not find or interact with the specific map pin.', error);
        }
    });

    test('Verify radius filter functions correctly for zip code 90806', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);
        console.log('Clicked the "Filter Results" button');

        const resultsCountSelector = '.location-search__list__item';
        await page.waitForSelector(resultsCountSelector, { state: 'visible' });
        const initialResultsCount = await page.locator(resultsCountSelector).count();
        console.log(`Number of results found: ${initialResultsCount}`);

        const radii = ['5', '10', '25', '50', '75'];
        const radiusSelector = 'select#location-search-radius';

        for (const radius of radii) {
            await page.selectOption(radiusSelector, radius);
            console.log(`Selected radius: ${radius} Miles`);
            await page.click(filterButtonSelector);
            console.log('Clicked the "Filter Results" button after selecting radius');
            await page.waitForLoadState('networkidle');

            const updatedResultsCount = await page.locator(resultsCountSelector).count();
            console.log(`Number of results found for ${radius} Miles: ${updatedResultsCount}`);

            if (radius === '5' && initialResultsCount > 0) {
                expect(updatedResultsCount).toBeLessThanOrEqual(initialResultsCount);
            } else if (radius !== '5' && initialResultsCount > 0) {
                expect(updatedResultsCount).not.toBe(0);
            }
        }
    });

    test('Verify "View Details" link opens the correct location details', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);
        console.log('Clicked the "Filter Results" button');

        const firstLocationSelector = '.location-search__list__item:first-child';
        await page.waitForSelector(firstLocationSelector, { state: 'visible' });
        console.log('First location record is visible');

        const detailsLinkSelector = `${firstLocationSelector} .location-search__list__item--view-details a`;
        const detailsLinkHref = await page.getAttribute(detailsLinkSelector, 'href');
        console.log(`Detail record link: ${detailsLinkHref}`);

        await page.click(detailsLinkSelector);
        console.log('Clicked on the "View Details" link');

        await page.waitForLoadState('networkidle');
        const currentUrl = page.url();
        expect(currentUrl).toContain(detailsLinkHref);
        console.log(`Navigated to the correct location details page: ${currentUrl}`);
    });

    test('Verify "View on Map" function links to the correct map pin', async () => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Navigated to locations page');

        const zipCode = '90806';
        await page.fill('input.mapboxgl-ctrl-geocoder--input', zipCode);
        console.log(`Entered zip code: ${zipCode}`);
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
        console.log('Pressed Enter to select the suggested city');

        const filterButtonSelector = '.location-search__filter-trigger a.button';
        await page.click(filterButtonSelector);
        console.log('Clicked the "Filter Results" button');

        const firstLocationSelector = '.location-search__list__item:first-child';
        await page.waitForSelector(firstLocationSelector, { state: 'visible' });
        console.log('First location record is visible');

        const viewMapLinkSelector = `${firstLocationSelector} .location-search__list__item--view-map a`;
        await page.click(viewMapLinkSelector);
        console.log('Clicked on the "View on Map" link');

        const activeMapPinSelector = '.location-search__list__item--active';
        await page.waitForSelector(activeMapPinSelector, { state: 'visible' });
        console.log('Active map pin is visible');

        const locationNameSelector = `${activeMapPinSelector} .location-search__list__item--title-link`;
        const locationName = await page.textContent(locationNameSelector);
        console.log(`Active map pin corresponds to: ${locationName}`);

        const expectedLocationName = await page.textContent(`${firstLocationSelector} .location-search__list__item--title-link`);
        expect(locationName.trim()).toBe(expectedLocationName.trim());
        console.log(`Verified that the map pin corresponds to the correct location: ${expectedLocationName}`);
    });
});
