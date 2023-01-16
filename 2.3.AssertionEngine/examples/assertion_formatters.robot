*** Settings ***
Library    Browser
Resource   ../../variables.resource

Suite Setup    Examples Setup

*** Test Cases ***
Assertion Formatters
    TRY
        Get Text    [name="name"]    contains    ${SPACE*4}Prefilled Name${SPACE*3}
    EXCEPT    Text 'Prefilled Name' (str) should contain*    type=GLOB
        No Operation
    END
    Set Assertion Formatters    {"Get Text": ["strip", "apply to expected"]}
    Get Text    [name="name"]    contains    ${SPACE*4}Prefilled Name${SPACE*3}

*** Keywords ***
Examples Setup
    New Browser    headless=False
    New Page    ${FORM_URL}