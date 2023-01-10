[<- Back](/README.md)

# 2.1 JavaScript Plugin-API

```javascript
exports.__esModule = true;
exports.getLinks = getLinks;
exports.mouseWheel = mouseWheel;

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
async function mouseWheel (x, y, logger, page) {
    logger(`Mouse wheel at ${x}, ${y}`);
    await page.mouse.wheel(Number(x), Number(y));
    logger('Returning a funny string');
    return await page.evaluate('document.scrollingElement.scrollTop');
}
```

# Exercise:

Create two JS Keywords.

- Get Hostname
- Get Protocol

```js
window.location.protocol
```
returns: `'https:'`

```js
window.location.hostname
```
returns: `'robocon.io'`

