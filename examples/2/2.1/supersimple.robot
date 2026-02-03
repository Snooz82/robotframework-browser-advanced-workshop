*** Settings ***
Library         Browser    plugins=${CURDIR}/simple.py

Suite Setup     New Browser    headless=False


*** Test Cases ***
Test
    New Context
    Start Tracing
    New Page    http://car.keyword-driven.de
    Type Text    id=input_username    René
    Type Text    id=input_password    Rohner
    Click    id=button_login
    Get Url    ends    list
    [Teardown]    Stop Tracing    ${CURDIR}/Trace.zip

TestCar
    New Page    http://car.keyword-driven.de
    Type Text    id=input_username    René
    Type Text    id=input_password    Rohner
    ${values}    Get Elements Value    input
    Log To Console    ${values}
    ${logs}    Get Console Log
    Log To Console    ${logs}
