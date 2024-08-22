const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } }); 
test.describe('MemorialCare Locations Radius Options Test - Mobile View', () => {

    test('Verify all radius options are present for zip code 90806', async ({ page }) => {
        test.setTimeout(60000);

        const url = 'https://www.memorialcare.org/locations';
        await page.goto(url);
        console.log('Navigated to locations page');

        const zipCode = '90806';
        const radiusSelector = 'select#location-search-radius';
        const expectedRadii = ['5', '10', '25', '50', '75'];

        try {
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 150 });
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

});
