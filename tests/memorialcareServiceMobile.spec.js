const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Services Tests - Mobile View', () => {

  test('Verify the find a service alphabetical selection filter functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://www.memorialcare.org/services';
    await page.goto(url);
    console.log('Navigated to MemorialCare Services page');

    const alphabeticalLinksSelector = '.search-marquee__glossary .facet-item.glossaryaz a';
    const alphabetLetters = await page.$$eval(alphabeticalLinksSelector, links => links.map(link => link.textContent.trim()));

    for (const letter of alphabetLetters) {
      console.log(`Testing alphabetical filter: ${letter}`);
      await page.click(`.search-marquee__glossary .facet-item.glossaryaz a[href*="glossary%3A${letter}"]`);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      expect(currentUrl).toContain(`glossary%3A${letter}`);
      console.log(`Verified filter for letter ${letter} with URL: ${currentUrl}`);

      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  });

  test('Verify the first condition selector functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://www.memorialcare.org/services';
    await page.goto(url);
    console.log('Navigated to MemorialCare Services page');

    const applyMoreFiltersButton = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(applyMoreFiltersButton);
    console.log('Clicked on Apply More Filters button');

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

  test('Verify the first location selector functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://www.memorialcare.org/services';
    await page.goto(url);
    console.log('Navigated to MemorialCare Services page');

    const applyMoreFiltersButton = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(applyMoreFiltersButton);
    console.log('Clicked on Apply More Filters button');

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

  test('Verify that the search form functions correctly on mobile', async ({ page }) => {
    test.setTimeout(150000);

    const url = 'https://www.memorialcare.org/services';
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
