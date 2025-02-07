[<- Back](/README.md)

# 1.3.1 Browsers installation
By default we install browser binaries packed with Playwright: Chromium, Firefox and Webkit.
`rfbrowser init` command installs all those three. It is also possible to install only the
selected browsers, example `rfbrowser init firefox` will install only Firefox. The those
three browser binaries are installed in the Browser library installation directory and
are isolated from the browser binaries installed in the system,

It is also possible to install chrome, chrome-beta, msedge, msedge-beta and msedge-dev
to your system with `rfbrowser init` But please note that are not isolated in same way
as Chromium, Firefox and Webkit are. Instead installing example Chrome will replace
the Chrome browser in your system. So be careful, if you decide to go this route.

It is possible to skip browser binary installation and use your preferred way to manege
browser binaries. Example in Docker container you may have browser binaries preinstalled
and you may want to install only Browser library and it Python and NodeJS dependencies.


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
robot --outputdir output 1.3.Browsers_Context_Page_Scope/chrome_channel.robot
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

see [tasks.py](../tasks.py) for an example implementation.

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

See [RF-Browser-Architecture.pptx](../RF-Browser-Architecture.pptx) for more information.

# 1.3.6 Scope
Browser library has scope or life cycle of objects. Example automatic of closing pages
 1.3.6 Life cycle of three pillars
Browser library opens automatically new browser and context, if browser and context does not already exist, when
new page is opened. Example these test case are identical:
```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Automatic Opening Of Browser And Context
    New Page    https://marketsquare.github.io/robotframework-browser

Is Same As
    New Browser
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser

```
Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/automatic_opening.robot
```

Also closing browsers, contexts and pages happens automatically, expect on when KEEP is used.
Automatic closing is controlled with library import:
` auto_closing_level`, default is the `TEST`.

Default automatic closing means that context and pages are automatically closed after each tests
```robotframework
*** Settings ***
Library    Browser

*** Test Cases ***
Open Two Context And Pages On Default Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

No Context Or Pages Open
    TRY
        Get Title    contains    Browser
    EXCEPT    *No page open*    type=GLOB    AS   ${error}
        Log    ${error}
    END

```

Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/life_cycle_test.robot
```
When `SUITE` auto closing level is defined then contexts and pages are closed when execution of single suite ends.
Example when there are these test suites.
```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Open Context And Page With SUITE Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

Context And Page Are Open
    Get Title    contains    Browser

```

```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Not Open In Different Suite
    TRY
        Get Title    contains    Browser
    EXCEPT    *No page open*    type=GLOB    AS   ${error}
        Log    ${error}
    END


```

And this resource file
```robotframework
*** Settings ***
Library    Browser    auto_closing_level=SUITE

```
Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/suite_autoclosing
```

When `MANUAL` auto closing level is defined, then browser, context and pages are closed at the end of the test
execution. Example when there are these test suites:
```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Open Context And Page With SUITE Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

Context And Page Are Open
    Get Title    contains    Browser

```

```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Closed At End Of Test Execution
    Get Title    contains    Browser

```

And this resource file
```robotframework
*** Settings ***
Library    Browser    auto_closing_level=MANUAL

```
Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/manual_autoclosing
```

When `KEEP` auto closing level is defined, then browser, context and pages are not closed. This is useful feature
when developing test cases, but then user is responsible
for terminating process left running, also including
Browser library node process.. Example when there are this suite:

```robotframework
*** Settings ***
Resource    imports.resource


*** Test Cases ***
Open Context And Page With KEEP Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

Context And Page Are Open ForEver
    Get Title    contains    Browser

```

And this resource file
```robotframework
*** Settings ***
Library     Browser    auto_closing_level=KEEP

```
Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/keep_autoclosing
```

After test execution look you favorite process monitor
and notice the lefover processes, example:

```bash
ps -ax | grep robotframework-browser-advanced-workshop
```
 1.3.6 Catalog and Switching
[Get Browser Catalog](https://marketsquare.github.io/robotframework-browser/Browser.html#Get%20Browser%20Catalog)
list all currently open browsers, context and pages. Keyword returns data as list containing dictionaries.
When there is this test:
```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Get Browser Catalog Logs All Open Browser Contexrs And Pages
    New Context
    ${PAGE1} =    New Page    https://marketsquare.github.io/robotframework-browser
    ${PAGE2} =    New Page    https://robotframework.org
    ${CATALOG} =    Get Browser Catalog
    Set Global Variable    ${PAGE1}
    Set Global Variable    ${PAGE2}
    Set Global Variable    ${CATALOG}

