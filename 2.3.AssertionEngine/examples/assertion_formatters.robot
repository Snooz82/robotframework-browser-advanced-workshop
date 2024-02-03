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
    ${old_scope} =    Set Assertion Formatters    {"Get Text": ["strip", "apply to expected"]}
    Get Text    [name="name"]    contains    ${SPACE*4}Prefilled Name${SPACE*3}
    Log    ${old_scope}

Test Scope
    ${old_scope} =    Set Assertion Formatters    {"Get Text": ["strip", "apply to expected"]}    Test
    Log    ${old_scope}

No Scope
    ${old_scope} =    Set Assertion Formatters    {"Get Title": ["strip", ]}    Test
    Log    ${old_scope}

*** Keywords ***
Examples Setup
    New Browser    headless=False
    New Page    ${FORM_URL}