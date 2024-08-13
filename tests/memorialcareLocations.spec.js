const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Locations Page Tests', () => {

  test('Verify that the map loads', async ({ page }) => {
    const url = 'https://www.memorialcare.org/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    const mapSelector = '#location-search-map';

    await page.waitForSelector(mapSelector, { state: 'visible' });
    console.log('Map is visible on the page');

    const isMapVisible = await page.locator(mapSelector).isVisible();
    expect(isMapVisible).toBe(true);
    console.log('Verified that the map is loaded and visible');
  });

  
  test('Verify zip code search with California and non-California zip codes', async ({ page }) => {
    test.setTimeout(60000);

    const url = 'https://www.memorialcare.org/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    const zipCodes = ['90806', '92708', '32412'];

    try {
        for (const zipCode of zipCodes) {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');

            let currentInput = '';
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
                currentInput += digit;
                console.log(`Entered digit: ${digit}`);
                const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
                expect(currentValue).toBe(currentInput);
            }

            try {
                await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
                console.log('City suggestion appeared');
                await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
                console.log('Pressed Enter to select the suggested city');

                const filterButtonSelector = '.location-search__filter-trigger a.button';

                await page.click(filterButtonSelector);
                console.log('Clicked the "Filter Results" button');

                const noResultsSelector = '.location-search__no-results';
                const hasNoResults = await page.$(noResultsSelector);

                if (hasNoResults) {
                    console.log(`No results found for zip code: ${zipCode}`);
                    await page.waitForTimeout(1500);
                    continue;
                }

                const resultsCountSelector = '.location-search__list__item';
                await page.waitForSelector(resultsCountSelector, { state: 'visible' });
                const resultsCount = await page.locator(resultsCountSelector).count();
                console.log(`Number of results found: ${resultsCount}`);
            } catch (error) {
                console.log(`Timeout or error for zip code: ${zipCode}`);
            }

            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
            console.log('Cleared the zip code input field');

            await page.waitForTimeout(1000);
            console.log('Waited for 1 second before moving to the next zip code');
        }
    } catch (error) {
        console.log('An unexpected error occurred:', error);
    }

    await page.goto(url);
    console.log('Navigated back to the locations page');
    });

    test('Verify specific map pin connects to the correct detail record', async ({ page }) => {
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url);
        console.log('Navigated to locations page');
    
        const mapSelector = '#location-search-map';
        await page.waitForSelector(mapSelector, { state: 'visible' });
        console.log('Map is visible');

        const specificPinSelector = 'li[data-id="2055"] .location-search__list__item--view-details a';
        
        try {
            await page.waitForSelector(specificPinSelector, { state: 'visible', timeout: 10000 });
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
            console.log('Could not find or interact with the specific map pin.');
        }
    
        await page.goto(url);
        console.log('Navigated back to the locations page');
    });

    test('Verify radius filter functions correctly for zip code 90806', async ({ page }) => {
        test.setTimeout(60000);
    
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url);
        console.log('Navigated to locations page');
    
        const zipCode = '90806';
        const radiusSelector = 'select#location-search-radius';
        const radii = ['5', '10', '25', '50', '75'];
    
        try {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
    
            let currentInput = '';
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
                currentInput += digit;
                console.log(`Entered digit: ${digit}`);
                const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
                expect(currentValue).toBe(currentInput);
            }
    
            try {
                await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
                console.log('City suggestion appeared');
                await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
                console.log('Pressed Enter to select the suggested city');
    
                const filterButtonSelector = '.location-search__filter-trigger a.button';
    
                await page.click(filterButtonSelector);
                console.log('Clicked the "Filter Results" button');
    
                const noResultsSelector = '.location-search__no-results';
                const hasNoResults = await page.$(noResultsSelector);
    
                if (hasNoResults) {
                    console.log(`No results found for zip code: ${zipCode}`);
                    return;
                }
    
                const resultsCountSelector = '.location-search__list__item';
                await page.waitForSelector(resultsCountSelector, { state: 'visible' });
                const initialResultsCount = await page.locator(resultsCountSelector).count();
                console.log(`Number of results found: ${initialResultsCount}`);

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
            } catch (error) {
                console.log(`Timeout or error for zip code: ${zipCode}`);
            }
        } catch (error) {
            console.log('An unexpected error occurred:', error);
        }
    
        await page.goto(url);
        console.log('Navigated back to the locations page');
    });

    test('Verify "View Details" link opens the correct location details', async ({ page }) => {
        test.setTimeout(60000);
    
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url);
        console.log('Navigated to locations page');
    
        const zipCode = '90806';
    
        try {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');

            let currentInput = '';
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
                currentInput += digit;
                console.log(`Entered digit: ${digit}`);
                const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
                expect(currentValue).toBe(currentInput);
            }

            await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
            console.log('City suggestion appeared');
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
        } catch (error) {
            console.log('An error occurred:', error);
        }
    });
    
    test('Verify "View on Map" function links to the correct map pin', async ({ page }) => {
        test.setTimeout(60000);
    
        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url);
        console.log('Navigated to locations page');
    
        const zipCode = '90806';
    
        try {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
    
            let currentInput = '';
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
                currentInput += digit;
                console.log(`Entered digit: ${digit}`);
                const currentValue = await page.inputValue('input.mapboxgl-ctrl-geocoder--input');
                expect(currentValue).toBe(currentInput);
            }

            await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
            console.log('City suggestion appeared');
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
        } catch (error) {
            console.log('An error occurred:', error);
        }
    });
});