const { chromium } = require('@playwright/test');
const Login = require('./Pages/Login');
const testdata = require('./testdata.json');

/**
 * Global Setup — runs once before all tests
 * Logs into the application and saves the authenticated session to auth.json
 * All tests reuse this session via storageState in playwright.config.js
 */
module.exports = async function globalSetup() {
  // Launch a temporary browser for the login flow
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the login page with redirect back to SalesApp after auth
  await page.goto(
    'https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com'
  );

  // Use the Login page object to fill credentials and submit
  const loginPage = new Login(page);
  await loginPage.loginToApplication(testdata.email, testdata.password);

  // Dismiss the certification/register popup that appears after login
  //await page.getByRole('button', { name: 'Register now' }).nth(2).click();

  // Save the authenticated session (cookies + localStorage) to auth.json
  // This file is loaded by all tests via storageState in playwright.config.js
  await page.context().storageState({ path: 'auth.json' });

  // Close the browser — session is now saved, no longer needed
  await browser.close();
};