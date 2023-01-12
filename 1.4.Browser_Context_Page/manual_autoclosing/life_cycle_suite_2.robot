*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Not Open In Different Suite
    TRY
        Get Title    contains    Browser
    EXCEPT    *No page open*    type=GLOB    AS   ${error}
        Log    ${error}
    END

