*** Settings ***
Resource            ../variables.resource
Library             Browser
...                     enable_playwright_debug=${True}
...                     enable_presenter_mode=False
...                     jsextension=${CURDIR}/js_keywords.js

Suite Setup         New Browser   headless=False
Test Teardown       Close Context    ALL

*** Test Cases ***
JS Plugin Example
    [Setup]    New Page    https://robocon.io
    ${links}    Get Links
    Log Many    &{links}
    Log    ${links}


Test Js Plugin Called From Python Plugin
    [Setup]    New Page    ${TABLES_URL}
    Mouse Wheel    0    100
    Get Scroll Position    ${None}    top    ==    100
    Mouse Wheel    50    100
    Get Scroll Position    ${None}    top    ==    200
    Get Scroll Position    ${None}    left    ==    50
    Mouse Wheel    -20    -150
    Get Scroll Position    ${None}    top    ==    50
    Get Scroll Position    ${None}    left    ==    30
