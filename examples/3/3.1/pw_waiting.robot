*** Settings ***
Library         Browser
Resource        ../../variables.resource

Suite Setup     New Browser    headless=False


*** Test Cases ***
PW Waiting
    New Page    ${WAIT_URL}
    Select Options By    \#dropdown    value    attached
    Click    \#submit
    Click    \#victim
