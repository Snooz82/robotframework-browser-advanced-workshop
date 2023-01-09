*** Settings ***
Library    Browser


*** Test Cases ***
Test
    New Browser    headless=False
    New Page    http://robocon.io
    ${texts}=    Evaluate JavaScript    a
    ...    (elements) => elements.map(e => e.innerText)
    ...    all_elements=True
    Log Many    ${texts}