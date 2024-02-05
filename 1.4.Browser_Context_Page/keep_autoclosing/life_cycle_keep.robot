*** Settings ***
Resource    imports.resource


*** Test Cases ***
Open Context And Page With KEEP Autoclosing Level
    New Browser    headless=False
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

Context And Page Are Open ForEver
    Get Title    contains    Browser
