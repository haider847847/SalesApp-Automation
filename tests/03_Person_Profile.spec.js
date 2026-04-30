const { test, expect } = require('@playwright/test');

// ─── Shared Constant ──────────────────────────────────────────────────────────
const URL = 'https://salesapp.xiqonline.com/feed/gilroy';


// ─── Shared Helpers ───────────────────────────────────────────────────────────

// Navigates to the app and waits for the search box to confirm the page is ready
async function goto(page) {
  await page.goto(URL);
  await expect(page.locator("input[placeholder='Search']")).toBeVisible();
}

// Fills the search box and waits for results to appear
async function searchProfile(page) {
  await page.locator("input[placeholder='Search']").fill('sundar pichai');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: /view Sundar Pichai profile/i }).first()
  ).toBeVisible({timeout:15000});
}

// Clicks the first result and confirms the correct profile loaded.
// Scoped to #certification-person-header to avoid matching the
// duplicate h1 that exists in the page-level header.
async function openProfile(page) {
  await page.getByRole('button', { name: /view Sundar Pichai profile/i }).first().click();
  await expect(
    page.locator('#certification-person-header')
        .getByRole('heading', { name: 'Sundar Pichai', level: 1 })
  ).toBeVisible({timeout:15000});
}


// ═════════════════════════════════════════════════════════════════════════════
// TEST 01 – Search person profile
// ═════════════════════════════════════════════════════════════════════════════
test.describe('TEST 01 - Person Profile', () => {

  test('Search Person Profile', async ({ page }) => {
    await goto(page);

    await test.step('Search Sundar Pichai Profile', async () => {
      await searchProfile(page);
    });
  });

});


// ═════════════════════════════════════════════════════════════════════════════
// TEST 02 – Open person profile
// ═════════════════════════════════════════════════════════════════════════════
test.describe('TEST 02 - Person Profile', () => {

  test('Open Searched Person Profile', async ({ page }) => {
    await goto(page);

    await test.step('Search Sundar Pichai Profile', async () => {
      await searchProfile(page);
    });

    await test.step('Open Sundar Pichai Profile', async () => {
      await openProfile(page);
    });
  });

});


// ═════════════════════════════════════════════════════════════════════════════
// TEST 03 – Verify all tabs on person profile
// ═════════════════════════════════════════════════════════════════════════════
test.describe('TEST 03 - Person Profile', () => {

  test('Verify All Tabs on Person Profile', async ({ page }) => {

    // Tab definitions — local to this test since only TEST 03 uses them.
    // • button   – accessible name of the tab button to click
    // • selector – CSS selector of the heading that appears after clicking
    // • text     – expected heading text (filters when selector is generic like h1)
    const TABS = [
      { button: 'Strategic Highlights', selector: 'h1',                      text: 'Strategic Highlights' },
      { button: 'News',                 selector: 'h1',                      text: 'News'                 },
      { button: 'Videos',               selector: 'h1',                      text: 'Videos'               },
      { button: 'Career',               selector: '.person-career-heading',   text: 'Career'               },
      { button: 'Personal',             selector: '.personal-detail-heading', text: 'Personal'             },
      { button: 'xiQ insights',         selector: 'h1',                      text: 'Sales Alignment'      },
    ];

    await goto(page);

    await test.step('Search Sundar Pichai Profile', async () => {
      await searchProfile(page);
    });

    await test.step('Open Sundar Pichai Profile', async () => {
      await openProfile(page);
    });

    // Click each tab and confirm its section heading becomes visible
    await test.step('Verify All Tabs in Person Profile', async () => {
      for (const tab of TABS) {
        await page.getByRole('button', { name: tab.button }).click();
        await expect(
          page.locator(tab.selector).filter({ hasText: tab.text })
        ).toBeVisible();
      }
    });
  });

});


// ═════════════════════════════════════════════════════════════════════════════
// TEST 04 – Download person profile
// ═════════════════════════════════════════════════════════════════════════════
test.describe('TEST 04 - Person Profile', () => {

  test('Download Person Profile', async ({ page }) => {
    await goto(page);

    await test.step('Search Sundar Pichai Profile', async () => {
      await searchProfile(page);
    });

    await test.step('Open Sundar Pichai Profile', async () => {
      await openProfile(page);
    });

    await test.step('Download Profile', async () => {
      // Register listener BEFORE clicking — clicking first risks
      // missing the download event if it fires immediately
      const downloadPromise = page.waitForEvent('download');
      await page.locator("//button[normalize-space()='Download']").click();
      const download = await downloadPromise;

      // Confirm a filename was returned (download actually started)
      expect(download.suggestedFilename()).toBeTruthy();

      // Confirm no error occurred during the download
      expect(await download.failure()).toBeNull();

      console.log('Downloaded file:', download.suggestedFilename());
    });
  });

});


// ═════════════════════════════════════════════════════════════════════════════
// TEST 05 – Share person profile
// ═════════════════════════════════════════════════════════════════════════════
test.describe('TEST 05 - Person Profile', () => {

  test('Share Person Profile', async ({ page }) => {
    await goto(page);

    await test.step('Search Sundar Pichai Profile', async () => {
      await searchProfile(page);
    });

    await test.step('Open Sundar Pichai Profile', async () => {
      await openProfile(page);
    });

    await test.step('Copy Sharable Link', async () => {
      // Open the share dropdown
      await page.locator("//button[normalize-space()='Share']").click();

      // Select the share option from the dropdown list
      await page.locator("//span[@class='list-item']").click();

      // Grant clipboard permissions before attempting to read from it
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

      // Wait for the Copy Link button to appear in the share popup
      await page.locator("//span[normalize-space()='Copy Link']").waitFor({ state: 'visible' });

      // Click Copy Link to write the profile URL to the clipboard
      await page.locator("//span[normalize-space()='Copy Link']").click();

      // Read the copied URL from the clipboard and log it
      const shareLink = await page.evaluate(() => navigator.clipboard.readText());
      console.log('Sharable link:', shareLink);
    });
  });

});