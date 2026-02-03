*** Settings ***
Resource            ../../variables.resource
Library             Browser
...                     plugins=${CURDIR}/PythonAssertionPlugin.py
...                     show_keyword_call_banner=True

Suite Setup         New Browser    headless=False
Test Teardown       Close Context    ALL


*** Test Cases ***
Pluging Keyword Example
    [Setup]    New Page    http://robotframework.org/code/
    ${url} =    Get Url
    ${location} =    Get Location Object
    Log    ${location}
    Log    ${location.protocol}
    Log    ${location.hostname}
    Get Hostname    ==    robotframework.org
    Get Protocol    ==    https:
