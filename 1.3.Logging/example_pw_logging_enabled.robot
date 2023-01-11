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
