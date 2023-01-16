*** Settings ***
Library     Browser
Suite Setup             New Browser   headless=False


*** Test Cases ***
Playwrifght debug logs
    New Context    tracing=trace.zip
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#foobar
    Click    \#code-tab
    Wait Until Network Is Idle    timeout=3s
    Type Text    input[name="q"]    robotframework
    Keyboard Key    press    Enter
    Take Screenshot
