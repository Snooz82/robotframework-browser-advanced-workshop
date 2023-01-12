[<- Back](/README.md)

# 1.4 Browser, Context, Page
Browser/Context/Page are the three pillars of Playwright and how it controls the browser binaries and how the
pages are opened. 

## 1.4.1 Browser
Browser defines which browser engine is used (chromium, firefox and webkit) and few other environment related options,
like timeout or location of an external browser binary. Browser is the highest level in the hierarchy and there can be
many browser open at the same time.

## 1.4.3 Context
Context defines how the browser engine is opened, one can see as a definition how the browser profile is created. 
Example context defines is the offline mode enabled or what geolocation is set for the context, or allows modification
of browser headers. Also controls few debugging options, like trace or video creation.

Each contex is opened under the specific browser and one browser can have multiple context open at the same time.

## 1.3.4 Page
Page is like a tab in the browser, it renders the opened URL. Page is always open under a specific context. 

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

## 1.3.5 Life cycle of three pillars
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

Also closing browsers, contexts and pages happens automatically. Automatic closing is controlled with library import:
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

## 1.3.6 Catalog and Switching
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
