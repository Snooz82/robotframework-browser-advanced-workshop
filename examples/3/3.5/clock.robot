*** Settings ***
Library         Browser
Library         DateTime
Library         Dialogs

Test Setup      Clock Setup


*** Test Cases ***
Set Time Continues To Run Clock
    ${time}    Get Current Date    increment=60min
    Set Time    ${time}
    ${hh_mm}    Convert Date    ${time}    result_format=%H:%M
    Get Text    id=clock    contains    ${hh_mm}
    Take Screenshot
    Pause Execution    message=Clock should be set to ${hh_mm} and running
    Take Screenshot

Pause At, Advance And Resume Clock
    ${time}    Get Current Date    increment=90min
    Pause At    ${time}
    Take Screenshot
    ${hh_mm}    Convert Date    ${time}    result_format=%H:%M
    Pause Execution    Clock is paused now at ${hh_mm}
    # Jumps time without firing timers. About same as making computer sleep for 30 minutes.
    Advance Clock    30m    fast_forward
    ${advanced_time}    Add Time To Date    ${time}    30m
    ${hh_mm}    Convert Date    ${advanced_time}    result_format=%H:%M
    Get Text    id=clock    contains    ${hh_mm}
    Take Screenshot
    Pause Execution    message=Clock is advanced to ${hh_mm} while paused
    Resume Clock
    Take Screenshot
    Pause Execution    message=Clock should now be running again


*** Keywords ***
Clock Setup
    VAR    ${file}    file://${CURDIR}/clock.html
    New Browser    chromium    False
    New Page    ${file}
