const { test, expect } = require('@playwright/test');

const url = 'https://memorialcare-stg.chltest2.com/providers';

test.describe('MemorialCare Provider Tests', () => {

  test('check Online Scheduling Available', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const scheduleAppointmentSelector = 'a:has-text("Schedule Appointment")';

    const scheduleAppointmentLink = await page.locator(scheduleAppointmentSelector).first();
    await expect(scheduleAppointmentLink).toBeVisible();
    console.log('Verified Schedule Appointment link is visible');

    await scheduleAppointmentLink.click();
    console.log('Clicked Schedule Appointment');

    const appointmentHeadingSelector = 'h1:has-text("Schedule an Appointment")';
    await expect(page.locator(appointmentHeadingSelector)).toBeVisible();
    console.log('Verified Schedule an Appointment page loaded');

    await expect(page).toHaveURL(/schedule-appointment-today/);
    console.log('Verified URL contains schedule-appointment-today');

    await page.goBack();
    console.log('Returned to providers page');

    await expect(page).toHaveURL(url);
    console.log('Verified returned to the providers page URL');

    await expect(scheduleAppointmentLink).toBeVisible();
    console.log('Verified Schedule Appointment link is visible on providers page again');
  });

  test('Filter by Doctor/Provider Name', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

    const providerNameSelector = 'input[data-drupal-selector="edit-search-api-fulltext"]';
    const resultsCountSelector = '.find-a-provider__header--count .provider-search__resultcount';
    const providerCardsSelector = '.find-a-provider__provider-card .provider-card-search__name'; // Adjusted selector
    const expectedProviderText = 'pak';
    
    await page.waitForSelector(providerNameSelector, { state: 'visible', timeout: 60000 });
    console.log('Doctor/Provider Name input field is visible');

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
    await page.goto(url);
    console.log('Navigated to providers page');

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
  });

  test('randomly select a specialty and filter', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

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
    await page.goto(url);
    console.log('Navigated to providers page');
  
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

  test('verify Medical Group checkboxes are present', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');
  
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
      console.log(`Verifying presence of checkbox for ${group.name}`);
  
      const isVisible = await page.isVisible(checkboxSelector);
      expect(isVisible).toBe(true);
      console.log(`Checkbox for ${group.name} is visible`);
    }
  });

  test('Verify Medical Group and presence of Insurances Accepted filter options', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

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
    console.log(`Results count text after checking ${medicalGroup.name}: ${resultsTextChecked}`);

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
    console.log(`Results count text after unchecking ${medicalGroup.name}: ${resultsTextUnchecked}`);

    const numberOfResultsUnchecked = parseInt(resultsTextUnchecked.match(/(\d+) results/)[1], 10);
    expect(numberOfResultsUnchecked).toBeGreaterThan(0);

    const finalCheckState = await page.isChecked(checkboxSelector);
    expect(finalCheckState).toBeFalsy();
    console.log(`Confirmed that ${medicalGroup.name} is unchecked`);
  });

  test('Verify presence of Language filter options and list available languages', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

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
    }
  });  

  test('Verify presence of gender radio buttons, select one, and show results', async ({ page }) => {
    await page.goto(url);
    console.log('Navigated to providers page');

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

        const genderInputSelector = genderLabelToSelect === maleRadioLabelSelector ? '#gender-85' : '#gender-84';
        const isSelected = await page.locator(genderInputSelector).isChecked();
        expect(isSelected).toBe(true);
        console.log(`Verified that the "${selectedGender}" radio button is checked`);

        await page.waitForLoadState('networkidle');

        const resultsSelector = '.find-a-provider__header--count .provider-search__resultcount'; // Correct selector for the results count
        await page.waitForSelector(resultsSelector, { state: 'visible' });

        const resultsText = await page.locator(resultsSelector).textContent();
        console.log(`Results count text after selecting ${selectedGender}: ${resultsText}`);

        const numberOfResults = parseInt(resultsText.match(/(\d+) results/)[1], 10);
        expect(numberOfResults).toBeGreaterThan(0);

        const providerCards = page.locator('.find-a-provider__provider-card');
        await expect(providerCards.first()).toBeVisible(); 
    }
  });

});
