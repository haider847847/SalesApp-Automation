const { test, expect } = require('@playwright/test');

test.describe ("Test 1 - Person Profile", ()=>{
    test ("Search Profile", async function({page})
{
    await page.goto("https://uatsalesapp.xiqonline.com/feed/gilroy")
        // Dismiss the certification/register popup (3rd "Register now" button)
    await page.getByRole('button', { name: 'Register now' }).nth(2).click();
    await page.waitForLoadState()
    await page.locator("input[placeholder='Search']").fill("sundar pichai")
    await page.keyboard.press("Enter")
    await page.waitForLoadState()    
    await page.locator("//body[1]/div[1]/div[1]/div[2]/div[1]/main[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/span[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]")
    .click()
    await page.waitForLoadState()

})
})