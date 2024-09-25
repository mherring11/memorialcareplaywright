const { test, expect } = require('@playwright/test');

test.describe('MemorialCare Services Alphabetical Filter Tests', () => {

  test('Verify the presence of alphabet letters for service selection on mobile', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://memorialcare-stg.chltest2.com/services';
    await page.goto(url);
    console.log('Navigated to MemorialCare Services page');

    const alphabeticalLinksSelector = '.search-marquee__glossary .facet-item.glossaryaz a';
    const alphabetLetters = await page.$$eval(alphabeticalLinksSelector, links => links.map(link => link.textContent.trim()));

    const expectedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => !['X', 'Z'].includes(letter));

    for (const letter of expectedLetters) {
        const isPresent = alphabetLetters.includes(letter);
        expect(isPresent).toBe(true);
        console.log(`Verified that letter ${letter} is present`);
    }
});


  test('Verify the first condition selector functions correctly', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://memorialcare-stg.chltest2.com/services';
    await page.goto(url);
    console.log('Navigated to MemorialCare Services page');

    const conditionDropdownSelector = '.sidebar-content__filter .facets-widget-dropdown';
    const conditionOptionsSelector = `${conditionDropdownSelector} .choices__item--choice`;

    const firstConditionOption = await page.$eval(conditionOptionsSelector, option => ({
        text: option.textContent.trim(),
        value: option.getAttribute('data-value')
    }));

    console.log(`Testing condition filter: ${firstConditionOption.text}`);

    await page.click(`${conditionDropdownSelector} .choices__inner`);
    await page.waitForSelector(`.choices__item[data-value="${firstConditionOption.value}"]`, { visible: true });

    await page.click(`.choices__item[data-value="${firstConditionOption.value}"]`);
    await page.waitForLoadState('networkidle');

    const currentUrl = page.url();
    expect(currentUrl).toContain('condition');
    console.log(`Verified filter for condition ${firstConditionOption.text} with URL: ${currentUrl}`);
    });

    test('Verify the first location selector functions correctly', async ({ page }) => {
        test.setTimeout(150000);
    
        const url = 'https://memorialcare-stg.chltest2.com/services';
        await page.goto(url);
        console.log('Navigated to MemorialCare Services page');

        const locationDropdownSelector = '#block-find-a-service-locations-all .facets-widget-dropdown';
        const locationOptionsSelector = `${locationDropdownSelector} .choices__item--choice`;

        const firstLocationOption = await page.$eval(locationOptionsSelector, option => ({
            text: option.textContent.trim(),
            value: option.getAttribute('data-value')
        }));
    
        console.log(`Testing location filter: ${firstLocationOption.text}`);

        await page.click(`${locationDropdownSelector} .choices__inner`);
        await page.waitForSelector(`.choices__item[data-value="${firstLocationOption.value}"]`, { visible: true });
    
        await page.click(`.choices__item[data-value="${firstLocationOption.value}"]`);
        await page.waitForLoadState('networkidle');
    
        const currentUrl = page.url();
        expect(currentUrl).toContain('location');
        console.log(`Verified filter for location ${firstLocationOption.text} with URL: ${currentUrl}`);
    });

    test('Verify that the search form functions correctly', async ({ page }) => {
        test.setTimeout(150000);
    
        const url = 'https://memorialcare-stg.chltest2.com/services';
        await page.goto(url);
        console.log('Navigated to MemorialCare Services page');
   
        const searchInputSelector = '.search-marquee__input';
        await page.fill(searchInputSelector, 'lung');
        console.log('Entered search term: lung');

        await page.press(searchInputSelector, 'Enter');
        await page.waitForLoadState('networkidle');
    
        const currentUrl = page.url();
        expect(currentUrl).toContain('query=lung');
        console.log(`Verified search with query 'lung' in URL: ${currentUrl}`);
    });
    
});