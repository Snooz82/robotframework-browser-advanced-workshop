*** Settings ***
Library    Browser    plugins=simple    #jsextension=${CURDIR}/simple.js
Suite Setup    New Browser    headless=False



*** Test Cases ***
Test
    New Page
    Add Locator Clicker    id=cookieconsent:body >> "Alle Cookies akzeptieren"
    Go To    https://www.imbus.de
    # Click     id=cookieconsent:body >> "Alle Cookies akzeptieren"
    Click    "Jetzt Ticket sichern!" >> nth=0
    Sleep    2 sec

TestCar
    New Page    http://car.keyword-driven.de
    Type Text      id=input_username    René
    Type Text      id=input_password    Rohner
    ${values}    Get Elements Value    input
    Log To Console    ${values}
    ${logs}    Get Console Log
    Log To Console    ${logs}