*** Settings ***
Resource    imports.resource

*** Test Cases ***
Context And Page Are Not Open In Different Suite
    Get Title    contains    Browser

