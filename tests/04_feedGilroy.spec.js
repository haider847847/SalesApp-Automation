const { test, expect } = require('@playwright/test');

// Base URL for the Gilroy feed page
const URL = 'https://salesapp.xiqonline.com/feed/gilroy';

// Helper function to navigate to the Gilroy feed page
async function goto(page) {
    await page.goto(URL);
}

test("Give gilroy a prompt", async function ({ page }) {
    // Navigate to the Gilroy feed page
    await goto(page);

    // Click and fill the chat input with a prompt
    await page.locator("#custom-text-editable").click();
    await page.locator("#custom-text-editable").fill("company comparison between google and microsoft");

    // Set up response listener BEFORE clicking Generate, so the request isn't missed
    const responsePromise = page.waitForResponse(
        response => response.url().includes("/conversations/"),
        { timeout: 120000 } // extended timeout since AI response can be slow
    );

    // Click the Generate button to submit the prompt
    await page.locator("//span[normalize-space()='Generate']").click();

    // Wait for the conversation API response
    const response = await responsePromise;
    const status = response.status();
    console.log("Conversation api status code is ", status);

    // Parse the response body and extract the generated prompt's ID
    const body = await response.json();
    // Use let so the ID can be updated after regeneration if needed
    let id = body.response.result[0].id;

    await test.step("Regenerated prompt", async () => {
        // Click the regenerate icon inside the generated output block
        await page.locator(`//div[@id='output-js-${id}']//div[5]//span[1]//*[name()='svg']`).click();

        // Set up response listener BEFORE clicking Generate, so the request isn't missed
        // Use different variable names to avoid conflict with the outer scope
        const reResponsePromise = page.waitForResponse(
            response => response.url().includes("/conversations/"),
            { timeout: 120000 } // extended timeout since AI response can be slow
        );

    // Click the Generate button to submit the prompt
    await page.locator("//span[normalize-space()='Generate']").click();
        // Wait for the regenerated conversation API response
        const reResponse = await reResponsePromise;
        const reStatus = reResponse.status();
        console.log("Re-Conversation api status code is ", reStatus);

        // Update the ID to target the regenerated output in subsequent steps
        const reBody = await reResponse.json();
        id = reBody.response.result[0].id;
    });

    await test.step("Delete generated prompt", async () => {
        // Click the delete icon inside the regenerated output block using the updated ID
        await page.locator(`div[id='output-js-${id}'] div:nth-child(6) span:nth-child(1) svg`).click();

        // Set up delete response listener BEFORE clicking the confirm button
        const deleteResponsePromise = page.waitForResponse(
            response =>
                        response.url().includes("/delete_channel/") ||
                        response.url().includes("/clear_chat_history/")
        );

        // Confirm deletion in the modal dialog
        await page.locator("//button[@class='ant-btn css-mncuj7 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid']").click();

        // Wait for the delete API response and log the status
        const deleteResponse = await deleteResponsePromise;
        const deleteStatus = deleteResponse.status();
        console.log("delete prompt api response is ", deleteStatus);
    });
});