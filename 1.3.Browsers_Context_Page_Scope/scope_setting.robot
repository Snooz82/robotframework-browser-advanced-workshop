*** Settings ***
Library    Browser    timeout=5s
Suite Setup    New Page   http://localhost:7272/prefilled_email_form.html

*** Test Cases ***
Default Scope
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With 5 seconds
    END

Page Scope
    Set Browser Timeout    1s    Test
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With one second
    END

Back to default scope
    TRY
        Click     id=nothere
    EXCEPT
        Log To Console    With 5 seconds
    END
