Feature: Scenarios for Bank Manager Role

@managerOnly @smoke @functionalTests @regression @xyzbank @createCustomer
Scenario: user verify the mandatory fields on Add Customer form, Save the Customer with Valid data and verify the data in Customer table
    Given User accesses the bank application "URL" as a Bank Manager
    When User clicks the Bank Manager Login button
    Then The Bank Manager homepage is displayed with buttons "Add Customer", "Open Account" and "Customers"
    Then On Add Customer Page user verifies First Name, Last Name and Post Code are required fields
    When User fill "First Name", "Last Name", "Post Code" data and creates a customer
    Then The operation is successful with message is displayed: "Customer added successfully with customer id :X"
    Then New record is added to the Customers table
    When User try to add duplicate customer
    Then Validation message is displayed: "Please check the details. Customer may be duplicate."