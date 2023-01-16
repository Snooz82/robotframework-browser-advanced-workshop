[<- Back](/README.md)

# 2.3.1 AssertionEngine
AssertionEngine provides three different features. 
1) Allows inline assertions with `Get...` keywords. Instead of doing this: 
```robotframework
*** Test Cases ***
Example 1
    ${text}    Get Text    [name="name"]
    Should Be Equal    ${text}    Prefilled Name
```
One can do this: 
```
*** Test Cases ***
Example 2
    Get Text    [name="name"]    ==    Prefilled Name
```

2) Allows usage different operators, like `equals`, `contains` and `matches`
```robotframework
Example 3
    Get Text    [name="name"]    contains    Name

```

3) Performs automatic retry if received value does not match what was expected
If element is found, but it did not contain the expected value keyword will perform
automatic retry and will search the element again. 

Example this will fail:
```robotframework
Example 4
    Get Text    [name="name"]    contains    Not Here

```
But by opening the log.html file, on can see from logging that
keyword did perform multiple retries.

Run example with command: 
```bash
robot --outputdir output --loglevel debug 2.3.AssertionEngine/examples/example.robot
```

# 2.3.2 AssertionEngine formatters
Assertion formatters allows to perform simple operations, `normalize spaces`, `strip` and `apply to expected`
operations to the returned value. If `apply to expected` is defined, then formatter is also applied
to the expected value. Multiple formatters can be applied in same time.

```robotframework
Assertion Formatters
    TRY
        Get Text    [name="name"]    contains    ${SPACE*4}Prefilled Name${SPACE*3}
    EXCEPT    Text 'Prefilled Name' (str) should contain*    type=GLOB
        No Operation
    END
    Set Assertion Formatters    {"Get Text": ["strip", "apply to expected"]}
    Get Text    [name="name"]    contains    ${SPACE*4}Prefilled Name${SPACE*3}

```

Run example with command: 
```bash
robot --outputdir output --loglevel debug 2.3.AssertionEngine/examples/assertion_formatters.robot
```
