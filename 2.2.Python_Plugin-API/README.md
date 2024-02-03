[<- Back](/README.md)

# 2.2 Python Plugin API
Python plugin API allows extending Browser library directly, by adding new keywords or replacing existing
keywords. Plugin API is provided by [PythonLibCore](https://github.com/robotframework/PythonLibCore)
and is similar which is found from [SeleniumLibrary](https://github.com/robotframework/SeleniumLibrary)

Python plugin API differs from
[JavaScript Plugin](https://marketsquare.github.io/robotframework-browser/Browser.html#Extending%20Browser%20library%20with%20a%20JavaScript%20module).
Main difference is that JavaScript plugin allows only write code in NodeJS side. Python plugin API
allows use both Python and JavaScript when creating keywords. Example with Python Plugin API it is possible
use [AssertionEngine](https://github.com/MarketSquare/AssertionEngine).

## 2.2.1 Python only plugin
The simplest way to use Python plugin API is to create new keywords only in Python side. Example when there is this
Python class:
```python
import json

from robot.api import logger
from robot.api.deco import keyword

from Browser.base.librarycomponent import LibraryComponent
from Browser.generated.playwright_pb2 import Request


class SimplePythonPlugin(LibraryComponent):

    @keyword
    def new_plugin_cookie_keyword_with_grpc(self) -> dict:
        """Uses grpc to directly call node side function."""
        with self.playwright.grpc_channel() as stub:
            response = stub.GetCookies(Request().Empty())
            cookies = json.loads(response.json)
        logger.debug(json.dumps(cookies, indent=4))
        assert len(cookies) == 1, "Too many cookies."
        return {"name": cookies[0]["name"], "value": cookies[0]["value"]}

    @keyword
    def other_plugin_cookie_keyword_with_public_api(self) -> dict:
        """Use Browser public API to create new keyword"""
        cookies = self.library.get_cookies()
        logger.debug(json.dumps(cookies, indent=4))
        assert len(cookies) == 1, "Too many cookies."
        return {"name": cookies[0]["name"], "value": cookies[0]["value"]}

```

and this test:

```robotframework
*** Settings ***
Library             Browser
...                     enable_playwright_debug=${True}
...                     plugins=${CURDIR}/SimplePythonPlugin.py
...                     auto_closing_level=SUITE

*** Test Cases ***
Simple Plugin Example With GRPC
    [Setup]    New Page    https://github.com/MarketSquare/robotframework-browser
    ${URL} =    Get Url
    Set Suite Variable    ${URL}
    Add Cookie
    ...    Foo22
    ...    Bar22
    ...    url=${URL}
    ...    expires=3 155 760 000,195223
    ${cookies} =    New Plugin Cookie Keyword With Grpc
    Should Be Equal    ${cookies}[name]    Foo22
    Should Be Equal    ${cookies}[value]    Bar22

Simple Plugin Example With Public API
    Add Cookie
    ...    Foo22
    ...    Bar22
    ...    url=${URL}
    ...    expires=3 155 760 000,195223
    ${cookies} =    Other Plugin Cookie Keyword With Public Api
    Should Be Equal    ${cookies}[name]    Foo22
    Should Be Equal    ${cookies}[value]    Bar22

```
And run the test with command:
```bash
robot --outputdir output --loglevel debug 2.2.Python_Plugin-API/simple/
```

Then look `log.html` file from the `output` folder.
It is possible to use multiple plugins same time, but
it is user responsibility make sure that they do not
collide.

## 2.2.2 Resolving Selectors / Presenter Mode

Selector prefix is something that has to be handled by the keywords itself.
First step should be to resolve the selector:

```python
    @keyword
    def disable_element(self, selector):
        """Disables an element."""
        selector = self.resolve_selector(selector)   # prefixes the selector with the set prefix
        self.library.evaluate_javascript(selector=selector, "e => e.disabled = true")
```

Presenter mode works similar and resolves as well:

```python
    @keyword
    def blur(self, selector):
        """Calls blur on the element."""
        selector = self.presenter_mode(selector, self.strict_mode)   #highlights the element and waits
        self.call_js_keyword("blur", selector=selector)
```

## 2.2.3 Python plugin with NodeJS implementation
###  Load JS plugin

```python
class PythonPlugin(LibraryComponent):
    def __init__(self, library: Browser):
        super().__init__(library)
        self.initialize_js_extension(Path(__file__).parent.resolve() / "JSPlugin.js")
```

### Use it with `self.call_js_keyword`

```python
    @keyword
    def mouse_wheel(self, x: int, y: int):
        """This keyword calls a custom javascript keyword from the file JSPlugin.js."""
        return self.call_js_keyword("mouseWheel", x=x, y=y)
```
All arguments must be named and arguments must be JSON serializable.
