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

## Catalog, Switching

- Catalog
- New, Switch, Close
- ALL/ANY & CURRENT/ACTIVE