*** Settings ***
Library     Browser     timeout=5s
Suite Setup             New Browser   headless=False

*** Test Cases ***
Playwrifght debug logs
    New Page    https://github.com/MarketSquare/robotframework-browser/issues
    Click    \#foobar
