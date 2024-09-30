const { test, expect } = require('@playwright/test');

const url = 'https://memorialcare-stg.chltest2.com/blog';

// Describes the set of tests for the MemorialCare Blog page
test.describe('MemorialCare Blog Tests', () => {

    // Helper function to navigate to a page and wait for it to load
    async function goToPageAndWaitForLoad(page, url) {
        await page.goto(url, { waitUntil: 'domcontentloaded' }); // Navigate to the given URL and wait for DOM content to load
        console.log(`Navigated to the URL: ${url}`);

        await page.waitForLoadState('networkidle'); // Wait for the page to be fully loaded and all network activity to be idle
        console.log('Page loaded with network idle state.');
    }

    // Test 1: Verify that blog posts are loaded when the blog page is accessed
    test('Verify that the current blog posts load when the page loads', async ({ page }) => {
        test.setTimeout(30000); // Set a timeout of 30 seconds for this test

        await page.goto(url);  // Navigate to the blog page
        console.log('Navigated to the MemorialCare blog listing page');

        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // CSS selector for the blog posts container
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait until the blog posts container is visible
        console.log('Blog posts container is visible');

        const blogPostCardSelector = '.blog-listing__blog-card';  // CSS selector for individual blog post cards
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);  // Count the number of blog post cards

        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there is at least one blog post loaded
        console.log(`Verified that there are ${blogPostCount} blog posts loaded on the page`);
    });

    // Test 2: Verify that the "Read More" link navigates correctly to the blog post
    test('Verify that the "Read More" link functions properly', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test

        await page.goto(url);  // Navigate to the blog page
        console.log('Navigated to the MemorialCare blog page');

        const readMoreLinkSelector = '.blog-card__actions .button';  // CSS selector for the "Read More" button
        await page.waitForSelector(readMoreLinkSelector, { state: 'visible', timeout: 15000 });  // Wait until the "Read More" button is visible
        console.log('"Read More" links are visible on the page');

        const firstReadMoreLink = await page.getAttribute(readMoreLinkSelector, 'href');  // Get the href attribute of the first "Read More" link
        expect(firstReadMoreLink).toBeTruthy();  // Assert that the "Read More" link has a valid href
        console.log(`Verified that the first "Read More" link has a valid href: ${firstReadMoreLink}`);

        await page.click(readMoreLinkSelector);  // Click the "Read More" link
        console.log('Clicked on the first "Read More" link');

        await page.waitForLoadState('domcontentloaded');  // Wait for the new page to load
        const currentURL = page.url();  // Get the current URL
        expect(currentURL).toContain(firstReadMoreLink);  // Assert that the current URL contains the expected URL
        console.log(`Verified that the "Read More" link redirects to the correct page: ${currentURL}`);
    });

    // Test 3: Verify that filtering by "Featured Topics" works correctly
    test('Verify that the "Featured Topics" filter functions correctly', async ({ page }) => {
        test.setTimeout(30000);  // Set a timeout of 30 seconds for this test
    
        await page.goto(url);  // Navigate to the blog page
        console.log('Navigated to the MemorialCare blog page');
    
        const featuredTopicSelector = '.quick-link__link[href*="service%3A2"]';  // CSS selector for the "Cancer Care" featured topic link
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // CSS selector for the blog posts container
    
        await page.click(featuredTopicSelector);  // Click the "Cancer Care" featured topic
        console.log('Clicked on the "Cancer Care" featured topic');
    
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait until the filtered blog posts are visible
        console.log('Blog posts container is visible after filtering');
    
        const blogPostCardSelector = '.blog-listing__blog-card';  // CSS selector for blog post cards
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);  // Count the number of blog posts after filtering
    
        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts for the selected topic
        console.log(`Verified that there are ${blogPostCount} blog posts loaded for the "Cancer Care" filter`);
    
        const blogPostTitles = await page.$$eval(`${blogPostCardSelector} .blog-card__title-link`, titles => titles.map(title => title.textContent.toLowerCase()));  // Get all blog post titles
        const keyword = 'cancer';  // Keyword to match in blog post titles
    
        const anyPostMatchesFilter = blogPostTitles.some(title => title.includes(keyword));  // Check if any blog post title contains the keyword
        expect(anyPostMatchesFilter).toBe(true);  // Assert that at least one blog post matches the filter
        console.log(`Verified that at least one blog post is related to "Cancer Care"`);
    });
    
    // Test 4: Verify that the services dropdown filter works correctly
    test('Verify that the Services select form functions correctly', async ({ page }) => {
        await page.goto(url);  // Navigate to the blog page
        console.log('Navigated to the MemorialCare blog page');
    
        const servicesDropdownSelector = '.facets-widget-dropdown .choices';  // CSS selector for the Services dropdown
        await page.click(servicesDropdownSelector);  // Click to open the Services dropdown
        console.log('Clicked on the Services dropdown');
    
        const firstServiceOptionSelector = '.choices__item--choice.choices__item--selectable:first-child';  // Selector for the first option in the Services dropdown
        await page.waitForSelector(firstServiceOptionSelector, { state: 'visible', timeout: 15000 });  // Wait for the first service option to become visible
        await page.click(firstServiceOptionSelector);  // Select the first service option
        console.log('Selected the first option in the Services dropdown');
    
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // CSS selector for the blog posts container
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the filtered blog posts to become visible
        console.log('Blog posts container is visible after filtering');
    
        const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);  // Count the number of filtered blog posts
        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts for the selected service
        console.log(`Verified that there are ${blogPostCount} blog posts loaded after selecting the service filter`);
    });

    // Test 5: Verify that the format checkboxes filter the blog posts correctly
    test('Verify that the Format checkboxes function correctly', async ({ page }) => {
        const formats = [  // Define the available formats
            { id: 'format-article', label: 'Article' },
            { id: 'format-testimonial', label: 'Patient Story' },
            { id: 'format-podcast', label: 'Podcast' },
            { id: 'format-video', label: 'Video' }
        ];
    
        for (const format of formats) {
            await page.goto(url);  // Navigate to the blog page
            console.log('Navigated to the MemorialCare blog page');
    
            const checkboxSelector = `#${format.id}`;  // Selector for the checkbox input
            const labelSelector = `label[for="${format.id}"]`;  // Selector for the label associated with the checkbox
    
            await page.click(labelSelector);  // Click the checkbox label
            console.log(`Clicked on the ${format.label} checkbox`);
    
            const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // CSS selector for the blog posts container
            await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the filtered blog posts to become visible
            console.log(`Blog posts container is visible after filtering by ${format.label}`);
    
            const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);  // Count the number of filtered blog posts
            expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts for the selected format
            console.log(`Verified that there are ${blogPostCount} blog posts loaded for the ${format.label} filter`);
    
            await page.click(labelSelector);  // Uncheck the checkbox
            console.log(`Unclicked the ${format.label} checkbox`);
        }
    });
});