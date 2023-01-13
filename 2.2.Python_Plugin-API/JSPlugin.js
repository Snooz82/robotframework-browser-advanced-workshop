exports.__esModule = true;
exports.mouseWheel = mouseWheel;
exports.blur = async (selector, page) => await page.locator(selector).blur();
exports.disable_element = async (selector, disabled, page) => await page.locator(selector).evaluate((e, disabled) => e.disabled = disabled, disabled);

mouseWheel.rfdoc = `
This keyword uses Playwrights Mouse.wheel function to scroll.`;
async function mouseWheel(x, y, logger, page) {
    logger(`Mouse wheel at ${x}, ${y}`);
    await page.mouse.wheel(x, y);
    logger('Returning a funny string');
    return await page.evaluate('document.scrollingElement.scrollTop');
}
