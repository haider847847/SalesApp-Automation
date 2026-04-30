class login 
{
    constructor (page)
    {
        this.page = page
        this.email = this.page.locator ("(//input[@placeholder='Enter your email address…'])[1]")
        this.password = this.page.locator ("//input[@type='password']")
        this.loginclick = this.page.locator ("//button[normalize-space()='Log in now']")
    } 

    async loginToApplication(email,password)
    {
        await this.email.fill(email);
        await this.password.fill(password)
        await Promise.all(
            [
                this.loginclick.click(),
                this.page.waitForURL(/.*\/feed\/gilroy/, { timeout: 40000 })
            ]
        )
    }
}


module.exports = login