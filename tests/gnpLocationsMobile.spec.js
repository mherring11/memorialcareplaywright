const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 375, height: 812 } });

test.describe('MemorialCare Blog Tests - Mobile View', () => {

    test('Verify that the current blog posts load when the page loads', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/blog');
        console.log('Navigated to the MemorialCare blog listing page');

        const blogPostsContainerSelector = '.content-segment.blog-listing__results';
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });
        console.log('Blog posts container is visible');

        const blogPostCardSelector = '.blog-listing__blog-card';
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);

        expect(blogPostCount).toBeGreaterThan(0);
        console.log(`Verified that there are ${blogPostCount} blog posts loaded on the page`);
    });

    test('Verify that the "Read More" link functions properly', async ({ page }) => {
        test.setTimeout(30000);

        await page.goto('https://www.memorialcare.org/blog');
        console.log('Navigated to the MemorialCare blog page');

        const readMoreLinkSelector = '.blog-card__actions .button';
        await page.waitForSelector(readMoreLinkSelector, { state: 'visible', timeout: 15000 });
        console.log('"Read More" links are visible on the page');

        const firstReadMoreLink = await page.getAttribute(readMoreLinkSelector, 'href');
        expect(firstReadMoreLink).toBeTruthy();
        console.log(`Verified that the first "Read More" link has a valid href: ${firstReadMoreLink}`);

        await page.click(readMoreLinkSelector);
        console.log('Clicked on the first "Read More" link');

        await page.waitForLoadState('domcontentloaded');
        const currentURL = page.url();
        expect(currentURL).toContain(firstReadMoreLink);
        console.log(`Verified that the "Read More" link redirects to the correct page: ${currentURL}`);
    });

    test('Verify that the "Featured Topics" filter functions correctly', async ({ page }) => {
        test.setTimeout(30000);
    
        await page.goto('https://www.memorialcare.org/blog');
        console.log('Navigated to the MemorialCare blog page');
    
        const featuredTopicSelector = '.quick-link__link[href*="service%3A2"]';
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';
    
        await page.click(featuredTopicSelector);
        console.log('Clicked on the "Cancer Care" featured topic');
    
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });
        console.log('Blog posts container is visible after filtering');
    
        const blogPostCardSelector = '.blog-listing__blog-card';
        const blogPostCount = await page.$$eval(blogPostCardSelector, posts => posts.length);
    
        expect(blogPostCount).toBeGreaterThan(0);
        console.log(`Verified that there are ${blogPostCount} blog posts loaded for the "Cancer Care" filter`);
    
        const blogPostTitles = await page.$$eval(`${blogPostCardSelector} .blog-card__title-link`, titles => titles.map(title => title.textContent.toLowerCase()));
        const keyword = 'cancer';
    
        const anyPostMatchesFilter = blogPostTitles.some(title => title.includes(keyword));
        expect(anyPostMatchesFilter).toBe(true);
        console.log(`Verified that at least one blog post is related to "Cancer Care"`);
    });
    
    test('Verify that the Services select form functions correctly', async ({ page }) => {
        await page.goto('https://www.memorialcare.org/blog');
        console.log('Navigated to the MemorialCare blog page');

        const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
        await page.click(filterResultsButtonSelector);
        console.log('Clicked on the Filter Results button');

        const servicesDropdownSelector = '.facets-widget-dropdown .choices';
        await page.click(servicesDropdownSelector);
        console.log('Clicked on the Services dropdown');
    
        const firstServiceOptionSelector = '.choices__item--choice.choices__item--selectable:first-child';
        await page.waitForSelector(firstServiceOptionSelector, { state: 'visible', timeout: 15000 });
        await page.click(firstServiceOptionSelector);
        console.log('Selected the first option in the Services dropdown');
    
        const blogPostsContainerSelector = '.content-segment.blog-listing__results';
        await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });
        console.log('Blog posts container is visible after filtering');
    
        const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);
        expect(blogPostCount).toBeGreaterThan(0);
        console.log(`Verified that there are ${blogPostCount} blog posts loaded after selecting the service filter`);
    });

    test('Verify that the Format checkboxes function correctly', async ({ page }) => {
        const formats = [
            { id: 'format-article', label: 'Article' },
            { id: 'format-testimonial', label: 'Patient Story' },
            { id: 'format-podcast', label: 'Podcast' },
            { id: 'format-video', label: 'Video' }
        ];
    
        for (const format of formats) {
            await page.goto('https://www.memorialcare.org/blog');
            console.log('Navigated to the MemorialCare blog page');

            const filterResultsButtonSelector = '.sidebar-content__sidebar-mobile-trigger';
            await page.click(filterResultsButtonSelector);
            console.log('Clicked on the Filter Results button');
    
            const checkboxSelector = `#${format.id}`;
            const labelSelector = `label[for="${format.id}"]`;
    
            await page.click(labelSelector);
            console.log(`Clicked on the ${format.label} checkbox`);
    
            const blogPostsContainerSelector = '.content-segment.blog-listing__results';
            await page.waitForSelector(blogPostsContainerSelector, { state: 'visible', timeout: 15000 });
            console.log(`Blog posts container is visible after filtering by ${format.label}`);
    
            const blogPostCount = await page.$$eval('.blog-listing__blog-card', posts => posts.length);
            expect(blogPostCount).toBeGreaterThan(0);
            console.log(`Verified that there are ${blogPostCount} blog posts loaded for the ${format.label} filter`);
    
            await page.click(labelSelector);
            console.log(`Unclicked the ${format.label} checkbox`);
        }
    });
});
