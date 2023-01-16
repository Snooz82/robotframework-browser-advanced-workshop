[<- Back](/README.md)

# 2.3 AssertionEngine
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
obot --outputdir output --loglevel debug 2.3.AssertionEngine/examples/
```
