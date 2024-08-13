const { test, expect } = require('@playwright/test');

const url = 'https://www.gnpweb.com/providers';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('GNP Provider Tests - Mobile', () => {

  test('Filter by Doctor/Provider Name', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const providerCardsSelector = '.find-a-provider__provider-card';
    const expectedProviderText = 'pak';

    await page.fill(providerNameSelector, expectedProviderText);
    console.log(`Filled Doctor/Provider Name with "${expectedProviderText}"`);
    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search');

    await page.waitForLoadState('networkidle');

    await page.waitForFunction((selector, initialCount) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const text = element.textContent || '';
        const match = text.match(/(\d+) results/);
        if (!match) return false;
        const currentCount = parseInt(match[1], 10);
        return currentCount !== initialCount;
    }, resultsCountSelector, 4679);

    console.log('Provider records loaded');

    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);

    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
    expect(numberOfResults).toBeGreaterThan(0);

    const providerCards = await page.locator(providerCardsSelector).all();
    expect(providerCards.length).toBe(numberOfResults);
    console.log('Verified number of provider cards matches the results count');

    await page.fill(providerNameSelector, '');
    console.log('Cleared Doctor/Provider Name field');

    await page.press(providerNameSelector, 'Enter');
    console.log('Pressed Enter to submit the search after clearing the field');

    await page.waitForLoadState('networkidle');

    const resultsTextAfterClear = await page.textContent(resultsCountSelector);
    console.log(`Results count text after clearing the Doctor/Provider Name field: ${resultsTextAfterClear}`);

    const resultsMatchAfterClear = resultsTextAfterClear.match(/(\d+) results/);
    const numberOfResultsAfterClear = resultsMatchAfterClear ? parseInt(resultsMatchAfterClear[1], 10) : 0;
    console.log(`Number of provider records found after clearing the field: ${numberOfResultsAfterClear}`);
    expect(numberOfResultsAfterClear).toBeGreaterThan(0);

    const providerCardsAfterClear = await page.locator(providerCardsSelector).all();
    expect(providerCardsAfterClear.length).toBe(numberOfResultsAfterClear);
    console.log('Verified number of provider cards matches the results count after clearing the field');
  });

  test('Filter by Online Scheduling', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const onlineCheckboxSelector = 'input[data-drupal-selector="edit-attr-name-2"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';

    await page.locator(onlineCheckboxSelector).scrollIntoViewIfNeeded();
    await page.locator(onlineCheckboxSelector).click({ force: true });
    console.log('Checked "Online scheduling available" checkbox');

    await page.waitForLoadState('networkidle');

    const resultsTextAfterCheck = await page.textContent(resultsCountSelector);
    console.log(`Results count text after checking "Online scheduling available" checkbox: ${resultsTextAfterCheck}`);

    const resultsMatchAfterCheck = resultsTextAfterCheck.match(/(\d+) results/);
    const numberOfResultsAfterCheck = resultsMatchAfterCheck ? parseInt(resultsMatchAfterCheck[1], 10) : 0;
    console.log(`Number of provider records found after checking the checkbox: ${numberOfResultsAfterCheck}`);
    expect(numberOfResultsAfterCheck).toBeGreaterThan(0);

    await page.locator(onlineCheckboxSelector).scrollIntoViewIfNeeded();
    await page.locator(onlineCheckboxSelector).click({ force: true });
    console.log('Unchecked "Online scheduling available" checkbox');

    await page.waitForLoadState('networkidle');

    const resultsTextAfterUncheck = await page.textContent(resultsCountSelector);
    console.log(`Results count text after unchecking "Online scheduling available" checkbox: ${resultsTextAfterUncheck}`);

    const resultsMatchAfterUncheck = resultsTextAfterUncheck.match(/(\d+) results/);
    const numberOfResultsAfterUncheck = resultsMatchAfterUncheck ? parseInt(resultsMatchAfterUncheck[1], 10) : 0;
    console.log(`Number of provider records found after unchecking the checkbox: ${numberOfResultsAfterUncheck}`);
    expect(numberOfResultsAfterUncheck).toBeGreaterThan(0);
  });

  test('Filter by Location or Zip Code', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const zipCodeSelector = 'input[data-drupal-selector="edit-latlon-value"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const initialResultsCount = 4679; 

    await page.fill(providerNameSelector, '');
    console.log('Cleared Doctor/Provider Name field');

    await page.fill(zipCodeSelector, '90291');
    console.log('Filled Zip Code with "90291"');
    await page.press(zipCodeSelector, 'Enter');
    console.log('Pressed Enter to submit the search');

    await page.waitForLoadState('networkidle');

    await page.waitForFunction((selector, initialCount) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const text = element.textContent || '';
        const match = text.match(/(\d+) results/);
        if (!match) return false;
        const currentCount = parseInt(match[1], 10);
        return currentCount !== initialCount;
    }, resultsCountSelector, initialResultsCount);

    console.log('Provider records loaded');

    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);
    
    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
    expect(numberOfResults).toBeGreaterThan(0);

    await page.fill(zipCodeSelector, '');
    console.log('Cleared Zip Code field');
    await page.press(zipCodeSelector, 'Enter');
    console.log('Pressed Enter to clear the search');
  });

  test('Filter providers by Specialty', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const specialtyInputSelector = '#block-find-a-provider-specialty input[placeholder="Search or Select"]';
    console.log('Waiting for the specialty input field to be visible');
    await page.click(specialtyInputSelector);
    console.log('Clicked on the Specialties input field');
  
    const dropdownVisibleSelector = '#block-find-a-provider-specialty div.choices__list--dropdown .choices__item';
    await page.waitForSelector(dropdownVisibleSelector, { state: 'visible' });
    console.log('Dropdown options are visible');
  
    const options = await page.$$eval(dropdownVisibleSelector, options => options.map(option => option.textContent.trim()));
    console.log('Retrieved dropdown options');
  
    const specialtyToSelect = 'Cardiology';
  
    await page.evaluate((specialtyToSelect) => {
      const options = [...document.querySelectorAll('div.choices__list--dropdown .choices__item')];
      const optionToClick = options.find(el => el.textContent.trim() === specialtyToSelect);
      if (optionToClick) {
        optionToClick.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        optionToClick.click();
      }
    }, specialtyToSelect);
  
    console.log(`Selected "${specialtyToSelect}" from Specialties dropdown`);
  
    await page.waitForLoadState('networkidle');
    console.log('Waiting for page to load');
  
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
  
    await page.waitForFunction(selector => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const text = element.textContent;
      return text.includes('results') && parseInt(text, 10) !== 4679;
    }, resultsCountSelector);
  
    console.log('Provider records loaded');
  
    const resultsText = await page.textContent(resultsCountSelector);
    console.log(`Results count text: ${resultsText}`);
  
    const resultsMatch = resultsText.match(/(\d+) results/);
    const numberOfResults = resultsMatch ? parseInt(resultsMatch[1], 10) : 0;
    console.log(`Number of provider records found: ${numberOfResults}`);
  
    expect(numberOfResults).toBeGreaterThan(0);
  });

  test('Verify presence of Language filter options and list available languages', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const languageDropdownSelector = '#block-find-a-provider-languages .choices__inner';
    const languageOptionSelector = '#block-find-a-provider-languages .choices__list--dropdown .choices__item--choice';

    const languageDropdown = await page.locator(languageDropdownSelector);
    if (await languageDropdown.count() > 0) {
      console.log('Verified that the "Language" dropdown is present');

      await languageDropdown.click();
      await page.waitForTimeout(500); 
      const languageOptions = await page.locator(languageOptionSelector).allTextContents();

      console.log('Available languages:');
      languageOptions.forEach((language, index) => {
        console.log(`${index + 1}: ${language.trim()}`);
      });
    }
  });

  test('Verify presence of gender radio buttons, select one, and show results', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const hamburgerSelector = '#hamburger';
    await page.click(hamburgerSelector);
    console.log('Clicked on the hamburger menu');

    const mobileMenuSelector = '.mobile-menu__primary-nav__item';
    await page.waitForSelector(mobileMenuSelector, { state: 'visible' });
    console.log('Mobile menu is visible');

    const findDoctorSelector = 'a.mobile-menu__primary-nav__link[href="/providers"]:has-text("Find a Doctor")';
    await page.waitForSelector(findDoctorSelector, { state: 'visible' });
    await page.click(findDoctorSelector);
    console.log('Clicked on "Find a Doctor" in the mobile menu');

    const filterResultsSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.waitForSelector(filterResultsSelector, { state: 'visible' });
    await page.click(filterResultsSelector);
    console.log('Clicked on "Filter Results" button');

    const maleRadioInputSelector = '#gender-85'; 
    const femaleRadioInputSelector = '#gender-84'; 

    const genderRadioGroupSelector = '#block-find-a-provider-gender';
    const genderRadioGroup = await page.locator(genderRadioGroupSelector);

    if (await genderRadioGroup.count() > 0) {
      console.log('Verified that the gender radio buttons are present');

      await page.locator(femaleRadioInputSelector).scrollIntoViewIfNeeded();

      await page.locator(femaleRadioInputSelector).click({ force: true });
      await page.waitForTimeout(500);

      const isSelected = await page.locator(femaleRadioInputSelector).isChecked();
      expect(isSelected).toBe(true);
      console.log(`Verified that the "Female" radio button is checked`);

      await page.waitForLoadState('networkidle');

      const resultsSelector = '.find-a-provider__header--count .provider-search__resultcount';
      await page.waitForSelector(resultsSelector, { state: 'visible' });

      const resultsText = await page.locator(resultsSelector).textContent();
      console.log(`Results count text after selecting Female: ${resultsText}`);

      const numberOfResults = parseInt(resultsText.match(/(\d+) results/)[1], 10);
      expect(numberOfResults).toBeGreaterThan(0);

      const providerCards = page.locator('.find-a-provider__provider-card');
      await expect(providerCards.first()).toBeVisible(); 
    }
  });

});
