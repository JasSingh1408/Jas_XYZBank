import { type Locator, type Page } from "playwright/test";
import { expect } from "playwright/test";

export class CustomerFlow{

    page: Page;
    fullName: Locator;
    accountNumber: Locator;
    accountBalance: Locator;
    currency: Locator;
    transactionsTable: Locator;
    depositButton: Locator;
    withdrawlButton: Locator;
    amountTextBox: Locator;
    depositAmountButton: Locator;
    transactionsButton: Locator;
    depositConfirmationMessage:Locator;
    logOutButton:Locator;

    constructor(page:any)
    {
        this.page = page;
        this.fullName = page.locator('.fontBig');
        this.accountNumber = page.locator('.center>>.ng-binding').nth(0)  ;
        this.accountBalance = page.locator('.center>>.ng-binding').nth(1);
        this.currency = page.locator('.center>>.ng-binding').nth(2);
        this.transactionsButton = page.getByRole('button',{name:'Transactions'});
        this.depositButton = page.getByRole('button',{name:'Deposit'});
        this.withdrawlButton = page.getByRole('button',{name:'Withdrawl'});
        this.amountTextBox = page.getByPlaceholder('amount');
        this.depositAmountButton = page.locator("[type='submit']");
        this.transactionsTable = page.locator('tbody tr');
        this.depositConfirmationMessage = page.locator('.error');
        this.logOutButton = page.getByRole('button',{name:'Logout'});

    }
async getCustomerPageContent(firstName:string, lastName:string, currencyType:string) {
    
    const fullNameText = await this.fullName.textContent(); 
    const accountNumber = await this.accountNumber.textContent(); 
    const accountBalance = await this.accountBalance.textContent();
    const currencyText = await this.currency.textContent();

    await expect(this.transactionsButton).toBeVisible();
    await expect(this.depositButton).toBeVisible();
    await expect(this.withdrawlButton).toBeVisible();

    console.log('Customer Name upon landing on customer login page :' + fullNameText);
    console.log('Account Number upon landing on customer login page :' + accountNumber);
    console.log(`Account Balance upon landing on customer login page : ${accountBalance}`);  
    console.log(`Currency upon landing on customer login page : ${currencyText}`);
    expect(fullNameText).toBe(firstName + " " + lastName);
    expect(currencyText).toBe(currencyType);

    return accountBalance;
    
}


async performDeposit(amount:number)
{
    expect(this.amountTextBox.getAttribute('required')).toBeTruthy();
    await this.depositButton.click();
    await this.amountTextBox.fill(amount.toString());
    await this.depositAmountButton.click();
    await expect(this.depositConfirmationMessage).toContainText('Deposit Successful');

    await this.page.waitForTimeout(2000);  //wait for 2 seconds to get updated balance
    //await this.page.reload();         //refresh the page to get updated balance
    const UpdatedAccountBalance = await this.accountBalance.textContent();
    return UpdatedAccountBalance;

}

async verifyTransaction(amount:number,transactionType:string)
{
    const firstRecord = this.transactionsTable.first().locator('td');
    await this.transactionsButton.click();
    expect( await firstRecord.nth(1).textContent()===amount.toString()).toBeTruthy();
    expect( await firstRecord.nth(2).textContent()).toBe(transactionType);
}

async checkValidationMessageForAmount()
{
    await this.depositButton.click();
    await this.depositAmountButton.click();
    await expect(this.amountTextBox).toHaveJSProperty('validationMessage', 'Please fill in this field.'); //If an empty amount is submitted, the following tooltip is displayed: “Please fi ll in this fi eld.”
    
    // this code can be used as alternative to above expect statement when browser don't have same statement for the validation message
    /*
    const validationMessage = await this.amountTextBox.evaluate(el => (el as HTMLInputElement).validationMessage);
    expect(validationMessage).toMatch(/fill|enter|number|field/i);
    */
}

async logoutCustomer()
{
    await this.page.waitForURL('**/BankingProject/**');
    await this.logOutButton.click();
}
}