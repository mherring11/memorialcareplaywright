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

    test('Verify that the "Learn More" links on the first two event cards are present and visible on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        const firstLearnMoreSelector = '.event-listing__event-card:nth-child(1) .button';
        const isFirstLearnMoreVisible = await page.isVisible(firstLearnMoreSelector);
        expect(isFirstLearnMoreVisible).toBe(true);
        console.log('Verified that the first "Learn More" link is present and visible.');

        const secondLearnMoreSelector = '.event-listing__event-card:nth-child(2) .button';
        const isSecondLearnMoreVisible = await page.isVisible(secondLearnMoreSelector);
        expect(isSecondLearnMoreVisible).toBe(true);
        console.log('Verified that the second "Learn More" link is present and visible.');
    });

    test('Verify the presence of the keyword input field on mobile', async ({ page }) => {
        test.setTimeout(30000); 

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');

        const keywordInputSelector = 'input[data-drupal-selector="edit-aggregated-field"]';
        const isKeywordInputVisible = await page.isVisible(keywordInputSelector);
        expect(isKeywordInputVisible).toBe(true);
        console.log('Verified that the keyword input field is present and visible.');
    });

    test('Verify that the Event Date min/max inputs are present and visible on mobile', async ({ page }) => {
        test.setTimeout(30000); 

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
        await page.waitForSelector(filterResultsButtonSelector, { state: 'visible', timeout: 10000 });
        await page.click(filterResultsButtonSelector);
        console.log('Clicked on the Filter Results button');

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 15000 });
        console.log('Filter Results section is visible');

        const minDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="Start"]';
        const maxDateInputSelector = 'input.form-text.form-item__text.form-control.input[placeholder="End"]';

        const isMinDateInputVisible = await page.isVisible(minDateInputSelector);
        expect(isMinDateInputVisible).toBe(true); 
        console.log('Verified that the Min date input is present and visible.');

        const isMaxDateInputVisible = await page.isVisible(maxDateInputSelector);
        expect(isMaxDateInputVisible).toBe(true); 
        console.log('Verified that the Max date input is present and visible.');
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
    
    test('Verify the presence of the Hosted By dropdown on mobile', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/');
        await navigateToEventsPage(page);

        await clickFilterResultsButton(page);

        const filterResultsSectionSelector = '.sidebar-content__filter';
        await page.waitForSelector(filterResultsSectionSelector, { state: 'visible', timeout: 30000 });
        console.log('Filter Results section is visible');

        const hostedByDropdownSelector = '#block-revent-hosted-by .facets-widget-dropdown';
        const isHostedByDropdownVisible = await page.isVisible(hostedByDropdownSelector);
        expect(isHostedByDropdownVisible).toBe(true);
        console.log('Verified that the Hosted By dropdown is present and visible.');
    });
});
