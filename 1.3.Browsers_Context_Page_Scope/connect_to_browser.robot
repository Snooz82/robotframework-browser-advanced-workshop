*** Settings ***
Library     Browser


*** Test Cases ***
Launch Browser Server Generated wsEndpoint
    ${wsEndpoint} =    Launch Browser Server    chromium    headless=False
    ${browser} =    Connect To Browser    ${wsEndpoint}
    New Page    http://localhost:7272/prefilled_email_form.html
    Get Title    ==    prefilled_email_form.html
    [Teardown]    Close Browser Server    ${wsEndpoint}

Connect To wsEndpoint
    [Documentation]    Create wsEndpoint from rfbrowser launch-browser-server
    ...    entry point and connect to it
    VAR    ${wsEndpoint}    ws://localhost:61097/c2a09d1d363fb4ee8d1577c0d3761e32    # This is an example wsEndpoint
    ${browser} =    Connect To Browser    ${wsEndpoint}
    New Page    http://localhost:7272/prefilled_email_form.html
    Get Title    ==    prefilled_email_form.html
