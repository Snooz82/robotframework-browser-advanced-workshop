*** Settings ***
Library    Browser

*** Test Cases ***
Reuse
    New Browser
    New Browser
    ${catalog} =    Get Browser Catalog
    Length Should Be    ${catalog}    1
    New Browser    reuse_existing=False
    ${catalog} =    Get Browser Catalog
    Length Should Be    ${catalog}    2
