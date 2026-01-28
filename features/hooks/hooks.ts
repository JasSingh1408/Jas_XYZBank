import { Before, After, BeforeStep,AfterStep, Status } from '@cucumber/cucumber';
import { POManager } from '../../pom/POManager';
import playwright from 'playwright';


Before(async function () {
    const browser = await playwright.chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();
    this.poManager = new POManager(page);
    this.page = page;

});


After(async function () {
    if (this.page && !this.page.isClosed()) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
});

BeforeStep(async function () {

});

AfterStep(async function ({result}) {
    if (result.status === Status.FAILED) {
        await this.page.screenshot({ path: 'screenshots_1.png'});
    }
});

//Before runs before each scenario and beforeAll runs once before all scenarios.
// After runs after each scenario and afterAll runs once after all scenarios.