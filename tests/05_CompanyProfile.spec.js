const { test, expect } = require('../fixtures/CompanyProfile.fixtures');
const DOWNLOAD_BUTTON = "//button[@class='sc-kAyceB nsuzD d-flex align-items-center text-truncate download-profile-blue']";

test.describe('Test 01 - Company Profile', ()=>{

    test("Search Company", async({companySearch: page}) => {
        await expect (page.locator("//label[@for='196']//div[@class='exceptButtonContent']")).toBeVisible();
    })
})


test.describe('Test 02 - Company Profile', ()=>{
    test ("Open Company Profile", async ({companyOpen: page})=>{
        await expect (page.locator("//h1[@class='company-name']")).toContainText("Microsoft Corporation");
    })
})


test.describe('Test 03 - Company Profile', ()=>{
    test("Download Company Dossier PDF", async ({companyOpen: page}) => {
        const downloadPromise = page.waitForEvent('download');
        await page.locator(DOWNLOAD_BUTTON).dispatchEvent('click');
        await page.locator("(//button[@class='sc-kAyceB kGIQXW d-flex align-items-center text-truncate '][normalize-space()='Download'])[1]").click();
        const download = await downloadPromise;
        expect (download.suggestedFilename()).toBeTruthy();
        console.log ("download file name: ", download.suggestedFilename());
    })
});


test.describe('Test 04 - Company Profile', ()=>{
    test("Downlaod Company Profile Power Point", async ({companyOpen: page}) =>{
        const downloadPromise = page.waitForEvent('download');
        await page.locator(DOWNLOAD_BUTTON).dispatchEvent('click');
        await page.locator("(//button[contains(text(),'Download')])[3]").click();
        const download = await downloadPromise;
        expect (download.suggestedFilename()).toBeTruthy();
        console.log("download file name", download.suggestedFilename());
    })
})



