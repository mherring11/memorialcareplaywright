const { test, expect } = require('@playwright/test');

// Describe the test suite for the MemorialCare Events page
test.describe('MemorialCare Events Page Test', () => {
    let context;  // Declare a variable for the browser context
    let page;  // Declare a variable for the page instance

    // Before each test, create a new browser context and a new page instance
    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();  // Create a new isolated browser context
        page = await context.newPage();  // Create a new page in the context
    });

    // After each test, close the page and the context to free resources
    test.afterEach(async () => {
        await page.close();  // Close the current page
        await context.close();  // Close the browser context
    });

    // Test 1: Verify that events are loaded when the page is accessed
    test('Verify that the current events load when the page loads', async () => {
        test.setTimeout(90000);  // Set a custom timeout for this test

        // Navigate to the events page and wait for the network to become idle (no ongoing requests)
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');

        const eventCardSelector = '.event-listing__event-card';  // Selector for event cards
        await page.waitForSelector(eventCardSelector, { state: 'visible', timeout: 15000 });  // Wait for the event cards to become visible

        const eventCards = await page.$$(eventCardSelector);  // Get all event card elements
        expect(eventCards.length).toBeGreaterThan(0);  // Assert that at least one event card is present
        console.log(`Verified that ${eventCards.length} event(s) are loaded on the page.`);
    });

    // Test 2: Verify that the "Learn More" links on the first two event cards are visible and functional
    test('Verify that the "Learn More" links on the first two event cards are present and visible', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const eventCardSelector = '.event-listing__event-card';  // Selector for event cards
        const learnMoreButtonSelector = '.button';  // Selector for the "Learn More" button
    
        // Select and check the visibility of the "Learn More" button on the first event card
        const firstLearnMoreButton = `${eventCardSelector}:nth-child(1) ${learnMoreButtonSelector}`;
        const isFirstLearnMoreButtonVisible = await page.isVisible(firstLearnMoreButton);
        expect(isFirstLearnMoreButtonVisible).toBe(true);  // Assert that the button is visible
        console.log('Verified that the first "Learn More" link is present and visible.');
    
        // Select and check the visibility of the "Learn More" button on the second event card
        const secondLearnMoreButton = `${eventCardSelector}:nth-child(2) ${learnMoreButtonSelector}`;
        const isSecondLearnMoreButtonVisible = await page.isVisible(secondLearnMoreButton);
        expect(isSecondLearnMoreButtonVisible).toBe(true);  // Assert that the button is visible
        console.log('Verified that the second "Learn More" link is present and visible.');
    });

    // Test 3: Verify that the keyword filter input field is present and visible
    test('Verify that the keyword filter input is present and visible', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');

        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';  // Selector for the keyword input field

        // Check if the keyword input field is visible on the page
        const isKeywordInputVisible = await page.isVisible(keywordInputSelector);
        expect(isKeywordInputVisible).toBe(true);  // Assert that the input field is visible
        console.log('Verified that the keyword filter input is present and visible.');
    });

    // Test 4: Verify that the Event Date min/max input fields are present and visible
    test('Verify that the Event Date min/max inputs are present and visible', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const minDateInputSelector = 'input[data-drupal-selector="edit-date-range-min"] + input';  // Selector for the min date input field
        const maxDateInputSelector = 'input[data-drupal-selector="edit-date-range-max"] + input';  // Selector for the max date input field

        // Check if the min date input field is visible
        const isMinDateInputVisible = await page.isVisible(minDateInputSelector);
        expect(isMinDateInputVisible).toBe(true);  // Assert that the min date input field is visible
        console.log('Verified that the Min date input is present and visible.');
    
        // Check if the max date input field is visible
        const isMaxDateInputVisible = await page.isVisible(maxDateInputSelector);
        expect(isMaxDateInputVisible).toBe(true);  // Assert that the max date input field is visible
        console.log('Verified that the Max date input is present and visible.');
    });    

    // Test 5: Verify that the Service Line block is present and visible on the page
    test('Verify presence of Service Line block', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const serviceLineBlockSelector = '#block-revent-service-lines';  // Selector for the Service Line block

        // Check if the Service Line block is visible
        const isServiceLineBlockVisible = await page.isVisible(serviceLineBlockSelector);
        expect(isServiceLineBlockVisible).toBe(true);  // Assert that the Service Line block is visible
        console.log('Verified that the Service Line block is present and visible.');
    });
    
    // Test 6: Verify that the Category block is present and visible on the page
    test('Verify presence of Category block', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const categoryBlockSelector = '#block-revent-category';  // Selector for the Category block

        // Check if the Category block is visible
        const isCategoryBlockVisible = await page.isVisible(categoryBlockSelector);
        expect(isCategoryBlockVisible).toBe(true);  // Assert that the Category block is visible
        console.log('Verified that the Category block is present and visible.');
    });
    
    // Test 7: Verify that the Hosted By block is present and visible on the page
    test('Verify presence of Hosted By block', async () => {
        // Navigate to the events page and wait for the network to become idle
        await page.goto('https://memorialcare-stg.chltest2.com/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const hostedByBlockSelector = '#block-revent-hosted-by';  // Selector for the Hosted By block

        // Check if the Hosted By block is visible
        const isHostedByBlockVisible = await page.isVisible(hostedByBlockSelector);
        expect(isHostedByBlockVisible).toBe(true);  // Assert that the Hosted By block is visible
        console.log('Verified that the Hosted By block is present and visible.');
    });

});