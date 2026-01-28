import{test,expect} from 'playwright/test';
import { CustomerFlow } from '../pom/CustomerFlow';
import { Homepage } from '../pom/Homepage';
import { ManagerFlow } from '../pom/ManagerFlow';
import dataset from "../testDatautils/testData.json";

test.beforeEach(async ({ page }) => {
    const homepage = new Homepage(page);
    const managerFlow = new ManagerFlow(page);
    
    await homepage.goToHomePage(dataset.devEnvURL);
    await homepage.goToBankManagerLogin();
    await managerFlow.addCustomer(dataset.firstName,dataset.lastName,dataset.postCode);
    await managerFlow.submitCustomerAndHandleAlert('Customer added successfully with customer id :');
    await managerFlow.openAccountForCustomer(dataset.firstName,dataset.lastName,dataset.currency,'Account created successfully with account Number :');

});

test.describe('@customerOnly @smoke ', () => {
    test('Make a deposit',async ({page})=>
    {
        const customerFlow = new CustomerFlow(page);
        const homepage = new Homepage(page);
        await homepage.goToCustomerLogin();
        await homepage.goToCustomerAccountPage(dataset.firstName,dataset.lastName);
        
        const accountBalanceBeforeDeposit = await customerFlow.getCustomerPageContent(dataset.firstName,dataset.lastName,dataset.currency);
        console.log('Account Balance before deposit: ', accountBalanceBeforeDeposit);
        
        const accountBalanceAfterDeposit = await customerFlow.performDeposit(dataset.amount);
        console.log('Account Balance after deposit: ', accountBalanceAfterDeposit);
        expect(Number(accountBalanceAfterDeposit)).toBe(dataset.amount);
        
        await customerFlow.verifyTransaction(dataset.amount,dataset.transactionType);
    });
});

test.describe('@customerOnly @negativeTests', () => {
    test('Validate deposit amount error when amount is empty',async ({page})=>
    {
        const customerFlow = new CustomerFlow(page);
        const homepage = new Homepage(page);
        await homepage.goToCustomerLogin();
        await homepage.goToCustomerAccountPage(dataset.firstName,dataset.lastName);
        await customerFlow.checkValidationMessageForAmount();
    });
});

test.afterEach(async ({ page }) => {

    const customerFlow = new CustomerFlow(page);
    await customerFlow.logoutCustomer();

});