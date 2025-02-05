*** Settings ***
Library         Browser
Resource        ../../variables.resource

Suite Setup     Examples Setup


*** Test Cases ***
Example 1
    ${text}    Get Text    [name="name"]
    Should Be Equal    ${text}    Prefilled Name

Example 2
    Get Text    [name="name"]    ==    Prefilled Name

Example 3
    Get Text    [name="name"]    contains    Name

Example 4
    Get Text    [name="name"]    contains    Not Here


*** Keywords ***
Examples Setup
    New Browser    headless=False
    New Page    ${FORM_URL}
