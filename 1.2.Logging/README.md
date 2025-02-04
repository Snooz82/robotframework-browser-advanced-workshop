[<- Back](/README.md)


# 1.2 Logging with Browser library

## 1.2.1 Python logging in log.html
Robot Framework `log.html` file contains mostly logging from Python side of the library. Also some keywords may
log limited amount of events from the NodeJS side usually a status of the keyword. But logging status does not
explain what happen in the node side server and Playwright API calls. If Browser library keyword fails, the
info level logging will show the error in the Playwright API call.

Start the test app in a separate shell with command: `node test_app/server/server.js`
Then navigate with your favorite browser to `http://localhost:7272/prefilled_email_form.html`
and see that page opens successfully.

As a first task, write an test that opens a page to `http://localhost:7272/prefilled_email_form.html`
and tries to click something that does not exist. Run the test with default setting of robot command.

When running this example:
```robotframework
*** Settings ***
Library     Browser     timeout=2s
Suite Setup             New Browser   headless=False

*** Test Cases ***
Example Logging On Error
    New Page    http://localhost:7272/prefilled_email_form.html
    Click    id=foobar

```
with command:
```bash
robot --outputdir output 1.2.Logging/example_logging_on_error.robot
```

But when using debug level:
```bash
robot --loglevel debug --outputdir output 1.2.Logging/example_logging_on_error.robot
```

contains more detailed error message from the NodeJs server side.

## 1.2.2 Node side logging
`${OUTPUT_DIR}/playwright-log.txt` is always created, by default it contains logging from NodeJS side from
Browser library server. Setting loglevel in the Robot Framework side does not affect logging created in the
`playwright-log.txt` file. More details can gathered by enabling Playwright logging, this is done in library import,
with  setting: `enable_playwright_debug=True`. Please note that enabling Playwright logging will log everything
as plain text, including secrets.

From the previous example open the `${OUTPUT_DIR}/playwright-log.txt` and look at it.

Edit the previous test and enable Playwright debug logs with `enable_playwright_debug`
argument. Also enhance test to not fail and do more actions in the page.
Then execute the test, open `${OUTPUT_DIR}/playwright-log.txt` and look at it.
Please remember that each test execution will overwrite the `playwright-log.txt` file.

```robotframework
*** Settings ***
Library     Browser    enable_playwright_debug=True     timeout=2s
Suite Setup             New Browser   headless=False

*** Variables ***
${secret}    this is secret in log.html but not in other logging

*** Test Cases ***
Playwrifght debug logs
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=comment]    this is not secret
    Type Secret    [name=comment]    $secret

```

with command:
```bash
robot --outputdir output 1.2.Logging/example_pw_logging_enabled.robot
```

## 1.2.3 Playwright trace

Playwright provides [trace](https://playwright.dev/docs/trace-viewer-intro) possibility. Tracing can be enabled
with `New Context    tracing=filename.zip` keyword. When
[pages](https://marketsquare.github.io/robotframework-browser/Browser.html#New%20Page) are opened under the same
context, then each Playwright API call in the page is recorded to the trace file. Enhance the previous test and
make it open second page. On the second page add more actions. At the start of the test, use New Context keyword
and use tracing to create trace file.

When this is an example:
```robotframework
*** Settings ***
Library     Browser    enable_playwright_debug=True     timeout=2s
Suite Setup             New Browser   headless=False

*** Variables ***
${secret}    this is secret in log.html but not in other logging

*** Test Cases ***
Playwrifght debug logs
    New Context    tracing=${{$LOGLEVEL == 'TRACE'}}
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=comment]    this is not secret
    Type Secret    [name=comment]    $secret
    Take Screenshot
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=email]    This first text
    Type Text    [name=email]    This second text
    Take Screenshot

```

Is run with command:
```bash
robot --outputdir output 1.2.Logging/example_pw_trace.robot
```

Then `trace.zip` file from the output directory can be opened in two ways.
1) Playwright provides online service: https://trace.playwright.dev/
2) Open trace file locally with command:
````bash
rfbrowser show-trace output/trace.zip
````
Investigate different tabs and features on the trace file.


## 1.2.4 Coverage

Browser library provides code coverage feature. Data for coverage is
collected by [Playwright](https://playwright.dev/docs/api/class-coverage).
The report is created by
[monocart-coverage-reports](https://www.npmjs.com/package/monocart-coverage-reports)
Coverage must be enabled for each page separately.

Write a new test to collect coverage from google.com by
Start Coverage and Stop Coverage keyword.


```robotframework
*** Settings ***
Library     Browser    enable_playwright_debug=True

*** Test Cases ***
Playwrifght debug logs
    New Page    https://www.google.com/
    Start Coverage
    Take Screenshot
    Stop Coverage


```

Run test with command:
```bash
robot --outputdir output 1.2.Logging/example_coverage.robot
```

Open the log.html file and see Stop Coverage keywords. Where is the
coverage report.
