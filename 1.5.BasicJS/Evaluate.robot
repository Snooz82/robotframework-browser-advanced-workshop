*** Settings ***
Library    Browser
Library    Collections

Suite Setup    New Page    http://robocon.io


*** Test Cases ***
Test with Robot
    ${elements}=    Get Elements    a
    ${texts}=    Create List
    FOR    ${element}    IN    @{elements}
        ${text}    Get Text    ${element}
        IF    $text
            Append To List    ${texts}    ${text}
        END
    END
    Log Many    @{texts}
    Length Should Be    ${texts}    19

Test with for loop
    ${texts}=    Evaluate JavaScript    a
    ...    elements => {
    ...        let text = []
    ...            for (e of elements) {
    ...                if (e.innerText) {
    ...                    text.push(e.innerText)
    ...                }
    ...            }
    ...        return text
    ...    }
    ...    all_elements=True
    Log Many    @{texts}
    Length Should Be    ${texts}    19


Test with array function
    ${texts}=    Evaluate JavaScript    a
    ...    elements => elements.map(e => e.innerText).filter(text => text)
    ...    all_elements=True
    Log Many    @{texts}
    Length Should Be    ${texts}    19

Test as Objects
    ${texts}=    Evaluate JavaScript    a
    ...    elements => {
    ...        const object = {}
    ...        elements.filter(e => e.innerText).forEach(e => object[e.innerText] = e.href)
    ...        return object
    ...    }
    ...    all_elements=True
    Log Many     &{texts}
    Log          ${{json.dumps($texts, indent=2)}}
    Length Should Be    ${texts}    19
