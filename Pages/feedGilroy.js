/**
 * Page Object Model for the Gilroy feed page.
 * Encapsulates all interactions with the Gilroy prompt editor,
 * tag search, and response generation.
 */
class feedGilroy {

    /**
     * @param {import('@playwright/test').Page} page - Playwright page instance
     */
    constructor(page) {
        this.page = page;

        // "Generate" button that submits the prompt
        this.generateBtn = page.locator("//span[normalize-space()='Generate']");

        // Main rich-text prompt editor
        this.editor = page.locator("#custom-text-editable");

        // Confirmation button shown in the delete modal
        this.deleteConfirmBtn = page.locator("//button[@class='ant-btn css-mncuj7 ant-btn-primary ant-btn-color-primary ant-btn-variant-solid']");

        // Search box that appears when "@" is typed in the editor
        this.searchBox = page.getByRole('textbox', { name: 'Search your target' });
    }

    /**
     * Clears the prompt editor and fills it with the provided text.
     * @param {string} text - The prompt text to enter
     */
    async fillPrompt(text) {
        await this.editor.click();
        await this.editor.fill(text);
    }

    /**
     * Clicks the regenerate icon for a specific prompt output block.
     * @param {string|number} promptId - The ID suffix used in the output element's DOM id
     */
    async clickRegenerate(promptId) {
        await this.page
            .locator(`//div[@id='output-js-${promptId}']//div[5]//span[1]//*[name()='svg']`)
            .click();
    }

    /**
     * Clicks the delete icon for a specific prompt output block, confirms the
     * deletion modal, and waits for the corresponding API call to complete.
     * @param {string|number} promptId - The ID suffix used in the output element's DOM id
     * @returns {Promise} Resolves with the delete or clear-history API response
     */
    async deletePrompt(promptId) {
        // Register the response listener BEFORE clicking to avoid race conditions
        const deleteResponsePromise = this.page.waitForResponse(
            response =>
                response.url().includes("/delete_channel/") ||
                response.url().includes("/clear_chat_history/"),
            { timeout: 30_000 }
        );

        // Click the delete (trash) icon inside the target output block
        await this.page
            .locator(`div[id='output-js-${promptId}'] div:nth-child(6) span:nth-child(1) svg`)
            .click();

        // Confirm deletion in the modal dialog
        await this.deleteConfirmBtn.click();

        return deleteResponsePromise;
    }

    /**
     * Clicks the Generate button and waits for the conversations API response.
     * The response listener is registered BEFORE the click to avoid missing fast responses.
     * @returns {Promise} Resolves with the /conversations 200 API response
     */
    async generate() {
        const responsePromise = this.page.waitForResponse(
            response =>
                response.url().includes("/conversations") &&
                response.status() === 200,
            { timeout: 120_000 }
        );

        await this.generateBtn.click();

        return responsePromise;
    }

    /**
     * Waits for the tag search API to return results.
     * Should be called after pressing Enter in the search box.
     * @returns {Promise} Resolves when /search_content/ returns HTTP 200
     */
    async searchResponse() {
        return this.page.waitForResponse(
            response =>
                response.url().includes("/search_content/") &&
                response.status() === 200,
            { timeout: 30_000 }
        );
    }

    /**
     * Selects Tim Cook as a person tag in the prompt editor.
     * Types his name into the search box, waits for API results,
     * then clicks his profile entry in the dropdown.
     */
    async personTag() {
        await this.searchBox.fill('tim cook');
        await this.searchBox.press('Enter');

        // Wait for search API results before interacting with the dropdown
        await this.searchResponse();

        await this.page.getByRole('button', { name: 'Persuader Tim Cook Chief' }).click();
    }

    /**
     * Selects Apple Inc. as a company tag in the prompt editor.
     * Types the company name, switches to the Companies tab,
     * then clicks the Apple Inc. entry.
     */
    async companyTag() {
        await this.searchBox.fill('apple');
        await this.searchBox.press('Enter');

        // Wait for search API results before interacting with the dropdown
        await this.searchResponse();

        // Filter results to the Companies tab
        await this.page.getByRole('button', { name: 'Companies (100)' }).click();

        await this.page.getByRole('button', { name: 'Apple Inc. apple.com' }).click();
    }
}

module.exports = feedGilroy;