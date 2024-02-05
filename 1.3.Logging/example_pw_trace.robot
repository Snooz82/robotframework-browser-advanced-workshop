*** Settings ***
Library     Browser     timeout=5s
Suite Setup             New Browser   headless=False


*** Test Cases ***
Playwrifght debug logs
    New Context    tracing=trace.zip
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#code-tab
    Wait Until Network Is Idle    timeout=3s
    Type Text    .UnstyledTextInput-sc-14ypya-0    robotframework
    Keyboard Key    press    Enter
    Wait Until Network Is Idle    timeout=3s
    Take Screenshot
