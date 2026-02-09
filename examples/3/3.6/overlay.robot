*** Settings ***
Library         Browser
Library         Dialogs

Test Setup      Overlay Setup


*** Test Cases ***
Overlay Blocks Input
    Type Text    id=textInput    Hello World
    Pause Execution    message=No overlay
    Click    id=openOverlay
    Pause Execution    message=There is overlay
    Type Text    id=textInput    What is your name?

Handle Overlay With Click
    Click    id=openOverlay
    Pause Execution    message=There is overlay
    Click    id=overlayCloseBtn
    Type Text    id=textInput    42
    Pause Execution    message=Overlay should be closed now

Handle Overlay Automatically
    Add Locator Handler Click    id=overlayTitle    click_selector=id=overlayCloseBtn    times=2
    FOR    ${index}    IN RANGE    ${5}
        Click    id=openOverlay
        Pause Execution    message=There is overlay
        Type Text    id=textInput    42${index}
        Pause Execution    message=Overlay should be closed now
    END


*** Keywords ***
Overlay Setup
    VAR    ${file}    file://${CURDIR}/overlay.html
    New Browser    chromium    False
    New Page    ${file}
    Set Browser Timeout    5s
