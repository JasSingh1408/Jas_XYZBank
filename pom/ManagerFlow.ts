import { type Locator, type Page } from "playwright/test";
import { expect } from "playwright/test";

export class ManagerFlow {

    page: Page;
    addCustomerButton: Locator;
    openAccountButton: Locator;
    customersButton: Locator;
    firstName:Locator;
    lastName:Locator;
    postCode:Locator;
    addCustomerSubmit:Locator;
    searchCustomer:Locator;
    customersTableRow:Locator;
    deleteCustomerButton:Locator;
    customerDropdown: Locator;
    currencyDropdown: Locator;
    processButton: Locator;
    
    constructor(page:any)
    {
        this.page = page;
        this.addCustomerButton = page.locator("[ng-class='btnClass1']");
        this.openAccountButton = page.getByRole('button',{name:'Open Account'});
        this.customersButton = page.getByRole('button',{name:'Customers'});
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.postCode=page.getByPlaceholder('Post Code');
        this.addCustomerSubmit=page.locator("[type='submit']");
        this.searchCustomer=page.getByPlaceholder('Search Customer');
        this.customersTableRow=page.locator('tbody tr').first();
        this.deleteCustomerButton = page.getByRole('button',{name:'Delete'}).first();
        this.customerDropdown = page.locator('#userSelect');
        this.currencyDropdown = page.locator('#currency');
        this.processButton = page.getByRole('button',{name:'Process'});

    }

async verifyBankManagerLoginPageContent()
{
    await expect(this.addCustomerButton).toBeVisible();
    await expect(this.openAccountButton).toBeVisible();
    await expect(this.customersButton).toBeVisible();
}

async verifyMandatoryFieldsOnAddCustomerForm()
{
    await this.addCustomerButton.click();
    expect(this.firstName.getAttribute('required')).toBeTruthy();
    expect(this.lastName.getAttribute('required')).toBeTruthy();
    expect(this.postCode.getAttribute('required')).toBeTruthy();
}

async addCustomer(firstName:string,lastName:string,postCode:string)
{
    await this.addCustomerButton.click();
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postCode.fill(postCode);

}

async submitCustomerAndHandleAlert(alertMessageSubstring:string)
{
    const dialogPromise = this.handleDialog(alertMessageSubstring); //promise to wait for alert to appear
    await this.addCustomerSubmit.click();

    const customerId = await dialogPromise;
    console.log('Extracted Customer ID: ', customerId);
                        
}

async handleDialog(expectedMessageSubstring: string) 
{
  const dialog = await this.page.waitForEvent('dialog');
  const message = dialog.message();
  expect(message).toContain(expectedMessageSubstring);

  const displayedNumber = message.match(/\d+/)?.[0]
  await dialog.accept();

  if (displayedNumber) {
    console.log(message);
    return displayedNumber;
  }
  //return displayedNumber;  // returning displayed number if any
}

async verifyCustomersRecord(firstName:string,lastName:string,postCode:string)
{
    const firstRow = this.customersTableRow.first().locator('td');
    await this.customersButton.click();
    await this.searchCustomer.fill(firstName);
    await this.customersTableRow.waitFor();                 //wait for customer table data to reload
    await expect(firstRow.nth(0)).toContainText(firstName);
    await expect(firstRow.nth(1)).toContainText(lastName);
    await expect(firstRow.nth(2)).toContainText(postCode);
    await expect(this.deleteCustomerButton).toBeVisible();
    
    const accountNumberInTable = await firstRow.nth(3).innerText();
    //console.log('Account Number in Table: ', accountNumberInTable);
    return accountNumberInTable;
    
}

async openAccountForCustomer(firstName:string, lastName:string, currencyType:string,alertMessageSubstring:string)
{
    const customerFullName = firstName+" "+lastName;
    console.log('Customer Full Name: ', customerFullName);
    await this.openAccountButton.click();
    await this.customerDropdown.selectOption(customerFullName);
    await expect(this.currencyDropdown.locator('option')).toHaveText(['---Currency---','Dollar','Pound','Rupee']); //Available currencies: Dollar, Pound, Rupee
    await this.currencyDropdown.selectOption(currencyType);
    const dialogPromise = this.handleDialog(alertMessageSubstring); //promise to wait for alert to appear
    await this.processButton.click();
    const accountNumber = await dialogPromise;
    
    return accountNumber;
    

}

}