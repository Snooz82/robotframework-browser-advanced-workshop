*** Settings ***
Library     Browser    enable_playwright_debug=True


*** Test Cases ***
Playwright coverage logs page 1
    New Page    https://www.google.com/
    Start Coverage    raw=True
    Take Screenshot
    Stop Coverage

Playwright coverage logs page 2
    New Page    https://www.google.com/
    Start Coverage    raw=True
    Take Screenshot
    Stop Coverage
