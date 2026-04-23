const { test, expect } = require('@playwright/test');
const { describe } = require('node:test');
test.describe.configure({ mode: 'serial' });

test.describe ("Document Hub",() =>{
test("Redirection to Document Hub", async function ({page})
{
    await page.goto("https://salesapp.xiqonline.com")
    await page.locator (".document-svg").click()
    await expect (page).toHaveURL(/\/documents/)
}
)
})


test.describe("Document Hub",() =>{

test ("Upload File", async function ({page})
{
    await page.goto("https://qasalesapp.xiqonline.com/documents")
    await page.waitForTimeout(8000)
  //Certification pop up cacel
    await page.getByRole('button', { name: 'Register now' }).nth(2).click()
    await page.getByRole('button', { name: 'xiQ, Inc. (Shared Folder)', exact: true }).click()
    await page.waitForTimeout(4000)
    await page.getByRole('button', { name: 'Upload document', exact: true }).click()
    const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
      page.locator("//span[normalize-space()='here to upload']").click()
  ]);
    await fileChooser.setFiles("C:/Users/Haider Mahmood/Downloads/workkk.pptx")
    await expect(
       page.locator("//span[@class='upload-percentage isSuccessful']")
            ).toHaveText("Uploaded Successfully", { timeout: 30000 })
    
    //Close Upload Panel 
    await page.locator("body > div:nth-child(8) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > svg:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > g:nth-child(1) > circle:nth-child(1)").click()
    await page.getByRole('checkbox').nth(0).check();
    await page.waitForTimeout(2000)
}
)
})




