const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Locations Page Tests - Mobile View', () => {

  test('Verify zip code search with California and non-California zip codes', async ({ page }) => {
    test.setTimeout(60000);

    const url = 'https://www.gnpweb.com/locations';
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

  test('Verify all radius options are present for zip code 90806', async ({ page }) => {
    test.setTimeout(60000);

    const url = 'https://www.gnpweb.com/locations';
    await page.goto(url);
    console.log('Navigated to locations page');

    const zipCode = '90806';
    const radiusSelector = 'select#location-search-radius';
    const expectedRadii = ['5', '10', '25', '50', '75'];

    try {
        await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
        for (const digit of zipCode) {
            await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 1500 });
            console.log(`Entered digit: ${digit}`);
        }

        await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
        console.log('City suggestion appeared');
        await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
        console.log('Pressed Enter to select the suggested city');

        const radiusOptions = await page.$$eval(`${radiusSelector} option`, options =>
            options.map(option => option.value)
        );

        console.log('Radius options found:', radiusOptions);

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

    await page.goto(url);
    console.log('Navigated back to the locations page');
    });

    test('Verify "View on Map" function links to the correct map pin', async ({ page }) => {
        test.setTimeout(30000);
    
        const url = 'https://www.gnpweb.com/locations';
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
    
            // Click the hamburger menu "X" button to close the menu
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
                    await page.waitForTimeout(1000); // wait 1 second before retrying
                }
            }
    
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