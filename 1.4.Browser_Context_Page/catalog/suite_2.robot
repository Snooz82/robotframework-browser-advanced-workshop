*** Settings ***
Resource    imports.resource


*** Test Cases ***
Open Example Pages
    ${BROWSER2} =    New Browser
    ${CONTEXT2} =    New Context
    ${PAGE3} =    New Page    https://github.com/MarketSquare
    ${CONTEXT3} =    New Context
    ${PAGE4} =    New Page    https://robocon.io/
    ${PAGE5} =    New Page    https://github.com/robotframework/
    Get Title    ==    Robot Framework · GitHub
    Set Global Variable    ${PAGE3}
    Set Global Variable    ${PAGE4}
    Set Global Variable    ${PAGE5}
    Set Global Variable    ${CONTEXT2}
    Set Global Variable    ${CONTEXT3}
    Set Global Variable    ${BROWSER2}

Switch Page
    Switch Page    ${PAGE4}[page_id]
    Get Title    ==    RoboCon
    Switch Page    ${PAGE5}[page_id]
    Get Title    ==    Robot Framework · GitHub
    # By default is not possible to switch between context or browsers
    # Magic words "CURRENT" and "ACTIVE" poinst to current context and browser
    TRY
        Switch Page    ${PAGE3}[page_id]    CURRENT    ACTIVE
    EXCEPT    *No page for id page*    type=GLOB    AS    ${error}
        Log    ${error}
    END
    # It possible to switch between context and/or browser by giving the ID
    Switch Page    ${PAGE2}[page_id]    ${CONTEXT1}    ${BROWSER1}
    # Also using magic words "ALL" or "ANY" allows searching between all contexs and browsers
    [Teardown]    Switch Page    ${PAGE5}[page_id]    ANY    ALL

Switch Context Also Changes Page
    Switch Context    ${CONTEXT2}
    Get Title    ==    marketsquare · GitHub
    # By default is not possible to switch between browsers
    TRY
        Switch Context    ${CONTEXT1}
    EXCEPT    *No context for id context=*    type=GLOB    AS    ${error}
        Log    ${error}
    END
    # But Defining browser ID it is possible
    Switch Context    ${CONTEXT1}    ${BROWSER1}
    Get Title    ==    Robot Framework
    # Instead of ID it is possible use magic word "ALL" to search from all browsers
    Switch Context    ${CONTEXT3}    ALL
    Get Title    ==    Robot Framework · GitHub

Switch Browser Also Changes Page And Context
    Switch Browser    ${BROWSER1}
    Get Title    ==    Robot Framework
    Get Browser Catalog
