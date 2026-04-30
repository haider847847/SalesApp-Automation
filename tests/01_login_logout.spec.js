const { test, expect } = require('@playwright/test');
const login = require('../Pages/Login');
const testdata = require('../testdata.json');

// Run all tests sequentially (one after another, not in parallel)
test.describe.configure({ mode: 'serial' });

/**
 * Test 1: Login to SalesApp
 * Uses a clean session (no cookies) to simulate a fresh browser login
 */
test.describe('Test 1 - Login', () => {
  // Start with no stored session to ensure a clean login flow
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Login to SalesApp', async ({ page }) => {
    // Navigate to the login page with redirect to SalesApp after login
    await page.goto(
      'https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com'
    );

    // Use the Login page object to enter credentials and submit
    const loginPage = new login(page);
    await loginPage.loginToApplication(testdata.email, testdata.password);

    // Dismiss the certification/register popup that appears after login
    await page.getByRole('button', { name: 'Register now' }).nth(2).click();

    // Save the authenticated session to auth.json for use in subsequent tests
    await page.context().storageState({ path: 'auth.json' });
  });
});


/**
 * Test 2: Logout from SalesApp
 * Uses the saved session from Login test (auth.json) to skip re-login
 */
test.describe('Test 2 - After Login Tests', () => {
  // Load the saved authenticated session
  test.use({ storageState: 'auth.json' });

  test('Logout from SalesApp', async ({ page }) => {
    // Navigate to SalesApp home page
    await page.goto('https://salesapp.xiqonline.com');

    // Open the profile menu from the bottom-left avatar button
    await page.getByRole('button', { name: 'Profile picture for menu' }).click();

    // Click the Logout option in the dropdown
    await page.getByRole('button', { name: 'Logout' }).click();

    // Confirm logout in the confirmation dialog and verify redirect to login page
    await Promise.all([
      page.getByRole('button', { name: 'Yes' }).click(),
      expect(page).toHaveURL(
        'https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com'
      ),
    ]);
  });
});