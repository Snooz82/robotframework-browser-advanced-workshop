*** Settings ***
Resource    imports.resource


*** Test Cases ***
Get Browser Catalog Logs All Open Browser Contexrs And Pages
    ${BROWSER1} =    New Browser
    ${CONTEXT1} =    New Context
    ${PAGE1} =    New Page    https://marketsquare.github.io/robotframework-browser
    ${PAGE2} =    New Page    https://robotframework.org
    Get Browser Catalog
    Set Global Variable    ${PAGE1}
    Set Global Variable    ${PAGE2}
    Set Global Variable    ${CONTEXT1}
    Set Global Variable    ${BROWSER1}
