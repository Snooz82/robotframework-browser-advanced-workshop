*** Settings ***
Resource    imports.resource


*** Test Cases ***
Open New Page With Click
    New Page    https://github.com/MarketSquare/robotframework-browser
    Click
    ...    a[href="https://robotframework-browser.org/"]
    ...    left
    ...    1
    ...    ${None}
    ...    ${None}
    ...    ${None}
    ...    ${False}
    ...    ${False}
    ...    Meta
    # NEW magic word changes to next opened page
    Switch Page    NEW
    Wait Until Network Is Idle    timeout=10s
    Get Title    ==    Browser Library
    Get Browser Catalog
