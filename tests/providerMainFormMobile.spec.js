const { test, expect } = require('@playwright/test');

const url = 'https://www.memorialcare.org/providers';

test.use({ viewport: { width: 375, height: 812 } }); 
test.describe('MemorialCare Provider Tests', () => {
  test('check Online Scheduling Available', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const mobileMenuButtonSelector = 'a.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');

    await page.waitForTimeout(500);

    const mobileScheduleAppointmentSelector = 'li.mobile-menu__primary-nav-item a.mobile-menu__primary-nav-link:has-text("Schedule Appointment")';
    await page.click(mobileScheduleAppointmentSelector);
    console.log('Clicked Schedule Appointment in the mobile menu');

    const appointmentHeadingSelector = 'h1:has-text("Schedule an Appointment")';
    await expect(page.locator(appointmentHeadingSelector)).toBeVisible();
    console.log('Verified Schedule an Appointment page loaded');

    await expect(page).toHaveURL(/schedule-appointment-today/);
    console.log('Verified URL contains schedule-appointment-today');

    await page.goBack();
    console.log('Returned to providers page');

    await expect(page).toHaveURL(url);
    console.log('Verified returned to the providers page URL');

    await page.click(mobileMenuButtonSelector);
    await page.waitForTimeout(500);

    await expect(page.locator(mobileScheduleAppointmentSelector)).toBeVisible();
    console.log('Verified Schedule Appointment link is visible on providers page again');

    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to close the menu');

    await page.waitForTimeout(500);
  });
    
  test('Filter by Doctor/Provider Name', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');

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

  test('Filter by Location or Zip Code', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');
  
    const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');
  
    const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
    await page.click(findProviderLinkSelector);
    console.log('Clicked Find a Provider link');

    const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(filterResultsButtonSelector);
    console.log('Clicked Filter Results button');
  
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
  });

  test('randomly select a specialty and filter', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');
  
    const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');
  
    const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
    await page.click(findProviderLinkSelector);
    console.log('Clicked Find a Provider link');
  
    const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(filterResultsButtonSelector);
    console.log('Clicked Filter Results button');
  
    const specialtyFilterSelector = '#block-find-a-provider-specialty';
    await page.click(specialtyFilterSelector);
    console.log('Clicked on Specialty filter to reveal options');
  
    const specialtyInputSelector = 'input[placeholder="Search or Select"]';
    await page.click(specialtyInputSelector);
    console.log('Clicked on Specialties input field');
  
    const dropdownVisibleSelector = 'div.choices__list--dropdown .choices__item';
    await page.waitForSelector(dropdownVisibleSelector, { state: 'visible' });
    console.log('Dropdown options are visible');
  
    const options = await page.$$eval(dropdownVisibleSelector, options => options.map(option => option.textContent.trim()));
    const validSpecialties = options.filter(option => !option.includes('HMO') && !option.includes('Advantage'));
    const randomSpecialty = validSpecialties[Math.floor(Math.random() * validSpecialties.length)];
  
    await page.evaluate((randomSpecialty) => {
      const options = [...document.querySelectorAll('div.choices__list--dropdown .choices__item')];
      const optionToClick = options.find(el => el.textContent.trim() === randomSpecialty);
      if (optionToClick) {
        optionToClick.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        optionToClick.click();
      }
    }, randomSpecialty);
  
    console.log(`Selected "${randomSpecialty}" from Specialties dropdown`);
  
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

  test('verify hospital filter is present and one of the four hospitals is listed', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');
  
    const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');
  
    const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
    await page.click(findProviderLinkSelector);
    console.log('Clicked Find a Provider link');
  
    const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(filterResultsButtonSelector);
    console.log('Clicked Filter Results button');
  
    const hospitalFilterSelector = '#block-find-a-provider-locations';
    await page.waitForSelector(hospitalFilterSelector, { state: 'visible' });
    console.log('Hospital filter is visible');
  
    const hospitalInputSelector = 'input[placeholder="Search or Select"]';
    await page.click(hospitalInputSelector);
    console.log('Clicked on Hospitals input field');
  
    const dropdownVisibleSelector = 'div.choices__list--dropdown .choices__item';
    await page.waitForSelector(dropdownVisibleSelector, { state: 'visible' });
    console.log('Dropdown options are visible');
  
    const expectedHospitals = [
      'Long Beach Medical Center',
      'Miller Children\'s & Women\'s Hospital Long Beach',
      'Orange Coast Medical Center',
      'Saddleback Medical Center'
    ];
  
    const hospitalOptions = await page.$$eval(dropdownVisibleSelector, options => {
      return options
        .map(option => option.textContent.trim())
        .filter(option => [
          'Long Beach Medical Center',
          'Miller Children\'s & Women\'s Hospital Long Beach',
          'Orange Coast Medical Center',
          'Saddleback Medical Center'
        ].includes(option));
    });
  
    console.log(`Found hospitals: ${hospitalOptions}`);
    expect(hospitalOptions.length).toBeGreaterThan(0);
    expectedHospitals.forEach(hospital => {
      expect(hospitalOptions).toContain(hospital);
    });
  });
  
  test('verify Medical Group checkboxes sequentially', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');
  
    const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');
  
    const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
    await page.click(findProviderLinkSelector);
    console.log('Clicked Find a Provider link');
  
    const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(filterResultsButtonSelector);
    console.log('Clicked Filter Results button');
  
    const medicalGroupFilterSelector = '#block-find-a-provider-medical-groups';
    await page.waitForSelector(medicalGroupFilterSelector, { state: 'visible' });
    console.log('Medical Group filter is visible');
  
    const medicalGroups = [
      {
        id: 'medical-group-135',
        name: 'MemorialCare Medical Group',
      },
      {
        id: 'medical-group-136',
        name: 'Greater Newport Physicians MemorialCare',
      },
      {
        id: 'medical-group-137',
        name: 'Edinger Medical Group',
      },
    ];
  
    for (const group of medicalGroups) {
      const checkboxSelector = `#${group.id}`;
      console.log(`Testing checkbox for ${group.name}`);
  
      await page.locator(checkboxSelector).scrollIntoViewIfNeeded();
      await page.locator(checkboxSelector).click({ force: true });
      console.log(`Checked ${group.name}`);
  
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
  
      const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
      const resultsTextChecked = await page.textContent(resultsCountSelector);
      console.log(`Results count text after checking ${group.name}: ${resultsTextChecked}`);
  
      const numberOfResultsChecked = parseInt(resultsTextChecked.match(/(\d+) results/)[1], 10);
      expect(numberOfResultsChecked).toBeGreaterThan(0);
  
      await page.locator(checkboxSelector).click({ force: true });
      console.log(`Unchecked ${group.name}`);
  
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      const resultsTextUnchecked = await page.textContent(resultsCountSelector);
      console.log(`Results count text after unchecking ${group.name}: ${resultsTextUnchecked}`);
  
      const numberOfResultsUnchecked = parseInt(resultsTextUnchecked.match(/(\d+) results/)[1], 10);
      expect(numberOfResultsUnchecked).toBeGreaterThan(0);
    }
  
    for (const group of medicalGroups) {
      const checkboxSelector = `#${group.id}`;
      if (await page.isChecked(checkboxSelector)) {
        await page.locator(checkboxSelector).click({ force: true });
        console.log(`Unchecked ${group.name} at the end`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
  
        if (await page.isChecked(checkboxSelector)) {
          console.log(`${group.name} is still checked, retrying...`);
          await page.locator(checkboxSelector).click({ force: true });
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('Verify Medical Group and presence of Insurances Accepted filter options', async ({ page }) => {
    const url = 'https://www.memorialcare.org/providers';
    await page.goto(url);
    console.log('Navigated to providers page');
  
    const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
    await page.click(mobileMenuButtonSelector);
    console.log('Clicked mobile menu button to reveal links');
  
    const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
    await page.click(findProviderLinkSelector);
    console.log('Clicked Find a Provider link');
  
    const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
    await page.click(filterResultsButtonSelector);
    console.log('Clicked Filter Results button');
  
    const medicalGroupFilterSelector = '#block-find-a-provider-medical-groups';
    await page.waitForSelector(medicalGroupFilterSelector, { state: 'visible' });
    console.log('Medical Group filter is visible');
  
    const medicalGroup = {
      id: 'medical-group-136',
      name: 'Greater Newport Physicians MemorialCare',
    };
  
    const checkboxSelector = `#${medicalGroup.id}`;
  
    await page.locator(checkboxSelector).scrollIntoViewIfNeeded();
    await page.locator(checkboxSelector).click({ force: true });
    console.log(`Checked ${medicalGroup.name}`);
  
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const resultsTextChecked = await page.textContent(resultsCountSelector);
    
    const numberOfResultsChecked = parseInt(resultsTextChecked.match(/(\d+) results/)[1], 10);
    expect(numberOfResultsChecked).toBeGreaterThan(0);
  
    const insuranceDropdownSelector = '.facets-widget-dropdown:has-text("Insurances Accepted")';
    const insuranceOptionSelector = '.facets-widget-dropdown:has-text("Insurances Accepted") .choices__list--dropdown .choices__item--choice[data-choice-selectable]';
  
    const insuranceDropdown = await page.locator(insuranceDropdownSelector);
    if (await insuranceDropdown.count() > 0) {
      console.log('Verified that the "Insurances Accepted" dropdown is present');
  
      await insuranceDropdown.click();
      await page.waitForTimeout(500); 
  
      const insuranceOptions = await page.locator(insuranceOptionSelector).count();
  
      expect(insuranceOptions).toBeGreaterThan(0);
      console.log(`Found ${insuranceOptions} insurance options`);
  
      if (insuranceOptions > 0) {
        const firstInsuranceOptionText = await page.locator(insuranceOptionSelector).first().innerText();
        console.log(`First insurance option available: ${firstInsuranceOptionText.trim()}`);
      }
    } else {
      console.log('The "Insurances Accepted" dropdown is not present.');
    }
  
    await page.locator(checkboxSelector).scrollIntoViewIfNeeded();
    await page.locator(checkboxSelector).click({ force: true });
    console.log(`Unchecked ${medicalGroup.name}`);
  
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  
    const resultsTextUnchecked = await page.textContent(resultsCountSelector);
    
    const numberOfResultsUnchecked = parseInt(resultsTextUnchecked.match(/(\d+) results/)[1], 10);
    expect(numberOfResultsUnchecked).toBeGreaterThan(0);
  });

  test('Verify presence of Language filter options and list available languages', async ({ page }) => {
  const url = 'https://www.memorialcare.org/providers';
  await page.goto(url);
  console.log('Navigated to providers page');

  const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
  await page.click(mobileMenuButtonSelector);
  console.log('Clicked mobile menu button to reveal links');

  const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
  await page.click(findProviderLinkSelector);
  console.log('Clicked Find a Provider link');

  const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
  await page.click(filterResultsButtonSelector);
  console.log('Clicked Filter Results button');

  const languageFilterSelector = '#block-find-a-provider-languages';
  await page.waitForSelector(languageFilterSelector, { state: 'visible' });
  console.log('Language filter is visible');

  const languageDropdownSelector = '.facets-widget-dropdown:has-text("Language")';
  const languageOptionSelector = '.facets-widget-dropdown:has-text("Language") .choices__list--dropdown .choices__item--choice[data-choice-selectable]';

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
  } else {
    console.log('The "Language" dropdown is not present.');
  }
});

test('Verify presence of gender radio buttons, select one, and show results', async ({ page }) => {
  const url = 'https://www.memorialcare.org/providers';
  await page.goto(url);
  console.log('Navigated to providers page');

  const mobileMenuButtonSelector = '.site-header__primary-nav__hamburger__trigger--mobile';
  await page.click(mobileMenuButtonSelector);
  console.log('Clicked mobile menu button to reveal links');

  const findProviderLinkSelector = 'a.mobile-menu__primary-nav-link[href="/providers"]';
  await page.click(findProviderLinkSelector);
  console.log('Clicked Find a Provider link');

  const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
  await page.click(filterResultsButtonSelector);
  console.log('Clicked Filter Results button');

  const maleRadioLabelSelector = 'label[for="gender-85"]'; 
  const femaleRadioLabelSelector = 'label[for="gender-84"]'; 

  const genderRadioGroupSelector = '.facets-widget-checkbox:has-text("Prefer a male or female provider?")';
  const genderRadioGroup = await page.locator(genderRadioGroupSelector);

  if (await genderRadioGroup.count() > 0) {
    console.log('Verified that the gender radio buttons are present');

    const genderLabelToSelect = femaleRadioLabelSelector;

    await page.locator(genderLabelToSelect).click({ force: true });

    const selectedGender = genderLabelToSelect === maleRadioLabelSelector ? 'Male' : 'Female';
    console.log(`Selected gender: ${selectedGender}`);

    await page.waitForLoadState('networkidle');

    const resultsSelector = '.find-a-provider__header--count .provider-search__resultcount'; // Correct selector for the results count
    await page.waitForSelector(resultsSelector, { state: 'visible' });

    const resultsText = await page.locator(resultsSelector).textContent();
    const numberOfResults = parseInt(resultsText.match(/(\d+) results/)[1], 10);
    expect(numberOfResults).toBeGreaterThan(0);

    const providerCards = page.locator('.find-a-provider__provider-card');
    await expect(providerCards.first()).toBeVisible(); 
  } else {
    console.log('The gender radio buttons are not present.');
  }
});
});  
