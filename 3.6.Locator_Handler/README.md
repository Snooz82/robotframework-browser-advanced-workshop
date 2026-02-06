# 3.6 Locator handler
Locator handler is an automatic way to handle unexpected overlays in the webpage, example
cookie banners or similar things, which can happen in random time in test execution.
Although it is usually better to handle cookie banners by setting the cooke, example with
JavaScript, in all cases this is not possible. In those case using the
[Add Locator Handler Click](https://marketsquare.github.io/robotframework-browser/Browser.html#Add%20Locator%20Handler%20Click)
and
[Add Locator Handler Custom](https://marketsquare.github.io/robotframework-browser/Browser.html#Add%20Locator%20Handler%20Custom)
keywords offer an automatic way to handle such popups.

Keywords registers a waiter or an handler, which waits for elements to appear in the page.
If elements is seen it performs the action defined the handler. There is the default one
which performs a click, example on a button which accepts or denies cookies and there is
custom handler which allows to register custom set of actions: click, fill, check and
uncheck to perform when locator is seen in the page.

# Exercise
Lets look basic example with
[Add Locator Handler Click](https://marketsquare.github.io/robotframework-browser/Browser.html#Add%20Locator%20Handler%20Click)
keyword.

To use the page your test should do setup like this:

```robotframework
*** Settings ***
Library    Browser
Library    Dialogs
Test Setup    Overlay Setup

*** Test Cases ***
Overlay Blocks Input
    Type Text    id=textInput    Hello World
    Pause Execution    message=No overlay
    Click    id=openOverlay
    Pause Execution    message=There is overlay
    Type Text    id=textInput    What is your name?


*** Keywords ***
Overlay Setup
    VAR    ${file}    file://${CURDIR}/overlay.html
    New Browser    chromium    False
    New Page    ${file}
    Set Browser Timeout    5s
```
The `Overlay Blocks Input` test fails, because when tests clicks the `id=openOverlay`
element, it will display an overlay which blocks writing to the input element.

Your task is to use the `Add Locator Handler Click` keyword and register
a handler which will remove the overlay. As bonus, configure locator handler
to work only two times and make make the test fail on third attempt.

# Solution
Solution can be found from [overlay.robot](overlay.robot) file.
