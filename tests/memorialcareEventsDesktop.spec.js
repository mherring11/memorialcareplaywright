const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Events Page Test', () => {

    test('Verify that the current events load when the page loads', async ({ page }) => {
        test.setTimeout(90000); 
       
        await page.goto('https://www.memorialcare.org/events');

        const eventCardSelector = '.event-listing__event-card';
        
        await page.waitForSelector(eventCardSelector, { state: 'visible', timeout: 15000 });

        const eventCards = await page.$$(eventCardSelector);
        expect(eventCards.length).toBeGreaterThan(0);

        console.log(`Verified that ${eventCards.length} event(s) are loaded on the page.`);
    });
    
    test('Verify that the "Learn More" link on the first two event cards functions properly', async ({ page }) => {
        test.setTimeout(90000);
        
        await page.goto('https://www.memorialcare.org/events');
        console.log('Navigated to MemorialCare events page');

        const eventCardSelector = '.event-listing__event-card';
        const learnMoreButtonSelector = '.button';

        const firstEventCard = `${eventCardSelector}:nth-child(1)`;
        const firstLearnMoreButton = `${firstEventCard} ${learnMoreButtonSelector}`;

        await page.waitForSelector(firstLearnMoreButton, { state: 'visible', timeout: 15000 });
        console.log('First "Learn More" link is visible');

        await page.click(firstLearnMoreButton);
        await page.waitForLoadState('domcontentloaded');
        console.log('Clicked on the first "Learn More" link');

        let url = page.url();
        expect(url).not.toBe('https://www.memorialcare.org/events');
        console.log('Verified that the first "Learn More" link navigates away from the events page');

        await page.goBack();
        await page.waitForSelector(firstLearnMoreButton, { state: 'visible', timeout: 15000 });

        const secondEventCard = `${eventCardSelector}:nth-child(2)`;
        const secondLearnMoreButton = `${secondEventCard} ${learnMoreButtonSelector}`;

        await page.waitForSelector(secondLearnMoreButton, { state: 'visible', timeout: 15000 });
        console.log('Second "Learn More" link is visible');

        await page.click(secondLearnMoreButton);
        await page.waitForLoadState('domcontentloaded');
        console.log('Clicked on the second "Learn More" link');

        url = page.url();
        expect(url).not.toBe('https://www.memorialcare.org/events');
        console.log('Verified that the second "Learn More" link navigates away from the events page');
    });

    test('Verify that the keyword filter functions correctly with the word "diabetes"', async ({ page }) => {
        test.setTimeout(90000);
        
        await page.goto('https://www.memorialcare.org/events');
        console.log('Navigated to MemorialCare events page');
        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';

        await page.waitForSelector(keywordInputSelector, { state: 'visible', timeout: 15000 });
        await page.fill(keywordInputSelector, 'diabetes');
        console.log('Entered keyword: diabetes');

        await page.press(keywordInputSelector, 'Enter');
        console.log('Submitted the keyword search');

        const resultsContainerSelector = '.event-listing__results';
        await page.waitForSelector(resultsContainerSelector, { state: 'visible', timeout: 15000 });
        console.log('Search results are visible');

        const resultItemsSelector = '.event-listing__event-card';
        const resultsCount = await page.$$eval(resultItemsSelector, results => results.length);

        expect(resultsCount).toBeGreaterThan(0);
        console.log(`Verified that there are ${resultsCount} results for the keyword "diabetes"`);

        const eventTitles = await page.$$eval(`${resultItemsSelector} h3`, titles => titles.map(title => title.textContent));
        eventTitles.forEach((title, index) => {
            console.log(`Event ${index + 1}: ${title.trim()}`);
        });
    });

    test('Verify that the Event Date min/max inputs are present and visible', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/events');
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

    test('Verify and select the first Service Line option and log the selected value', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/events');
        console.log('Navigated to MemorialCare events page');
    
        const serviceLineDropdownSelector = '.sidebar-content__filter .facets-widget-dropdown';
        const firstOptionSelector = '.choices__item--choice.choices__item--selectable';

        await page.click(serviceLineDropdownSelector);
        console.log('Clicked on the Service Lines dropdown');

        await page.waitForSelector(firstOptionSelector, { state: 'visible', timeout: 15000 });
        console.log('First option in Service Lines is visible');
    
        const selectedOptionText = await page.textContent(firstOptionSelector);
        console.log(`First option in Service Lines: ${selectedOptionText.trim()}`);
    
        await page.click(firstOptionSelector);
        console.log(`Selected the first Service Line option: ${selectedOptionText.trim()}`);
    });
    
    test('Verify and select the first Category option and log the selected value', async ({ page }) => {
        test.setTimeout(30000);
    
        await page.goto('https://www.memorialcare.org/events');
        console.log('Navigated to MemorialCare events page');
    
        const categoryDropdownSelector = '#block-revent-category .facets-widget-dropdown';
        const firstCategoryOptionSelector = '#block-revent-category .choices__item--choice.choices__item--selectable:first-child';
    
        await page.click(categoryDropdownSelector);
        console.log('Clicked on the Category dropdown');
    
        await page.waitForSelector(firstCategoryOptionSelector, { state: 'visible', timeout: 15000 });
        console.log('First option in Category is visible');
    
        const selectedOptionText = await page.textContent(firstCategoryOptionSelector);
        console.log(`First option in Category: ${selectedOptionText.trim()}`);
    
        await page.click(firstCategoryOptionSelector);
        console.log(`Selected the first Category option: ${selectedOptionText.trim()}`);
    });
    
    test('Verify and select the first Hosted By option and log the selected value', async ({ page }) => {
        test.setTimeout(30000);
    
        await page.goto('https://www.memorialcare.org/events');
        console.log('Navigated to MemorialCare events page');
    
        const hostedByDropdownSelector = '#block-revent-hosted-by .facets-widget-dropdown';
        const firstHostedByOptionSelector = '#block-revent-hosted-by .choices__item--choice.choices__item--selectable:first-child';
    
        await page.click(hostedByDropdownSelector);
        console.log('Clicked on the Hosted By dropdown');
    
        await page.waitForSelector(firstHostedByOptionSelector, { state: 'visible', timeout: 15000 });
        console.log('First option in Hosted By is visible');
    
        const selectedOptionText = await page.textContent(firstHostedByOptionSelector);
        console.log(`First option in Hosted By: ${selectedOptionText.trim()}`);
    
        await page.click(firstHostedByOptionSelector);
        console.log(`Selected the first Hosted By option: ${selectedOptionText.trim()}`);
    });
    
});
