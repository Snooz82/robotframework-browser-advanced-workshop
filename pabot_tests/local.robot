*** Settings ***
Library             Browser    playwright_process_port=${PLAYWRIGHT_PORT}

Test Setup          Open CarConfig
Test Template       Check It


*** Variables ***
${BROWSER}                  chromium
${HEADLESS} =               ${False}
${PLAYWRIGHT_PORT} =        ${None}
@{WS_ENDPOINTS} =           @{EMPTY}
${PABOTEXECUTIONPOOLID}     0


*** Test Cases ***
Test_00    00
Test_01    01
Test_02    02
Test_03    03
Test_04    04
Test_05    05
Test_06    06
Test_07    07
Test_08    08
Test_09    09
Test_10    10
Test_11    11
Test_12    12
Test_13    13
Test_14    14
Test_15    15
Test_16    16
Test_17    17
Test_18    18
Test_19    19
Test_20    20
Test_21    21
Test_22    22
Test_23    23
Test_24    24
Test_25    25
Test_26    26
Test_27    27
Test_28    28
Test_29    29


*** Keywords ***
Open Browser
    IF    $WS_ENDPOINTS
        Connect To Browser    ${{$WS_ENDPOINTS.split(',')}}[${PABOTEXECUTIONPOOLID}]    browser=${BROWSER}
    ELSE
        New Browser    ${BROWSER}    headless=${HEADLESS}
    END

Open CarConfig
    Open Browser
    New Context    tracing=${{$LOG_LEVEL == "TRACE"}}
    New Page    http://localhost:7272/prefilled_email_form.html

Check It
    [Arguments]    ${txt}
    Fill Text    input[name="name"]    ${txt}
    Check Checkbox    input[value="internet"]
