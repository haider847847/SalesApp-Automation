const { test:base , expect } = require('@playwright/test');
const { TIMEOUT } = require('node:dns');

const LANDING_URL = 'https://salesapp.xiqonline.com/feed/gilroy';

const test = base.extend({

      /**
       * @type {import('@playwright/test').Page}  // ← tells IntelliSense what type this is
       */
      landingPage: async ({page},use) =>{
        await page.goto(LANDING_URL);
        await expect(
            page.locator("input[placeholder='Search']")
            ).toBeVisible();
        
        await use(page);    

      },

      companySearch: async ({landingPage: page},use) => {
        await page.locator("input[placeholder='Search']").click();
        await page.locator("input[placeholder='Search']").fill("Microsoft")
        await page.keyboard.press("Enter");
        await expect(page.locator("//label[@for='196']//div[@class='exceptButtonContent']")).toBeVisible({timeout:120000});
        await use(page);
      },

      companyOpen: async ({companySearch: page},use) => {
        await page.locator("//label[@for='196']//div[@class='exceptButtonContent']").click()
        await expect (page.locator("//h1[@class='company-name']")).toContainText("Microsoft Corporation");
        await use(page);
      },
}
)



module.exports = { test, expect };
