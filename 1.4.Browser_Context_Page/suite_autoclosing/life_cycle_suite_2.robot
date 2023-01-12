*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Closed At End Of Test Execution
    TRY
        Get Title    contains    Browser
    EXCEPT    *No page open*    type=GLOB    AS   ${error}
        Log    ${error}
    END