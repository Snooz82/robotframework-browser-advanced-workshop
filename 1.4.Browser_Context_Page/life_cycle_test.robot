*** Settings ***
Library     Browser


*** Test Cases ***
Open Context And Page With Default Autoclosing Level
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
    Get Title    contains    Browser

No Context Or Pages Open
    TRY
        Get Title    contains    Browser
    EXCEPT    *No page open*    type=GLOB    AS    ${error}
        Log    ${error}
    END
