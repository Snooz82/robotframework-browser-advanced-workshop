[<- Back](/README.md)

# 3.1.1 Waiting by Playwright. 
By default, before performing action, like click, Playwright performs
[automatic waiting](https://playwright.dev/docs/actionability) by doing actionability checks. The waiting depends 
on which action keyword performs. Also some keywords, like
[Click](https://marketsquare.github.io/robotframework-browser/Browser.html#Click)
supports `force` argument which will disable actionability checks.

Example the last click will wait that element is available in the DOM.
```robotframework
*** Settings ***
Library    Browser
Resource   ../../variables.resource

*** Test Cases ***
PW Waiting
    New Page    ${WAIT_URL}
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    Click    \#victim

```

Run example with command:
```bash
robot --outputdir output --loglevel debug 3.1.Waiting/examples/pw_waiting.robot 
```
How long waiting is done, is controlled by the
[library](https://marketsquare.github.io/robotframework-browser/Browser.html#Importing) ` timeout` import
argument or by using
[Set Browser Timeout](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Browser%20Timeout)
keyword. 

# 3.1.2 Waiting with assertions
By default assertions are retried with one seconds. This can be changed with
[library](https://marketsquare.github.io/robotframework-browser/Browser.html#Importing) `  retry_assertions_for`
import argument or by using
[Set Retry Assertions For](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Retry%20Assertions%20For)
keyword.

```robotframework
*** Settings ***
Library    Browser
Resource   ../../variables.resource
Suite Setup    New Browser    headless=False

*** Test Cases ***
Default Assertion timeout
    New Page    ${WAIT_URL}
    Click    \#setdelay
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    TRY
        Get Text    \#victim    ==    Not here
    EXCEPT    *    type=GLOB
        No Operation
    END

Change timeout
    New Page    ${WAIT_URL}
    ${old_timeout} =    Set Retry Assertions For    2s
    Click    \#setdelay
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    TRY
        Get Text    \#victim    ==    Not here
    EXCEPT    *    type=GLOB
        No Operation
    END
    [Teardown]    Set Retry Assertions For    ${old_timeout}
```

Run example with command:
```bash
robot --outputdir output --loglevel debug 3.1.Waiting/examples/assertion_timeout.robot 
```

# 3.1.3 Other Wait For.. keywords
There are multiple helper keywords which can help on different situations. 

## 3.1.3.1 Wait Until Network Is Idle
[Wait Until Network Is Idle](https://marketsquare.github.io/robotframework-browser/Browser.html#Wait%20Until%20Network%20Is%20Idle)
keyword will wait that the network traffic has stopped at least for 500milliseconds.

## 3.1.3.2 Wait For Naviation
[Wait For Navigation](https://marketsquare.github.io/robotframework-browser/Browser.html#Wait%20For%20Navigation)
keyword will wait that page has navigated to URL. The `wait_until` argument can be used to define the page load status.
