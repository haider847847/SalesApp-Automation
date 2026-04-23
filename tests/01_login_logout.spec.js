const { test, expect } = require('@playwright/test');
const login = require ("../Pages/Login")
const testdata = require ("../testdata.json")
test.describe.configure({ mode: 'serial' });

// ✅ Tell this test to start with NO stored session
test.use({ storageState: { cookies: [], origins: [] } });

test ("Login to SalesApp", async function({page})
{
  await page.goto("https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com")
  const loginClick = new login (page)
  await loginClick.loginToApplication
  (
    testdata.email,
    testdata.password
  )

  //Certification pop up cacel
  await page.getByRole('button', { name: 'Register now' }).nth(2).click()

  // SAVE SESSION AFTER LOGIN
  //await page.context().storageState({ path: 'auth.json' })
  
  
}
)


test.describe('After Login Tests', () => {
test.use({ storageState: 'auth.json' })

test ("Logout from SalesApp", async function({page})
{
  await page.goto("https://salesapp.xiqonline.com")
  //Logout from bottom left button 
  await page.getByRole('button', { name: 'Profile picture for menu' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await Promise.all([
   page.getByRole('button', { name: 'Yes' }).click(),
   expect(page).toHaveURL("https://xiqonline.com/auth/login/?&redirectURL=https://salesapp.xiqonline.com")
  ])
}) 

})