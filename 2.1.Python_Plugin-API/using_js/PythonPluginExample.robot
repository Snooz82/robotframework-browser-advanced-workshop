*** Settings ***
Resource            ../../variables.resource
Library             Browser
...                     enable_playwright_debug=${True}
...                     enable_presenter_mode=${True}
...                     plugins=${CURDIR}/PythonPlugin.py

Suite Setup         New Browser    headless=False
Test Teardown       Close Context    ALL


*** Test Cases ***
Test Js Plugin Called From Python Plugin
    [Setup]    New Page    ${TABLES_URL}
    My Mouse Wheel    0    100
    Get Scroll Position    ${None}    top    ==    100
    My Mouse Wheel    50    100
    Get Scroll Position    ${None}    top    ==    200
    Get Scroll Position    ${None}    left    ==    50
    My Mouse Wheel    -20    -150
    Get Scroll Position    ${None}    top    ==    50
    Get Scroll Position    ${None}    left    ==    30

Pluging Keyword Example Location
    [Setup]    New Page    http://robotframework.org/code/
    ${location} =    Get Location Object
    ${url} =    Get Url
    Should Be Equal    ${location.hostname}    robotframework.org
    Should Be Equal    ${location.pathname}    /code/
    Should Be Equal    ${location.protocol}    https:
    Should Be Equal    ${location.href}    https://robotframework.org/code/

Blur
    New Page    http://car.keyword-driven.de
    Focus    id=input_username
    Get Element States    id=input_username    *=    focused
    Blur    id=input_username
    Get Element States    id=input_username    *=    defocused
    Focus    id=input_password
    Get Element States    id=input_password    *=    focused
    Blur    id=input_password
    Get Element States    id=input_password    *=    defocused

Enable/disable
    New Page    http://car.keyword-driven.de
    Disable Element    id=input_username
    Get Element States    id=input_username    *=    disabled
    Enable Element    id=input_username
    Get Element States    id=input_username    *=    enabled
