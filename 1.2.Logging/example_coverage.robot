*** Settings ***
Library     Browser    enable_playwright_debug=True

*** Test Cases ***
Playwrifght debug logs
    New Page    https://www.google.com/
    Start Coverage
    Take Screenshot
    Stop Coverage
