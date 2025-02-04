*** Settings ***
Library     Browser


*** Test Cases ***
Automatic Opening Of Browser And Context
    New Page    https://marketsquare.github.io/robotframework-browser

Is Same As
    New Browser
    New Context
    New Page    https://marketsquare.github.io/robotframework-browser
