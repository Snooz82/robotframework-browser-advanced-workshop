*** Settings ***
Library     Browser    plugins=${CURDIR}/SimplePythonPlugin.py,${CURDIR}/MyLib.py


*** Test Cases ***
Simple Plugin Example With GRPC
    [Setup]    New Page    https://github.com/MarketSquare/robotframework-browser
    ${URL} =    Get Url
    Set Suite Variable    ${URL}
    Add Cookie
    ...    Foo22
    ...    Bar22
    ...    url=${URL}
    ...    expires=3 155 760 000,195223
    ${cookies} =    New Plugin Cookie Keyword With Grpc
    Should Be Equal    ${cookies}[name]    Foo22
    Should Be Equal    ${cookies}[value]    Bar22
    ${t} =    Get Title
    Log To Console    ${t}

Simple Plugin Example With Public API
    Add Cookie
    ...    Foo22
    ...    Bar22
    ...    url=${URL}
    ...    expires=3 155 760 000,195223
    ${cookies} =    Other Plugin Cookie Keyword With Public Api
    Should Be Equal    ${cookies}[name]    Foo22
    Should Be Equal    ${cookies}[value]    Bar22

Test
    [Setup]    New Page    http://car.keyword-driven.de
    ${attr} =    Get Attributes Comma Sep    id=input_username
    Log To Console    ${attr}
