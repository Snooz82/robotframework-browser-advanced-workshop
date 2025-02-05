exports.__esModule = true;
exports.getLinks = getLinks;
exports.uploadFileByClick = uploadFileByClick;
exports.myMouseWheel = mouseWheel;
exports.mySuperKeyword = () => 'Hello World';



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