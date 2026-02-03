
import ExamplesExplorer from '@site/src/components/ExamplesExplorer';

[← Back](/)

# 1.3.1 Browsers installation
By default we install browser binaries packed with Playwright: Chrome for testing, Firefox
and Webkit. `rfbrowser install` or `rfbrowser init` command installs all those three. It
is also possible to install only the selected browsers, example `rfbrowser install firefox`
will install only Firefox. The those three browser binaries are installed in the Browser
library installation directory and are isolated from the browser binaries installed in
the system.

It is also possible to install chrome, chrome-beta, msedge, msedge-beta and msedge-dev
to your system with`rfbrowser install` or  `rfbrowser init` But please note that are not
isolated in same way as Chrome for testing, Firefox and Webkit are. Instead installing
example Chrome will replace the Chrome browser in your system. So be careful, if you
decide to go this route.

It is possible to skip browser binary installation and use your preferred way to manege
browser binaries. Example in Docker container you may have browser binaries preinstalled
and you may want to install only Browser library and it Python and NodeJS dependencies.

[examples](#1.3.example)

[reuse_existing.robot](?file=reuse_existing.robot#1.3.example)


## 1.3.1.1 Using system Chrome or Edge
Regardless how you did install Chrome or Edge, you can use these chromium based browsers
in your tests.

If you have Edge or Chrome installed in your system, write a test which launches
Edge or Chrome for testing

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Test With Chrome
    New Browser    headless=False    channel=chrome
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=comment]    This is comment

```

And run test with
```bash
robot --outputdir output examples/1/1.3/chrome_channel.robot
```

# 1.3.2 Browser, Context, Page
Browser/Context/Page are the three pillars of Playwright. These pillars define test data controls the browser
binaries and how the pages are opened.

## 1.3.2.1 Browser
Browser defines which browser engine is used (chromium, firefox and webkit or on of the system installed
chromium browser) and few other environment related options, like timeout or location of an external
browser binary. Browser is the highest level in the hierarchy and there can be many browser open at the
same time.

Browsers are by default reused as long as they have the same options.

## 1.3.2.2 Context
Context defines how the browser engine is opened, one can see as a definition how the browser profile is created.
Example context defines is the offline mode enabled or what geolocation is set for the context, or allows modification
of browser headers. Also controls few debugging options, like trace or video creation.

Each context is opened under the specific browser and one browser can have multiple context open at the same time.

## 1.3.2.3 Page
Page is like a tab in the browser, it renders the opened URL. Page is always open under a specific context.
One context can have multiple pages open.

Example browsers/contexts/pages structure could be opened like this:
```
Browser 1
    -> Context 1.1
        -> Page 1.1.1
        -> Page 1.1.2
    -> Context 1.2
        -> Page 1.2.1
        -> Page 1.2.2
        -> Page 1.2.3
Browser 2
    -> Context 2.1
        -> Page 2.1.1
        -> Page 2.1.2
```

<ExamplesExplorer path="1/1.3" title="Chapter 1.3 Examples" id="1.3.example"/>

## 1.3.2.4 Persistent context
Persistent context is special type of context. It creates automatically new browser and
the main difference to "normal" context is that user can pass in
[user data dir](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir)
and provide arguments to launch the browser binary. But use custom browser args
at your own risk, as some of them may break Playwright functionality.

# 1.3.3 Mobile
You can test mobile views easily with Browser library. Browser library provides
[Get Device](https://marketsquare.github.io/robotframework-browser/Browser.html#Get%20Device)
keyword which allows you to set correct form factor and mobile settings for different
models.

Your task is to use `Get Device` keyword in your tests and experiment with different
mobile models. See how it affects the underlying page. Different mobiles can be found from
[Playwright deviceDescriptorsSource.json](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json)
file. In your test use a public page which is reactive to mobile form factor.

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Mobile testing
    &{device}=    Get Device    iPhone 15
    New Context    &{device}
    New Page    https://marketsquare.github.io/robotframework-browser/Browser.html
    Take Screenshot    mobile.png

```

# 1.3.4 Connect over CDP
The
[Connect To Browser](https://marketsquare.github.io/robotframework-browser/Browser.html#Connect%20To%20Browser)
keyword allows users to connect to a Playwright browser server via playwright websocket
or Chrome DevTools Protocol. Connect keyword is useful if you your browser binaries are
hosted in different container/VM and you need to connect to from container/VM where
your tests are running. Example Browsertack support connect.

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Launch Browser Server Generated wsEndpoint
    ${wsEndpoint} =    Launch Browser Server    chromium    headless=${HEADLESS}
    ${browser} =    Connect To Browser    ${wsEndpoint}
    New Page    ${LOGIN_URL}
    Get Title    ==    Login Page
    [Teardown]    Close Browser Server    ${wsEndpoint}
```

There is also an entry point to create wsEndpoint. Run
`rfbrowser launch-browser-server --help` for how use the entry point.

Create new test to use wsEndpoint created by rfbrowser launch-browser-server
entry point.

```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Connect To wsEndpoint
    VAR    ${wsEndpoint}    ws://localhost:61097/c2a09d1d363fb4ee8d1577c0d3761e32    # This is an example wsEndpoint
    ${browser} =    Connect To Browser    ${wsEndpoint}
    New Page    http://localhost:7272/prefilled_email_form.html
    Get Title    ==    prefilled_email_form.html

```

Run example this from shell before the test
```bash
rfbrowser launch-browser-server chromium headless=True "timeout=10 sec"
```


# 1.3.5 Pabot Speed Run

When using Pabot each Thread starts and stops Robot Framework instances. That means that by default Browser library is initialized, a node process is started with Playwright, a browser process is started and tests are executed. Then all that is terminated again.

What if we could **REUSE** the node process of RF Browser and also start only one browser per thread and just connect to it???

see [tasks.py](/downloads/tasks.py) for an example implementation.

Steps to execute:
1. determine the number of physical cores on your machine
2. start one Browser library instance with the NodeJS process and store the port number
3. launch one Browser server vor each Pabot-thread/physical core and store the websocket endpoints in a variable
4. start Pabot and hand over the NodeJS port and the websocket endpoints as Robot Framework variables.
5. use these wsEndpoints in your tests if Pabot is in use and connect to the Browser server

This script has some different modes.
- `--reuse-node` When this is set, only one node process is started and its port is reused in all threads. That makes it possible to start the Browser in threads in parallel at the same time.
- `--reuse-browser` When this is set, only one browser is started per thread and its wsEndpoint is reused in all threads.
- `--browser_start_mode` This can either be `serial` or `parallel` and defines if the browsers are started after each other or in parallel. `parallel` only works with `--reuse-node` and `--reuse-browser` set.
- `--headful` When this is set, the browser is started in headful mode.
- `--browser` This can be `chromium`, `firefox` or `webkit` and defines which browser is used.
- `--processes` This defines how many processes are started in parallel. If set to `0` the amount of physical cores is used.

See [RF-Browser-Architecture.pptx](/downloads/RF-Browser-Architecture.pptx) for more information.

# 1.3.6 Scope for Browser, Context and Page
Browser library has scope or life cycle of objects. Example automatic of closing pages is controlled
library import `auto_closing_level`
[import](https://marketsquare.github.io/robotframework-browser/Browser.html#Importing)
parameter. Possible values are:
- TEST
- SUITE
- MANUAL
- KEEP

When automatic closing level is TEST, contexts and pages that are created during a single test are automatically
closed when the test ends. Contexts and pages that are created during suite setup are closed when the suite
teardown ends.

When automatic closing level is SUITE, all contexts and pages that are created during the test suite are closed
when the suite teardown ends.

When automatic closing level is MANUAL, nothing is closed automatically while the test execution is ongoing.
All browsers, context and pages are automatically closed when test execution ends.

When automatic closing level is KEEP, nothing is closed automatically while the test execution is ongoing.
Also, nothing is closed when test execution ends,


## 1.3.6.1 Scope with other objects
Several keyword also change library attributes have scope or lifetime of an object. Example
[Set Browser Timeout](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Browser%20Timeout)
changes the timeout and set timeout can be valid for certain duration. Possible values are:
- Global
- Suite
- Test


A Global scope will live forever until it is overwritten by another Global scope. Or locally
temporarily overridden by a more narrow scope. A Suite scope will locally override the
Global scope and live until the end of the Suite within it is set, or if it is overwritten by
a later setting with Global or same scope. Children suite does inherit the setting from the parent
suite but also may have its own local Suite setting that then will be inherited to its children suites.
A Test or Task scope will be inherited from its parent suite but when set, lives until the end of that
particular test or task.

Keywords that change library attributes by a scope are:
[Register Keyword To Run On Failure](https://marketsquare.github.io/robotframework-browser/Browser.html#Register%20Keyword%20To%20Run%20On%20Failure),
[Set Assertion Formatters](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Assertion%20Formatters),
[Set Browser Timeout](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Browser%20Timeout),
[Set Retry Assertions For](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Retry%20Assertions%20For),
[Set Selector Prefix](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Selector%20Prefix),
[Set Strict Mode](https://marketsquare.github.io/robotframework-browser/Browser.html#Set%20Strict%20Mode)
and [Show Keyword Banner](https://marketsquare.github.io/robotframework-browser/Browser.html#Show%20Keyword%20Banner)

Write me a test that uses scope setting between test and proves that previous value of setting is restored.

```robotframework
*** Settings ***
Library    Browser    timeout=5s
Suite Setup    New Page   http://localhost:7272/prefilled_email_form.html

*** Test Cases ***
Default Scope
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With 5 seconds
    END

Page Scope
    Set Browser Timeout    1s    Test
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With one second
    END

Back to default scope
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With 5 seconds
    END

```

## # 1.3.6.2 Automatic open browser and context
If default settings for browser or context are good for this test cas, then
calling directly
[New Page](https://marketsquare.github.io/robotframework-browser/Browser.html#New%20Page)
automatically opens browser and context.

Example these tests are same logically:
```robotframework
*** Settings ***
Library     Browser


*** Test Cases ***
Automatic Opening Of Browser And Context
    New Page    https://marketsquare.github.io/robotframework-browser

Is Same As
    New Browser
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
```

## # 1.3.6.2 Reusing same browser
If you call
[New Browser](https://marketsquare.github.io/robotframework-browser/Browser.html#New%20Browser)
multiple times with same arguments it does not by default create new browser
object. Instead same browser is reused. If you want to create new browser
use ` reuse_existing` argument as false.


```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Reuse
    New Browser
    New Browser
    ${catalog} =    Get Browser Catalog
    Length Should Be    ${catalog}    1
    New Browser    reuse_existing=False
    ${catalog} =    Get Browser Catalog
    Length Should Be    ${catalog}    2

```
