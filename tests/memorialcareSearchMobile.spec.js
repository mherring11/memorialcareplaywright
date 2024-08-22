const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Site Search Functionality - Mobile View', () => {

  test('Verify that the search form functions and returns properly formatted results for "lungs", "heart", and "brain" on mobile', async ({ page }) => {
    test.setTimeout(60000);
    const searchTerms = ['lungs', 'heart', 'brain'];

    for (const searchTerm of searchTerms) {
      await performSearchAndVerify(page, searchTerm);
    }

    const mobileHamburgerButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.waitForSelector(mobileHamburgerButtonSelector, { state: 'visible', timeout: 15000 });
    await page.click(mobileHamburgerButtonSelector);
    console.log('Clicked on the mobile hamburger menu');

    const servicesButtonSelector = '.mobile-menu__primary-nav-link[href="/services"]';
    await page.waitForSelector(servicesButtonSelector, { state: 'visible', timeout: 15000 });
    await page.click(servicesButtonSelector);
    console.log('Clicked on the Services button in the mobile menu');

    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/services');
    console.log('Verified that the page navigated to the Services page');
  });

});

async function performSearchAndVerify(page, searchTerm) {
    const url = 'https://www.memorialcare.org/search';
    await page.goto(url);
    console.log(`Navigated to MemorialCare search page for term: ${searchTerm}`);

    const searchInputSelector = 'input[data-drupal-selector="edit-query"]:visible';
    const searchButtonSelector = 'button[data-drupal-selector="edit-submit"]:visible';

    await page.waitForSelector(searchInputSelector, { state: 'visible', timeout: 15000 });
    await page.fill(searchInputSelector, searchTerm);
    console.log(`Entered search term: ${searchTerm}`);

    await page.waitForSelector(searchButtonSelector, { state: 'visible', timeout: 15000 });
    await page.click(searchButtonSelector);
    console.log(`Clicked search for term: ${searchTerm}`);

    const resultsContainerSelector = '.container-narrow.site-search__container';
    await page.waitForSelector(resultsContainerSelector, { state: 'visible', timeout: 15000 });
    console.log('Search results container is visible');

    const tabs = [
        { name: 'All Results', param: 'all' },
        { name: 'Services', param: 'services' },
        { name: 'Providers', param: 'providers' },
        { name: 'Locations', param: 'locations' },
        { name: 'Events', param: 'events' }
    ];

    for (const tab of tabs) {
        const tabSelector = `.search-tabs__link:has-text("${tab.name}")`;

        await page.click(tabSelector);
        console.log(`Clicked on tab: ${tab.name}`);

        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        expect(currentUrl).toContain(`tab=${tab.param}`);
        console.log(`Verified URL contains the correct tab parameter: ${tab.param}`);

        const isResultsContainerVisible = await page.isVisible(resultsContainerSelector);
        expect(isResultsContainerVisible).toBe(true);
        console.log(`Search results container is visible after clicking on tab: ${tab.name}`);
    }

    const resultsSelector = '.search-card .link-icon--internal';
    const results = await page.$$eval(resultsSelector, links => links.map(link => link.href));

    if (results.length > 0) {
        console.log(`Verified that there are ${results.length} results for the term "${searchTerm}"`);
        results.forEach((link, index) => {
            expect(link).toMatch(/^https?:\/\/.+/);
            console.log(`Result ${index + 1}: ${link}`);
        });
        console.log(`Verified that each result has a valid link to the result page for term "${searchTerm}"`);
    } else {
        console.log(`No results found for the term "${searchTerm}".`);
    }
}
