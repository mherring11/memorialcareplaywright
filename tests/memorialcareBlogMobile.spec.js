const { test, expect } = require('@playwright/test');

// Set up the viewport for mobile view and use the Chromium browser for these tests
test.use({ viewport: { width: 375, height: 812 }, browserName: 'chromium' });

// Describes the group of MemorialCare blog tests for mobile view
test.describe('MemorialCare Blog Tests - Mobile View', () => {

    let page;  // Declare a variable for the shared browser page instance

    // Before all tests, open a new page and navigate to the blog page
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();  // Create a new page in the browser
        await page.goto('https://memorialcare-stg.chltest2.com/blog', { waitUntil: 'domcontentloaded' });  // Navigate to the blog page
        await page.waitForLoadState('networkidle');  // Wait for the page to load fully with no ongoing network requests
        console.log('Page loaded with network idle state at https://www.memorialcare.org/blog');
    });

    // After all tests are completed, close the page to free up resources
    test.afterAll(async () => {
        await page.close();  // Close the shared page
        console.log('Closed shared page after all tests');
    });

    // Helper function to wait for blog posts to appear on the page
    async function waitForBlogPosts() {
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // Selector for the blog posts container
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the blog posts container to be visible
        console.log('Blog posts container is visible');

        const blogPostCardSelector = '.blog-listing__blog-card';  // Selector for individual blog post cards
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);  // Count the number of blog post cards

        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts loaded
        console.log(`Verified that there are ${blogPostCount} blog posts loaded on the page`);
    }

    // Test 1: Verify that blog posts are loaded when the page is accessed
    test('Verify that the current blog posts load when the page loads', async () => {
        await waitForBlogPosts();  // Call the helper function to check blog posts visibility
    });

    // Test 2: Verify that the "Read More" link functions correctly
    test('Verify that the "Read More" link functions properly', async () => {
        const readMoreLinkSelector = '.blog-card__actions .button';  // Selector for the "Read More" button
        await page.waitForSelector(readMoreLinkSelector, { state: 'visible', timeout: 15000 });  // Wait for the "Read More" button to become visible
        console.log('"Read More" links are visible on the page');

        const firstReadMoreLink = await page.getAttribute(readMoreLinkSelector, 'href');  // Get the href attribute of the first "Read More" link
        expect(firstReadMoreLink).toBeTruthy();  // Assert that the link has a valid href
        console.log(`Verified that the first "Read More" link has a valid href: ${firstReadMoreLink}`);

        await page.click(readMoreLinkSelector);  // Click the "Read More" link
        console.log('Clicked on the first "Read More" link');

        await page.waitForLoadState('domcontentloaded');  // Wait for the new page to load
        const currentURL = page.url();  // Get the current URL after clicking the link
        expect(currentURL).toContain(firstReadMoreLink);  // Assert that the current URL contains the expected link
        console.log(`Verified that the "Read More" link redirects to the correct page: ${currentURL}`);

        await page.goBack();  // Navigate back to the previous page
        await page.waitForLoadState('networkidle');  // Wait for the page to fully load
    });

    // Test 3: Verify that filtering by "Featured Topics" works correctly
    test('Verify that the "Featured Topics" filter functions correctly', async () => {
        const featuredTopicSelector = '.quick-link__link[href*="service%3A2"]';  // Selector for the "Cancer Care" featured topic link
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // Selector for the blog posts container

        await page.click(featuredTopicSelector);  // Click the "Cancer Care" featured topic link
        console.log('Clicked on the "Cancer Care" featured topic');

        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the filtered blog posts to appear
        console.log('Blog posts container is visible after filtering');

        const blogPostCardSelector = '.blog-listing__blog-card';  // Selector for the blog post cards
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);  // Count the number of filtered blog posts

        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are filtered blog posts
        console.log(`Verified that there are ${blogPostCount} blog posts loaded for the "Cancer Care" filter`);

        const blogPostTitles = await page.$$eval(`${blogPostCardSelector} .blog-card__title-link`, titles => titles.map(title => title.textContent.toLowerCase()));  // Get the blog post titles
        const keyword = 'cancer';  // The keyword to check in the titles

        const anyPostMatchesFilter = blogPostTitles.some(title => title.includes(keyword));  // Check if any blog post title contains the keyword
        expect(anyPostMatchesFilter).toBe(true);  // Assert that there is at least one blog post related to "Cancer Care"
        console.log(`Verified that at least one blog post is related to "Cancer Care"`);

        await page.goBack();  // Navigate back to the previous page
        await page.waitForLoadState('networkidle');  // Wait for the page to fully load
    });

    // Test 4: Verify that the Services select dropdown works correctly
    test('Verify that the Services select form functions correctly', async () => {
        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the "Filter Results" button
        await page.click(filterResultsButtonSelector);  // Click the "Filter Results" button
        console.log('Clicked on the Filter Results button');

        const servicesDropdownSelector = '.facets-widget-dropdown .choices';  // Selector for the Services dropdown
        await page.click(servicesDropdownSelector);  // Click to open the Services dropdown
        console.log('Clicked on the Services dropdown');

        const firstServiceOptionSelector = '.choices__item--choice.choices__item--selectable:first-child';  // Selector for the first option in the dropdown
        await page.waitForSelector(firstServiceOptionSelector, { state: 'visible', timeout: 15000 });  // Wait for the first option to become visible
        await page.click(firstServiceOptionSelector);  // Select the first option
        console.log('Selected the first option in the Services dropdown');

        const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // Selector for the blog posts container
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the filtered blog posts to appear
        console.log('Blog posts container is visible after filtering');

        const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);  // Count the number of filtered blog posts
        expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts for the selected service
        console.log(`Verified that there are ${blogPostCount} blog posts loaded after selecting the service filter`);

        await page.goBack();  // Navigate back to the previous page
        await page.waitForLoadState('networkidle');  // Wait for the page to fully load
    });

    // Test 5: Verify that the format checkboxes filter the blog posts correctly
    test('Verify that the Format checkboxes function correctly', async () => {
        const formats = [  // Define the available formats
            { id: 'format-article', label: 'Article' },
            { id: 'format-testimonial', label: 'Patient Story' },
            { id: 'format-podcast', label: 'Podcast' },
            { id: 'format-video', label: 'Video' }
        ];

        for (const format of formats) {
            await page.goto('https://www.memorialcare.org/blog');  // Navigate to the blog page
            console.log('Navigated to the MemorialCare blog page');

            const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';  // Selector for the "Filter Results" button
            await page.click(filterResultsButtonSelector);  // Click the "Filter Results" button
            console.log('Clicked on the Filter Results button');

            const checkboxSelector = `#${format.id}`;  // Selector for the checkbox input
            const labelSelector = `label[for="${format.id}"]`;  // Selector for the label associated with the checkbox

            await page.click(labelSelector);  // Click the checkbox label to select it
            console.log(`Clicked on the ${format.label} checkbox`);

            const blogPostsContainerSelector = '.content-segment.blog-listing__results';  // Selector for the blog posts container
            await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });  // Wait for the filtered blog posts to appear
            console.log(`Blog posts container is visible after filtering by ${format.label}`);

            const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);  // Count the number of filtered blog posts
            expect(blogPostCount).toBeGreaterThan(0);  // Assert that there are blog posts for the selected format
            console.log(`Verified that there are ${blogPostCount} blog posts loaded for the ${format.label} filter`);

            await page.click(labelSelector);  // Uncheck the checkbox
            console.log(`Unclicked the ${format.label} checkbox`);
        }
    });
});