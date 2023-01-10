[<- Back](/README.md)

# 1.3 Logging (playwright Logs, Robot Loglevel, PW Trace)

## 1.3.1 log.html
Robot Framework log.html contains mostly logging from Python side of the library. Also some keywords may
log limited amount of events from the NodeJs side. If Browser library keyword fails, it info level logging
will show the error in Playwright API call. 

When running this example:
```robotframework
*** Setting ***
Library    Browser

*** Test Cases ***
Playwrifght debug logs
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#foobar
```
with command:
```bash
robot --outputdir output 1.3.Logging/example_pw_logging.robot
```
![log.html](log_html_info_error.png)

But when using debug level:
```bash
robot --loglevel debug --outputdir output 1.3.Logging/example_pw_logging.robot
```
![log.html](log_html_debug_error.png)

contains more detailled error message from the NodeJs side.

## 1.3.2 Playwright logs
`${OUTPUT_DIR}/playwright-log.txt` is always created, by default it contains only library side logging from NodeJS side
Playwright logging can be enabled in library import, be setting: `enable_playwright_debug=True`. Please note that
enabling Playwright logging will log everything as plain text, including secrets.

Execute example when Playwright logging is not enabled:
```robotframework
*** Setting ***
Library    Browser

*** Test Cases ***
Playwrifght debug logs
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#code-tab
    Wait Until Network Is Idle    timeout=3s
    Type Text    input[name="q"]    robotframework
    Keyboard Key    press    Enter
    Take Screenshot

```
with command:
```bash
robot --outputdir output 1.3.Logging/example_pw_logging.robot
```
and look the `playwright-log.txt` from the output directory.

Example when Playwright logging is enabled:
```robotframework
*** Setting ***
Library    Browser    enable_playwright_debug=True

*** Test Cases ***
Playwrifght debug logs
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#code-tab
    Wait Until Network Is Idle    timeout=3s
    Type Text    input[name="q"]    robotframework
    Keyboard Key    press    Enter
    Take Screenshot

```
with command:
```bash
robot --outputdir output 1.3.Logging/example_pw_logging.robot
```
and look again the `playwright-log.txt` from the output directory.

## 1.3.3 Playwright trace.