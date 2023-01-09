[<- Back](/README.md)

# 1.5. Basic JavaScript

##  JS Environments: Browser vs NodeJS
  - Playwright == NodeJS
  - `document` & `window` == Chrome

### NodeJS
 
```javascript
const number = 12
let adding = 2

console.log(add(number, adding));

adding = adding + 2

console.log(add(number, adding));

function add(a, b) {
    return a + b
}
```


### Browser

http://car.keyword-driven.de/login

Commands to try out in Dev Tools (F12) -> Console

```javascript
document.location
```

```javascript
document.querySelector('input')
```

```javascript
document.querySelector('input').style.color = "#ff00ff"
```


```javascript
document.querySelector('input').value = 'user'
```

```javascript
const input_elements = Array.from(document.querySelectorAll('input'))
console.log(input_elements[0].outerHTML)
```

## Variable definition
  - `let`: scoped to block 
  - `var`: scoped to function
  - `const`: not re-assignable


## Strings
  - `"str"` & `'str'`
  - ``` `test${var}` ```

## Equality 
  - `"32" == 32` > `true`
  - `"32" === 32` > `false`

## Async
  - `async function`
  - promises
  - `await funCall`
  - `.then`

## function vs Lambda-functions (aka Arrow-functions)

"normal" function:

```js
function add(a, b) {
    console.log("a was:", a);
    console.log("b was:", b);
    const result = a + b;
    console.log(`${a} + ${b} = ${result}`);
    return result;
}
console.log("add(1, 2)", add(1, 2))

const numberZeroToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const odds = numberZeroToTen.filter(isOdd)
console.log("odds", odds)

function isOdd(num) { return num % 2; }  //can be defined after usage
```

Lambda function:

```js
const add = (a, b) => a + b  //must be defined before usage
console.log("add(1, 2)", add(1, 2))


const double = a => a + a // if one-liner, no return needed and no {}-braces
console.log("double(2)", double(2))


const numberZeroToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const odds = numberZeroToTen.filter(num => num % 2)   // super useful for callbacks
console.log("odds", odds)
```

## Objects, JSON, Dictionaries, Arrays

js Objects are similar to Python dictionaries and can be parsed and dumped as string. 

Literal syntax is a bit different: js fields without quotes, python keys (if strings) with quotes.

```javascript
const myObject = { key: "test", key2: [ 1, 2, 3 ], key3: null, key4: { subKey: "test" } };
const jsonString = JSON.stringify(myObject);
console.log(jsonString);
const myParsedObject = JSON.parse(jsonString);
```

### Arrays

Arrays in java have some nice functions to manipulate/process the content.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

Many iterables must however be converted to an Array first.

Example:

```js
const elems = Array.from(document.querySelectorAll('input'));
console.log(elems);

elems.forEach(e => console.log(`#${e.id}`, e.type))

const textElements = elems.filter(e => e.type === "text")
console.log(textElements);

const tests = textElements.map(e => e.value);
console.log(tests);
```

## Evaluate Javascript



```robotframework
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
 ```