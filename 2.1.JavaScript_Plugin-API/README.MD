[<- Back](/README.md)

# 2.1 JavaScript Plugin-API

```javascript
exports.__esModule = true;
exports.getLinks = getLinks;
exports.myMouseWheel = mouseWheel;

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


# Debugging JS

To attache a JS debugger to the node side of Browser, to either debug in the libraries internal code or debug your JS Extension,
You have to first enable Browser library to start the Playwright process with debugging enabled and then attach to that process.

## Enable Node Debugging for Playwright Process

To do so, you have to set an environment variable `ROBOT_FRAMEWORK_BROWSER_NODE_DEBUG_OPTIONS` which value will be attached as cli
options to the node process. To enable the debugger you can use `--inspect` or `--inspect-brk`.

`--inspect` just enables debugging and you have to attach the node debugger after the Playwright process has started.
Therefore it is recommended to first set a breakpoint in your robot code, before your js breakpoint happens.

`--inspect-brk` enables debugging and pauses the node process until a debugger is attached. This is useful if you want to debug
the initialization of your JS Extension or the actual start of the Playwright process.
**BUT**: Here you have to be quick to attach the debugger, because if you are too slow, the start of the Playwright process will
timeout. **That timeout is currently ~5 seconds fix.**

It is recommended to use these settings with a specific port so it does not interfere with other debugging sessions or node processes.
You should set it like this: `--inspect=127.0.0.1:9999` to only allow connections from localhost and use port 9999.

Setting environment variables can be done globally, which is not recommended or (recommended) within your Robot debugging launch.json file.
Example for Robot Code extension (partial content of "configurations" array in launch.json file):

    {
        "name": "RobotCode: Default",
        "type": "robotcode",
        "request": "launch",
        "purpose": "default",
        "presentation": {
            "hidden": true
        },
        "env": {
            "ROBOT_FRAMEWORK_BROWSER_NODE_DEBUG_OPTIONS": "--inspect=127.0.0.1:9999"
        },
        "pythonConfiguration": "RobotCode: Python"
    },

This will set the environment variable for the Robot Code debugging session only.

## Attach to Node with VSCode

To attach to the node process you have to create a new launch configuration in your launch.json file.
This "Attach to Node" configuration has to have the same port as the Playwright process for debugging set above.


Example for a "Attach to Node" configuration:

    {
        "name": "Attach to Node",
        "port": 9999,
        "type": "node",
        "request": "attach",
        "skipFiles": [
            "<node_internals>/**"
        ],
    }

## How to run and attach

1. Set your breakpoints in your extension or if you want to debug Browser itself, `site-packages/Browser/wrapper/index.js`.
2. Set your breakpoint in the robot code at an early step, after Library Browser has been loaded and before the js code has been executed, or be quick with step 4. 😉
3. Start Debug Test within the robot file or the test explorer in Robot Code/VSCode and wait until the Robot breakpoint is hit, or be quick if you have none.
4. Select the `Run and Debug` Tab, select the option `Attach to Node` (or what ever name you have used) and click the play button at the top of the `RUN AND DEBUG` area.

