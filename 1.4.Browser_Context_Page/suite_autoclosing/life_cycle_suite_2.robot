*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Closed At End Of Test Execution
    Get Title    contains    Browser
