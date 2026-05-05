const { test: base, expect } = require('@playwright/test');
const LANDING_URL = 'https://salesapp.xiqonline.com/feed/gilroy';
const SEARCH_NAME = 'sundar pichai';
const PROFILE_NAME = 'Sundar Pichai';


// ─── Fixtures ─────────────────────────────────────────────────────────────────
 
const test = base.extend({
 
  /**
   * Fixture: landingPage
   * Navigates to /feed/gilroy and waits for the search box to be ready.
   * Use this as the base for all Person Profile tests.
   *
   * Replaces the manual goto(page) call repeated in every test.
   */
  landingPage: async ({ page }, use) => {
    await page.goto(LANDING_URL);
    await expect(
      page.locator("input[placeholder='Search']")
    ).toBeVisible();
    await use(page);
  },
 
  /**
   * Fixture: profileSearchPage
   * Extends landingPage — search is already done and results are visible.
   * Use this when your test only needs to verify search results.
   *
   * Replaces goto(page) + searchProfile(page) in TEST 01.
   */
  profileSearchPage: async ({ landingPage: page }, use) => {
    await page.locator("input[placeholder='Search']").fill(SEARCH_NAME);
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('button', { name: /view Sundar Pichai profile/i }).first()
    ).toBeVisible({ timeout: 15000 });
    await use(page);
  },
 
  /**
   * Fixture: openedProfilePage
   * Extends profileSearchPage — profile is already open and confirmed loaded.
   * Use this for TEST 02, 03, 04, 05 — any test that acts inside the profile.
   *
   * Replaces goto(page) + searchProfile(page) + openProfile(page) in every test.
   */
  openedProfilePage: async ({ profileSearchPage: page }, use) => {
    await page
      .getByRole('button', { name: /view Sundar Pichai profile/i })
      .first()
      .click();
    await expect(
      page
        .locator('#certification-person-header')
        .getByRole('heading', { name: PROFILE_NAME, level: 1 })
    ).toBeVisible({ timeout: 15000 });
    await use(page);
  },
 
});
 
module.exports = { test, expect };
 

