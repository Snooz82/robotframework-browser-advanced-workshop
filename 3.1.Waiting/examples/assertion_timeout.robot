*** Settings ***
Library         Browser
Resource        ../../variables.resource

Suite Setup     New Browser    headless=False


*** Test Cases ***
Default Assertion timeout
    New Page    ${WAIT_URL}
    Click    \#setdelay
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    TRY
        Get Text    \#victim    ==    Not here
    EXCEPT    *    type=GLOB
        No Operation
    END

Change timeout
    New Page    ${WAIT_URL}
    ${old_timeout} =    Set Retry Assertions For    2s
    Click    \#setdelay
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    TRY
        Get Text    \#victim    ==    Not here
    EXCEPT    *    type=GLOB
        No Operation
    END
    [Teardown]    Set Retry Assertions For    ${old_timeout}

Change timeout with Scope
    New Page    ${WAIT_URL}
    Set Retry Assertions For    2s    scope=Test
    Click    \#setdelay
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    TRY
        Get Text    \#victim    ==    Not here
    EXCEPT    *    type=GLOB
        No Operation
    END