```
Run test suite with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/catalog/suite_1.robot
```
Then open the `log.html` from the output folder and loog the `Get Browser Catalog` keyword logging.

When switch between pages, contexts and browsers can be done with
[Switch Page](https://marketsquare.github.io/robotframework-browser/Browser.html#Switch%20Page),
[Switch Context](https://marketsquare.github.io/robotframework-browser/Browser.html#Switch%20Context) and
[Switch Browser](https://marketsquare.github.io/robotframework-browser/Browser.html#Switch%20Browser)
keywords.

When there are these test suites:
```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Get Browser Catalog Logs All Open Browser Contexrs And Pages
    ${BROWSER1} =    New Browser
    ${CONTEXT1} =    New Context
    ${PAGE1} =    New Page    https://marketsquare.github.io/robotframework-browser
    ${PAGE2} =    New Page    https://robotframework.org
    Get Browser Catalog
    Set Global Variable    ${PAGE1}
    Set Global Variable    ${PAGE2}
    Set Global Variable    ${CONTEXT1}
    Set Global Variable    ${BROWSER1}

```

and

```robotframework
*** Settings ***
Resource    imports.resource
*** Test Cases ***
Open Example Pages
    ${BROWSER2} =    New Browser
    ${CONTEXT2} =    New Context
    ${PAGE3} =    New Page    https://github.com/MarketSquare
    ${CONTEXT3} =    New Context
    ${PAGE4} =    New Page    https://robocon.io/
    ${PAGE5} =    New Page    https://github.com/robotframework/
    Get Title    ==    Robot Framework · GitHub
    Set Global Variable    ${PAGE3}
    Set Global Variable    ${PAGE4}
    Set Global Variable    ${PAGE5}
    Set Global Variable    ${CONTEXT2}
    Set Global Variable    ${CONTEXT3}
    Set Global Variable    ${BROWSER2}

Switch Page
    Switch Page    ${PAGE4}[page_id]
    Get Title    ==    RoboCon
    Switch Page    ${PAGE5}[page_id]
    Get Title    ==    Robot Framework · GitHub
    # By default is not possible to switch between context or browsers
    # Magic words "CURRENT" and "ACTIVE" poinst to current context and browser
    TRY
        Switch Page    ${PAGE3}[page_id]    CURRENT    ACTIVE
    EXCEPT    *No page for id page*    type=GLOB    AS   ${error}
        Log    ${error}
    END
    # It possible to switch between context and/or browser by giving the ID
    Switch Page    ${PAGE2}[page_id]    ${CONTEXT1}    ${BROWSER1}
    # Also using magic words "ALL" or "ANY" allows searching between all contexs and browsers
    [Teardown]    Switch Page    ${PAGE5}[page_id]    ANY    ALL

Switch Context Also Changes Page
    Switch Context    ${CONTEXT2}
    Get Title    ==    marketsquare · GitHub
    # By default is not possible to switch between browsers
    TRY
        Switch Context    ${CONTEXT1}
    EXCEPT    *No context for id context=*    type=GLOB    AS   ${error}
        Log    ${error}
    END
    # But Defining browser ID it is possible
    Switch Context    ${CONTEXT1}    ${BROWSER1}
    Get Title    ==    Robot Framework
    # Instead of ID it is possible use magic word "ALL" to search from all browsers
    Switch Context    ${CONTEXT3}    ALL
    Get Title    ==    Robot Framework · GitHub

Switch Browser Also Changes Page And Context
    Switch Browser    ${BROWSER1}
    Get Title    ==    Robot Framework
    Get Browser Catalog

```

and

```robotframework
*** Settings ***
Resource    imports.resource

*** Test Cases ***
Open New Page With Click
    New Page    https://github.com/MarketSquare/robotframework-browser
    Click    a[href="https://robotframework-browser.org/"]    left    1    ${None}    ${None}    ${None}    ${False}    ${False}    Meta
    # NEW magic word changes to next opened page
    Switch Page    NEW
    Wait Until Network Is Idle    timeout=10s
    Get Title    ==    Browser Library
    Get Browser Catalog

```

Run test suites with command:
```bash
robot --outputdir output 1.4.Browser_Context_Page/catalog
```
