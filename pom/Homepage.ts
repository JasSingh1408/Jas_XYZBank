import { type Locator, type Page } from "playwright/test";
import { expect } from "playwright/test";

export class Homepage {

    page: Page;
    customerLogin: Locator;
    bankManagerLogin: Locator;
    customerSelection: Locator;
    customerPageLoginButton: Locator;
    homeButton:Locator;
    

    constructor(page:any)
    {
        this.page = page;
        this.homeButton = page.getByRole('button',{name:'Home'});
        this.customerLogin = page.getByRole('button',{name:'Customer Login'});
        this.bankManagerLogin = page.getByRole('button',{name:'Bank Manager Login'});
        this.customerSelection = page.locator("[name='userSelect']");
        this.customerPageLoginButton = page.getByRole('button',{name:'Login'});

    }

async goToHomePage(url:string)
{
    await this.page.goto(url);
    await expect(this.customerLogin).toBeVisible();
    await expect(this.bankManagerLogin).toBeVisible();

}

async goToCustomerLogin()
{
    await this.homeButton.click();
    await this.customerLogin.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.customerSelection).toBeVisible();
}

async goToCustomerAccountPage(firstName:string,lastName:string)
{
    await this.customerSelection.selectOption(firstName+" "+lastName);
    await this.customerPageLoginButton.click();
}

async goToBankManagerLogin()
{
    await this.homeButton.click();
    await this.bankManagerLogin.click();
    await this.page.waitForLoadState('networkidle');
}

}

//export {Homepage};