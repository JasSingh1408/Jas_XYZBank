import{test,expect} from 'playwright/test';
import { ManagerFlow } from '../pom/ManagerFlow';
import { Homepage } from '../pom/Homepage';
import dataset from "../testDatautils/testData.json";

test.beforeEach(async ({ page }) => {
    const homepage = new Homepage(page);
    const managerFlow = new ManagerFlow(page);

    await homepage.goToHomePage(dataset.devEnvURL);
    await homepage.goToBankManagerLogin();
    await managerFlow.addCustomer(dataset.firstName,dataset.lastName,dataset.postCode);
    await managerFlow.submitCustomerAndHandleAlert('Customer added successfully with customer id :');
});

test.describe('@managerOnly @smoke @createCustomer', () => {
    test('Create a customer',async ({page})=>
    {
        const managerFlow = new ManagerFlow(page);
        managerFlow.verifyMandatoryFieldsOnAddCustomerForm();
        const accountNumberInTable = await managerFlow.verifyCustomersRecord(dataset.firstName,dataset.lastName,dataset.postCode);
        expect(accountNumberInTable).toBe(''); //account number should be blank when customer is just created
    
    });
});

test.describe('@managerOnly @smoke', () => {
    test('Open account for customer',async ({page})=>
    {
        const managerFlow = new ManagerFlow(page); 
        const accountNumber = await managerFlow.openAccountForCustomer(dataset.firstName,dataset.lastName,dataset.currency,"Account created successfully with account Number :");
        const updatedAccountNumberInTable = await managerFlow.verifyCustomersRecord(dataset.firstName,dataset.lastName,dataset.postCode);

        //console.log('Updated Account Number: ', updatedAccountNumberInTable); //Account number after opening account
        expect(updatedAccountNumberInTable === accountNumber); //The customer’s record in the Customers table is updated with the new account number

    });
});

test.describe('@managerOnly @negativeTests', () => {
    test('Create duplicate customer',async ({page})=>
    {
        const managerFlow = new ManagerFlow(page);
        await managerFlow.addCustomer(dataset.firstName,dataset.lastName,dataset.postCode);
        await managerFlow.submitCustomerAndHandleAlert('Please check the details. Customer may be duplicate.');
    
    });
});