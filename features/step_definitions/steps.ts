import { Given, When, Then } from '@cucumber/cucumber';
import { ManagerFlow } from '../../pom/ManagerFlow';
import { Homepage } from '../../pom/Homepage';
import dataset from '../../testDatautils/testData.json';


let homePage:Homepage;
let managerFlow:ManagerFlow;


Given('User accesses the bank application {string} as a Bank Manager',{timeout:10*1000}, async function (url) {
    homePage = this.poManager.getHomepage();
    await homePage.goToHomePage(dataset.devEnvURL);
});

When('User clicks the Bank Manager Login button',{timeout:10*1000}, async function () {
    //homePage = this.poManager.getHomepage();
    await homePage.goToBankManagerLogin();
});

Then('The Bank Manager homepage is displayed with buttons "Add Customer", "Open Account" and "Customers"',{timeout:10*1000}, async function () {
    managerFlow = this.poManager.performManagerFlow();
    await managerFlow.verifyBankManagerLoginPageContent();
});

Then('On Add Customer Page user verifies First Name, Last Name and Post Code are required fields',{timeout:10*1000}, async function () {
    //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.verifyMandatoryFieldsOnAddCustomerForm();
});

When('User fill {string}, {string}, {string} data and creates a customer',{timeout:10*1000}, async function (firstName,lastName,postCode) {
   //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.addCustomer(dataset.firstName,dataset.lastName,dataset.postCode);
});

Then('The operation is successful with message is displayed: {string}',{timeout:10*1000}, async function (alertMessageSubstring) {
    //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.submitCustomerAndHandleAlert('Customer added successfully with customer id :');  
});

Then('New record is added to the Customers table',{timeout:10*1000}, async function () {
    //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.verifyCustomersRecord(dataset.firstName,dataset.lastName,dataset.postCode);
});

When('User try to add duplicate customer',{timeout:10*1000}, async function () {
    //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.addCustomer(dataset.firstName,dataset.lastName,dataset.postCode);
});

Then('Validation message is displayed: {string}',{timeout:10*1000}, async function (alertMessageSubstring) {
    //managerFlow = this.poManager.performManagerFlow();
    await managerFlow.submitCustomerAndHandleAlert('Please check the details. Customer may be duplicate.');  
});