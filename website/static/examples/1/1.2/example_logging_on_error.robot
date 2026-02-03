*** Settings ***
Library         Browser    timeout=2s    enable_playwright_debug=${{$LOG_LEVEL == "TRACE"}}

Suite Setup     New Browser    headless=False


*** Test Cases ***
Playwrifght debug logs
    New Context    tracing=${{$LOG_LEVEL == "TRACE"}}
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#foobar
