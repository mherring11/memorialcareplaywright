const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Events Page Mobile Test', () => {
    async function clickFilterResultsButton(page) {
        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                await page.waitForSelector(filterResultsButtonSelector, { state: 'visible', timeout: 5000 });
                
                await page.waitForTimeout(2000);

                await page.click(filterResultsButtonSelector, { force: true });
                console.log(`Clicked on the Filter Results button on attempt ${attempt + 1}`);

                const filterResultsSectionSelector = '.sidebar-content__filter';
                const isFilterResultsVisible = await page.isVisible(filterResultsSectionSelector);

                if (isFilterResultsVisible) {
                    console.log('Filter Results section is visible after clicking the button.');
                    return;
                } else {
                    console.log('Filter Results section is not visible, retrying...');
                }
            } catch (error) {
                console.log(`Attempt ${attempt + 1} failed. Retrying...`);
            }
        }

        throw new Error('Failed to click on the Filter Results button and display the Filter Results section after multiple attempts.');
    }

    async function navigateToEventsPage(page) {
        const hamburgerButtonSelector = '.site-header__primary-nav__item--mobile .site-header__primary-nav__hamburger__trigger';
        await page.click(hamburgerButtonSelector);
        console.log('Clicked on the hamburger button to open the mobile menu');

        const eventsButtonSelector = '.mobile-menu__primary-nav-item a[href="/events"]';
        await page.click(eventsButtonSelector);
        console.log('Clicked on the Events button in the mobile menu');
    }

    test('Verify that the current events load when the page loads on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        const eventCardSelector = '.event-listing__event-card';
        await page.waitForSelector(eventCardSelector, { state: 'visible', timeout: 15000 });
        
        const eventCards = await page.$$(eventCardSelector);
        expect(eventCards.length).toBeGreaterThan(0);
        console.log(`Verified that ${eventCards.length} event(s) are loaded on the page.`);
    });

    test('Verify that the "Learn More" link on the first two event cards functions properly on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        const firstLearnMoreSelector = '.event-listing__event-card:nth-child(1) .button';
        await page.waitForSelector(firstLearnMoreSelector, { state: 'visible', timeout: 15000 });
        await page.click(firstLearnMoreSelector);
        await page.waitForLoadState('domcontentloaded');
        console.log('Clicked on the first "Learn More" link');

        let currentUrl = page.url();
        expect(currentUrl).not.toBe('https://www.memorialcare.org/events');
        console.log('Verified that the first "Learn More" link navigates away from the events page');

        await page.goBack();
        await page.waitForSelector(firstLearnMoreSelector, { state: 'visible', timeout: 15000 });

        const secondLearnMoreSelector = '.event-listing__event-card:nth-child(2) .button';
        await page.waitForSelector(secondLearnMoreSelector, { state: 'visible', timeout: 15000 });
        console.log('Second "Learn More" link is visible');

        await page.click(secondLearnMoreSelector);
        await page.waitForLoadState('domcontentloaded');
        console.log('Clicked on the second "Learn More" link');

        currentUrl = page.url();
        expect(currentUrl).not.toBe('https://www.memorialcare.org/events');
        console.log('Verified that the second "Learn More" link navigates away from the events page');
    });

    test('Verify that the keyword filter functions correctly with the word "diabetes" on mobile', async ({ page }) => {
        test.setTimeout(30000); 

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');

        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';
        await page.waitForSelector(keywordInputSelector, { state: 'visible', timeout: 15000 });
        console.log('Keyword input field is visible');

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

    test('Verify that the Event Date min/max inputs are present and visible on mobile', async ({ page }) => {
        test.setTimeout(30000); 
    
        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);
    
        await clickFilterResultsButton(page);
    
        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');
    
        await page.waitForTimeout(2000);
    
        const visibleMinDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="Start"]';
        const visibleMaxDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="End"]';
    
        const isMinDateInputVisible = await page.isVisible(visibleMinDateInputSelector);
        console.log(`Min date input visibility: ${isMinDateInputVisible}`);
        expect(isMinDateInputVisible).toBe(true); 
        console.log('Verified that the Min date input is present and visible.');
    
        const isMaxDateInputVisible = await page.isVisible(visibleMaxDateInputSelector);
        console.log(`Max date input visibility: ${isMaxDateInputVisible}`);
        expect(isMaxDateInputVisible).toBe(true); 
        console.log('Verified that the Max date input is present and visible.');
    });
    
    test('Verify and select the first Service Line option and log the selected value on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');

        const serviceLineDropdownSelector = '.sidebar-content__filter .facets-widget-dropdown';
        await page.click(serviceLineDropdownSelector);
        console.log('Clicked on the Service Lines dropdown');

        const firstOptionSelector = '.choices__item--choice.choices__item--selectable';
        await page.waitForSelector(firstOptionSelector, { state: 'visible', timeout: 15000 });
        console.log('First option in Service Lines is visible');

        const selectedOptionText = await page.textContent(firstOptionSelector);
        console.log(`First option in Service Lines: ${selectedOptionText.trim()}`);

        await page.evaluate((selector) => document.querySelector(selector).scrollIntoView(), firstOptionSelector);
        await page.click(firstOptionSelector, { force: true });
        console.log(`Selected the first Service Line option: ${selectedOptionText.trim()}`);
    });

    test('Verify the presence of the Service Lines section on the MemorialCare Events page', async ({ page }) => {
        test.setTimeout(20000); 
    
        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);
    
        const serviceLinesSectionSelector = '#block-revent-service-lines';
        const isServiceLinesSectionVisible = await page.isVisible(serviceLinesSectionSelector);
    
        if (isServiceLinesSectionVisible) {
            console.log('Service Lines section is present and visible.');
        } else {
            console.log('Service Lines section is not visible.');
        }
    
        expect(isServiceLinesSectionVisible).toBeTruthy();
    });
    
    test('Verify and select the first Hosted By option and log the selected value on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');

        const hostedByDropdownSelector = '#block-revent-hosted-by .facets-widget-dropdown';
        await page.click(hostedByDropdownSelector);
        console.log('Clicked on the Hosted By dropdown');

        const firstHostedByOptionSelector = '#block-revent-hosted-by .choices__item--choice.choices__item--selectable:first-child';
        await page.waitForSelector(firstHostedByOptionSelector, { state: 'visible', timeout: 15000 });
        console.log('First option in Hosted By is visible');

        const selectedOptionText = await page.textContent(firstHostedByOptionSelector);
        console.log(`First option in Hosted By: ${selectedOptionText.trim()}`);

        await page.evaluate((selector) => document.querySelector(selector).scrollIntoView(), firstHostedByOptionSelector);
        await page.click(firstHostedByOptionSelector, { force: true });
        console.log(`Selected the first Hosted By option: ${selectedOptionText.trim()}`);
    });
});
