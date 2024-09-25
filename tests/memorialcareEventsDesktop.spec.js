const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Events Page Test', () => {
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

    test('Verify that the current events load when the page loads', async () => {
        test.setTimeout(90000);
       
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');

        const eventCardSelector = '.event-listing__event-card';
        await page.waitForSelector(eventCardSelector, { state: 'visible', timeout: 15000 });
        const eventCards = await page.$$(eventCardSelector);
        
        expect(eventCards.length).toBeGreaterThan(0);
        console.log(`Verified that ${eventCards.length} event(s) are loaded on the page.`);
    });

    test('Verify that the "Learn More" links on the first two event cards are present and visible', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const eventCardSelector = '.event-listing__event-card';
        const learnMoreButtonSelector = '.button';
    
        const firstLearnMoreButton = `${eventCardSelector}:nth-child(1) ${learnMoreButtonSelector}`;
        const isFirstLearnMoreButtonVisible = await page.isVisible(firstLearnMoreButton);
        expect(isFirstLearnMoreButtonVisible).toBe(true);
        console.log('Verified that the first "Learn More" link is present and visible.');
    
        const secondLearnMoreButton = `${eventCardSelector}:nth-child(2) ${learnMoreButtonSelector}`;
        const isSecondLearnMoreButtonVisible = await page.isVisible(secondLearnMoreButton);
        expect(isSecondLearnMoreButtonVisible).toBe(true);
        console.log('Verified that the second "Learn More" link is present and visible.');
    });

    test('Verify that the keyword filter input is present and visible', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');

        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';

        const isKeywordInputVisible = await page.isVisible(keywordInputSelector);
        expect(isKeywordInputVisible).toBe(true);
        console.log('Verified that the keyword filter input is present and visible.');
    });

    test('Verify that the Event Date min/max inputs are present and visible', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const minDateInputSelector = 'input[data-drupal-selector="edit-date-range-min"] + input';
        const maxDateInputSelector = 'input[data-drupal-selector="edit-date-range-max"] + input';

        const isMinDateInputVisible = await page.isVisible(minDateInputSelector);
        expect(isMinDateInputVisible).toBe(true);
        console.log('Verified that the Min date input is present and visible.');
    
        const isMaxDateInputVisible = await page.isVisible(maxDateInputSelector);
        expect(isMaxDateInputVisible).toBe(true);
        console.log('Verified that the Max date input is present and visible.');
    });    

    test('Verify presence of Service Line block', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const serviceLineBlockSelector = '#block-revent-service-lines';

        const isServiceLineBlockVisible = await page.isVisible(serviceLineBlockSelector);
        expect(isServiceLineBlockVisible).toBe(true);
        console.log('Verified that the Service Line block is present and visible.');
    });
    
    test('Verify presence of Category block', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const categoryBlockSelector = '#block-revent-category';

        const isCategoryBlockVisible = await page.isVisible(categoryBlockSelector);
        expect(isCategoryBlockVisible).toBe(true);
        console.log('Verified that the Category block is present and visible.');
    });
    
    test('Verify presence of Hosted By block', async () => {
        await page.goto('https://www.memorialcare.org/events', { waitUntil: 'networkidle' });
        console.log('Navigated to MemorialCare events page');
    
        const hostedByBlockSelector = '#block-revent-hosted-by';

        const isHostedByBlockVisible = await page.isVisible(hostedByBlockSelector);
        expect(isHostedByBlockVisible).toBe(true);
        console.log('Verified that the Hosted By block is present and visible.');
    });

});
