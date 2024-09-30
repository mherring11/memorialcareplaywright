const { test, expect } = require('@playwright/test');

// Set viewport to mobile dimensions for testing on mobile
test.use({ viewport: { width: 375, height: 812 } }); 

// Test suite for verifying radius options on the MemorialCare Locations page in mobile view
test.describe('MemorialCare Locations Radius Options Test - Mobile View', () => {

    // Test: Verify that all radius options are present for a specific zip code
    test('Verify all radius options are present for zip code 90806', async ({ page }) => {
        test.setTimeout(60000);  // Set a timeout for this test to 60 seconds

        const url = 'https://memorialcare-stg.chltest2.com/locations';  // URL of the locations page
        await page.goto(url);  // Navigate to the locations page
        console.log('Navigated to locations page');

        const zipCode = '90806';  // The zip code to search
        const radiusSelector = 'select#location-search-radius';  // Selector for the radius dropdown
        const expectedRadii = ['5', '10', '25', '50', '75'];  // Expected radius options to be available

        try {
            // Clear any existing text in the input field and type the zip code one digit at a time
            await page.fill('input.mapboxgl-ctrl-geocoder--input', '');  // Clear the zip code input field
            for (const digit of zipCode) {
                await page.type('input.mapboxgl-ctrl-geocoder--input', digit, { delay: 150 });  // Type each digit with a delay
                console.log(`Entered digit: ${digit}`);  // Log the entered digit
            }

            // Wait for the city suggestion to appear after typing the zip code
            await page.waitForSelector('.mapboxgl-ctrl-geocoder--suggestion', { state: 'visible', timeout: 10000 });
            console.log('City suggestion appeared');

            // Press Enter to select the suggested city
            await page.press('input.mapboxgl-ctrl-geocoder--input', 'Enter');
            console.log('Pressed Enter to select the suggested city');

            // Get the available options from the radius dropdown
            const radiusOptions = await page.$$eval(`${radiusSelector} option`, options =>
                options.map(option => option.value)  // Map the options to get their values
            );

            console.log('Radius options found:', radiusOptions);  // Log the found radius options

            // Verify that all expected radius options are present in the dropdown
            for (const expectedRadius of expectedRadii) {
                if (radiusOptions.includes(expectedRadius)) {
                    console.log(`Radius ${expectedRadius} Miles is present.`);  // Log the presence of the radius option
                } else {
                    console.error(`Radius ${expectedRadius} Miles is missing!`);  // Log if the radius option is missing
                }
            }

        } catch (error) {
            console.log('An unexpected error occurred:', error);  // Log any errors encountered during the test
        }

        // Navigate back to the locations page to reset the test environment
        await page.goto(url);
        console.log('Navigated back to the locations page');
    });

});