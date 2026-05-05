const { test, expect } = require('@playwright/test');
const feedGilroy = require('../Pages/feedGilroy');

const URL = 'https://salesapp.xiqonline.com/feed/gilroy';

test.describe("Gilroy prompt flow", () => {

    let promptId;   // output block ID — passed between tests to target the correct block
    let sharedPage; // single page shared across tests 1–3 to preserve state
    let gilroy;     // POM instance tied to sharedPage

    // Create shared page and POM once before all tests run
    test.beforeAll(async ({ browser }) => {
        sharedPage = await browser.newPage();
        await sharedPage.goto(URL);
        gilroy = new feedGilroy(sharedPage);
    });

    // Clean up shared page after all tests finish
    test.afterAll(async () => {
        await sharedPage.close();
    });

    test("1. Gilroy prompt", async () => {

        // Fill editor and submit — generate() registers the listener before clicking
        await gilroy.fillPrompt("company comparison between google and microsoft");
        const response = await gilroy.generate();
        expect(response.status()).toBe(200);

        // Store promptId so test 2 can locate this output block
        const body = await response.json();
        promptId = body.response.result[0].id;
    });

    test("2. Regenerate prompt", async () => {

        // Click regenerate on the block from test 1, then submit
        await gilroy.clickRegenerate(promptId);
        const response = await gilroy.generate();
        expect(response.status()).toBe(200);

        // Update promptId — regeneration produces a new output block with a new ID
        const body = await response.json();
        promptId = body.response.result[0].id;
    });

    test("3. Delete prompt", async () => {

        // Delete the regenerated block from test 2 and confirm via modal
        // deletePrompt() registers the listener before clicking to avoid race condition
        const response = await gilroy.deletePrompt(promptId);
        expect(response.status()).toBe(200);
    });

});

test.describe("Gilroy prompt flow", () => {

    test("4. Writing prompt using person & company tags", async ({ browser }) => {

        // Uses its own independent page — no dependency on sharedPage or prior tests
       // const page = await browser.newPage();
        await page.goto(URL);
        const gilroyLocal = new feedGilroy(page);

        const editor = page.locator("#custom-text-editable");
        const searchBox = page.getByRole('textbox', { name: 'Search your target' });

        // Fill the start of the prompt into the editor
        await gilroyLocal.fillPrompt("What are the biggest personal opportunities for ");

        // "@" triggers the tag search dropdown — wait for search box before interacting
        await editor.pressSequentially("@");
        await searchBox.waitFor({ state: 'visible' });

        // Select Tim Cook as the person tag
        await gilroyLocal.personTag();

        // Continue typing and trigger the second tag dropdown
        await editor.pressSequentially(" to succeed within @");
        await searchBox.waitFor({ state: 'visible' });

        // Select Apple Inc. as the company tag
        await gilroyLocal.companyTag();

        // Finish the prompt and submit
        await editor.pressSequentially(" ?");
        const response = await gilroyLocal.generate();
        expect(response.status()).toBe(200);

        await page.close();
    });
});
