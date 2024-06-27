exports.__esModule = true;
exports.add = add_numbers
exports.add_locator_clicker = add_locator_clicker
exports.getElementsValue = getElementsValue


async function add_numbers(arg1, arg2, logger, page, playwright) {
    return await page.title();
}

async function add_locator_clicker(selector, page) {
    await page.addLocatorHandler(page.locator(selector), async (locator) => {
        await locator.click()
        }
    );
}

async function getElementsValue(selector, page, logger) {
    elements = await page.locator(selector).all();
    const values = [];
    for (let element of elements) {
        let value = await element.inputValue();
        console.log(`console: Selector: ${selector} Value: ${value}`);
        await page.evaluate((arg) => console.log(`page: Selector: ${arg[0]} Value: ${arg[1]}`), [selector, value]);
        logger(`logger: Selector: ${selector} Value: ${value}`);
        values.push(value);
    }
    return values;
}
getElementsValue.rfdoc = "This keyword is implemented in JS. It gets the value of the elements."