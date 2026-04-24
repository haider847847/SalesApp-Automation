const { test, expect } = require('@playwright/test');

// Run all tests in this describe block sequentially (one after another)
test.describe.configure({ mode: 'serial' });

test.describe('Document Hub', () => {

  /**
   * Test 1: Verify that clicking the document icon redirects to the Document Hub page
   */
  test('Test 1 - Redirect to Document Hub', async ({ page }) => {
    // Navigate to the main sales app
    await page.goto('https://salesapp.xiqonline.com');

    // Click the document hub icon in the sidebar/nav
    await page.locator('.document-svg').click();

    // Assert URL contains '/documents'
    await expect(page).toHaveURL(/\/documents/);
  });


  /**
   * Test 2: Upload a file to the xiQ Shared Folder in Document Hub
   */
  test('Test 2 - Upload File', async ({ page }) => {
    // Go directly to the Document Hub page on QA environment
    await page.goto('https://salesapp.xiqonline.com/documents');

    // Wait for page to fully load (certification popup may appear)
    await page.waitForTimeout(8000);

    // Dismiss the certification/register popup (3rd "Register now" button)
    //await page.getByRole('button', { name: 'Register now' }).nth(2).click();

    // Open the xiQ Shared Folder
    await page.getByRole('button', { name: 'xiQ, Inc. (Shared Folder)', exact: true }).click();

    // Wait for folder contents to load
    await page.waitForTimeout(4000);

    // Click the "Upload document" button to open the upload panel
    await page.getByRole('button', { name: 'Upload document', exact: true }).click();

    // Open file chooser by clicking the upload area and select the file
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator("//span[normalize-space()='here to upload']").click(),
    ]);
    await fileChooser.setFiles('C:/Users/Haider Mahmood/Downloads/workkk.pptx');

    // Wait until the file shows "Uploaded Successfully"
    await expect(
      page.locator("//span[@class='upload-percentage isSuccessful']")
    ).toHaveText('Uploaded Successfully', { timeout: 30000 });

    // Close the upload panel using the close (X) button
    await page
      .locator(
        "//*[name()='g' and @id='Group-2']//*[name()='circle' and @id='Oval']"
      )
      .click();
  });


  /**
   * Test 3: Delete the uploaded file from the xiQ Shared Folder
   * Navigates independently since each test gets a fresh page in Playwright
   */
  test('Test 3 - Delete Uploaded File', async ({ page }) => {
    // Navigate to Document Hub on QA environment
    await page.goto('https://salesapp.xiqonline.com/documents');

    // Wait for page to fully load
    await page.waitForTimeout(8000);

    // Dismiss the certification/register popup
    //await page.getByRole('button', { name: 'Register now' }).nth(2).click();

    // Open the xiQ Shared Folder where the file was uploaded
    await page.getByRole('button', { name: 'xiQ, Inc. (Shared Folder)', exact: true }).click();

    // Wait for folder contents to load
    await page.waitForTimeout(4000);

    // Select the first file row (index 0 = header checkbox, index 1 = first file)
    await page.locator('input.ant-checkbox-input').nth(1).click();

    // Wait briefly for the delete button to become active/visible
    await page.waitForTimeout(2000);

    // Click the "Delete" action button in the toolbar
    await page.locator("//span[@role='button'][normalize-space()='Delete']").click();

    // Confirm deletion in the confirmation dialog
    await page.locator("//button[@type='button']//span[contains(text(),'Delete')]").click();
  });

});