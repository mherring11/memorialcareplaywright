const { test, expect } = require('@playwright/test');

// Set the viewport to mobile size for all tests in this suite
test.use({ viewport: { width: 375, height: 812 } });

// Describe the test suite for the MemorialCare Events page on mobile devices
test.describe('MemorialCare Events Page Mobile Test', () => {
    
    // Function to click on the "Filter Results" button and ensure the filter section is visible
    async function clickFilterResultsButton(page) {
        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the Filter Results button

        // Try up to 3 times to click the button and check if the filter section becomes visible
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                await page.waitForSelector(filterResultsButtonSelector, { state: 'visible', timeout: 5000 });  // Wait for the button to become visible
                await page.waitForTimeout(2000);  // Wait for 2 seconds before clicking
                await page.click(filterResultsButtonSelector, { force: true });  // Click the button
                console.log(`Clicked on the Filter Results button on attempt ${attempt + 1}`);

                const filterResultsSectionSelector = '.sidebar-content__filter';  // Selector for the Filter Results section
                const isFilterResultsVisible = await page.isVisible(filterResultsSectionSelector);  // Check if the section is visible

                if (isFilterResultsVisible) {
                    console.log('Filter Results section is visible after clicking the button.');
                    return;  // Exit the loop if successful
                } else {
                    console.log('Filter Results section is not visible, retrying...');
                }
            } catch (error) {
                console.log(`Attempt ${attempt + 1} failed. Retrying...`);
            }
        }

        // If all attempts fail, throw an error
        throw new Error('Failed to click on the Filter Results button and display the Filter Results section after multiple attempts.');
    }

    // Function to navigate to the Events page using the mobile hamburger menu
    async function navigateToEventsPage(page) {
        const hamburgerButtonSelector = '.site-header__primary-nav__item--mobile .site-header__primary-nav__hamburger__trigger';  // Selector for the hamburger menu button
        await page.click(hamburgerButtonSelector);  // Click the hamburger button
        console.log('Clicked on the hamburger button to open the mobile menu');

        const eventsButtonSelector = '.mobile-menu__primary-nav-item a[href="/events"]';  // Selector for the Events button in the mobile menu
        await page.click(eventsButtonSelector);  // Click the Events button
        console.log('Clicked on the Events button in the mobile menu');
    }

    // Test 1: Verify that events load when the Events page is opened on mobile
    test('Verify that the current events load when the page loads on mobile', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto('https://memorialcare-stg.chltest2.com/events');  // Go to the Events page
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        const eventCardSelector = '.event-listing__event-card';  // Selector for event cards
        await page.waitForSelector(eventCardSelector, { state: 'visible', timeout: 15000 });  // Wait for the event cards to become visible
        
        const eventCards = await page.$$(eventCardSelector);  // Get all event cards
        expect(eventCards.length).toBeGreaterThan(0);  // Assert that there is at least one event card
        console.log(`Verified that ${eventCards.length} event(s) are loaded on the page.`);
    });

    // Test 2: Verify that the "Learn More" links on the first two event cards are visible on mobile
    test('Verify that the "Learn More" links on the first two event cards are present and visible on mobile', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto('https://memorialcare-stg.chltest2.com/events');  // Go to the Events page
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        // Verify visibility of the "Learn More" button on the first event card
        const firstLearnMoreSelector = '.event-listing__event-card:nth-child(1) .button';
        const isFirstLearnMoreVisible = await page.isVisible(firstLearnMoreSelector);
        expect(isFirstLearnMoreVisible).toBe(true);  // Assert that the button is visible
        console.log('Verified that the first "Learn More" link is present and visible.');

        // Verify visibility of the "Learn More" button on the second event card
        const secondLearnMoreSelector = '.event-listing__event-card:nth-child(2) .button';
        const isSecondLearnMoreVisible = await page.isVisible(secondLearnMoreSelector);
        expect(isSecondLearnMoreVisible).toBe(true);  // Assert that the button is visible
        console.log('Verified that the second "Learn More" link is present and visible.');
    });

    // Test 3: Verify the presence of the keyword input field on mobile
    test('Verify the presence of the keyword input field on mobile', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto('https://memorialcare-stg.chltest2.com/events/');  // Go to the Events page
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        await clickFilterResultsButton(page);  // Use the function to click the "Filter Results" button and ensure the section is visible

        const filterResultsSectionSelector = '.sidebar-content__filter';  // Selector for the Filter Results section
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });  // Wait for the section to become visible
        console.log('Filter Results section is visible');

        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';  // Selector for the keyword input field
        const isKeywordInputVisible = await page.isVisible(keywordInputSelector);  // Check if the keyword input field is visible
        expect(isKeywordInputVisible).toBe(true);  // Assert that the field is visible
        console.log('Verified that the keyword input field is present and visible.');
    });

    // Test 4: Verify that the Event Date min/max input fields are visible on mobile
    test('Verify that the Event Date min/max inputs are present and visible on mobile', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto('https://www.memorialcare.org/');  // Go to the MemorialCare homepage
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the Filter Results button
        await page.waitForSelector(filterResultsButtonSelector, { state: 'visible', timeout: 10000 });  // Wait for the button to become visible
        await page.click(filterResultsButtonSelector);  // Click the Filter Results button
        console.log('Clicked on the Filter Results button');

        const filterResultsSectionSelector = '.sidebar-content__filter';  // Selector for the Filter Results section
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 15000 });  // Wait for the section to become visible
        console.log('Filter Results section is visible');

        const minDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="Start"]';  // Selector for the Min date input field
        const maxDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="End"]';  // Selector for the Max date input field

        // Check if the Min date input field is visible
        const isMinDateInputVisible = await page.isVisible(minDateInputSelector);
        expect(isMinDateInputVisible).toBe(true);  // Assert that the field is visible
        console.log('Verified that the Min date input is present and visible.');

        // Check if the Max date input field is visible
        const isMaxDateInputVisible = await page.isVisible(maxDateInputSelector);
        expect(isMaxDateInputVisible).toBe(true);  // Assert that the field is visible
        console.log('Verified that the Max date input is present and visible.');
    });

    // Test 5: Verify the presence of the Service Lines section on mobile
    test('Verify the presence of the Service Lines section on the MemorialCare Events page', async ({ page }) => {
        test.setTimeout(20000);  // Set a timeout of 20 seconds for this test
    
        await page.goto('https://memorialcare-stg.chltest2.com/events');  // Go to the Events page
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        await clickFilterResultsButton(page);  // Use the function to click the "Filter Results" button

        const serviceLinesSectionSelector = '#block-revent-service-lines';  // Selector for the Service Lines section
        const isServiceLinesSectionVisible = await page.isVisible(serviceLinesSectionSelector);  // Check if the section is visible
    
        if (isServiceLinesSectionVisible) {
            console.log('Service Lines section is present and visible.');
        } else {
            console.log('Service Lines section is not visible.');
        }
    
        expect(isServiceLinesSectionVisible).toBeTruthy();  // Assert that the section is visible
    });
    
    // Test 6: Verify the presence of the Hosted By dropdown on mobile
    test('Verify the presence of the Hosted By dropdown on mobile', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto('https://memorialcare-stg.chltest2.com/events');  // Go to the Events page
        await navigateToEventsPage(page);  // Use the function to navigate to the Events page through the mobile menu

        await clickFilterResultsButton(page);  // Use the function to click the "Filter Results" button

        const filterResultsSectionSelector = '.sidebar-content__filter';  // Selector for the Filter Results section
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });  // Wait for the section to become visible
        console.log('Filter Results section is visible');

        const hostedByDropdownSelector = '#block-revent-hosted-by .facets-widget-dropdown';  // Selector for the Hosted By dropdown
        const isHostedByDropdownVisible = await page.isVisible(hostedByDropdownSelector);  // Check if the dropdown is visible
        expect(isHostedByDropdownVisible).toBe(true);  // Assert that the dropdown is visible
        console.log('Verified that the Hosted By dropdown is present and visible.');
    });
});