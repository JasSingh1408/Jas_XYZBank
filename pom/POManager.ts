// in TS, we use import/export instead of require/module.exports
import { type Locator, type Page } from "playwright/test";
import { CustomerFlow } from './CustomerFlow';
import { Homepage } from './Homepage';
import { ManagerFlow } from './ManagerFlow';


export class POManager {
    page: Page;
    homepage: Homepage;
    customerFlow: CustomerFlow;
    managerFlow: ManagerFlow;
    

    constructor(page: any) {
        this.page = page
        this.customerFlow = new CustomerFlow(this.page);
        this.homepage = new Homepage(this.page);
        this.managerFlow = new ManagerFlow(this.page);
    
    }
    getHomepage() {
        return this.homepage;
    }

    performManagerFlow() {
        return this.managerFlow;
    }

    performCustomerFlow() {
        return this.customerFlow;
    }

}