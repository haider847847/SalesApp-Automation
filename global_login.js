// globalSetup.js
const { chromium } = require('@playwright/test');
const login = require('./Pages/Login');
const testdata = require('./testdata.json');

module.exports = async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com');

  const loginClick = new login(page);
  await loginClick.loginToApplication(testdata.email, testdata.password);

  // Dismiss popup
  await page.getByRole('button', { name: 'Register now' }).nth(2).click();

  // ✅ Save session once
  await page.context().storageState({ path: 'auth.json' });

  await browser.close();
};
