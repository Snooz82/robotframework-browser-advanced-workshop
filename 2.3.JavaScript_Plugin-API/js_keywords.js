exports.__esModule = true;
exports.getLinks = getLinks;
exports.uploadFileByClick = uploadFileByClick;
exports.myMouseWheel = mouseWheel;
exports.mySuperKeyword = () => 'Hello World';
exports.startTracing = startTracing
exports.stopTracing = stopTracing
exports.testFirefox = testFirefox
exports.testAll = testAll


async function testAll(playwright, browser, context, page, logger) {
    const request = await playwright.request.newContext({baseURL: 'http://car.keyword-driven.de'});
    const userdata = await request.get('http://car.keyword-driven.de/api/users.php', { params: { username: 'user00' } });
    logger(userdata.status());
    logger(browser.version());
    logger(await context.pages()[0].title());
    logger(await page.title());
    return userdata.json();
}



async function testFirefox(playwright, logger) {
    const browser = await playwright.firefox.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    logger(await page.title());
    await browser.close();
}

async function startTracing(context) {
    await context.tracing.start({screenshots: true, snapshots: true});
}

async function stopTracing(tracefile, context, logger) {
    logger(`Tracing file: ${tracefile}`);
    await context.tracing.stop({ path: tracefile });
}


getLinks.rfdoc = `This keyword is implemented in JS.


It is super cool!`;
async function getLinks (logger, page) {
    logger('Hello World');
    const links = await page.locator('a').evaluateAll(
        elements => {
            const object = {};
            elements.filter(e => e.innerText).forEach(e => object[e.innerText] = e.href);
            return object;
        }
    );
    logger(links);
    return links;
}

mouseWheel.rfdoc = 'This Keyword scrolls the page by mouse input.';
async function mouseWheel (x = 0, y = 0, logger, page, playwright) {
    logger(`Mouse wheel at ${x}, ${y}`);
    await page.mouse.wheel(Number(x), Number(y));
    logger('Returning a funny string');
    return await page.evaluate('document.scrollingElement.scrollTop');
}


async function uploadFileByClick(selector, filePath, page) {
    const fileChooserPromise = page.waitForEvent('filechooser');
    page.locator(selector).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
}