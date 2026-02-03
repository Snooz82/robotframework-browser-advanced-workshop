exports.__esModule = true;
exports.getElementsValue = getElementsValue
exports.startTracing = startTracing
exports.stopTracing = stopTracing

async function startTracing(context) {
    await context.tracing.start({screenshots: true, snapshots: true});
}

async function stopTracing(tracefile, context, logger) {
    logger(`Tracing file: ${tracefile}`);
    await context.tracing.stop({ path: tracefile });
}


async function getElementsValue(selector, page, logger) {
    let elements = await page.locator(selector).all();
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