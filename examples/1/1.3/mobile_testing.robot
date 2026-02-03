*** Settings ***
Library     Browser


*** Test Cases ***
Mobile testing
    &{device}=    Get Device    iPhone 15
    New Context    &{device}
    New Page    https://marketsquare.github.io/robotframework-browser/Browser.html
    Take Screenshot    mobile.png
