*** Settings ***
Resource    imports.resource

*** Test Cases ***
Open Context And Page With SUITE Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

Context And Page Are Open
    Get Title    contains    Browser
