exports.__esModule = true;
exports.getLinks = getLinks;
exports.uploadFileByClick = uploadFileByClick;

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


async function uploadFileByClick(selector, filePath, page) {
    const fileChooserPromise = page.waitForEvent('filechooser');
    page.locator(selector).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
}