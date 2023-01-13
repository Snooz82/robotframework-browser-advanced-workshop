import json
from pathlib import Path

from robot.api import logger
from robot.api.deco import keyword
from robot.utils import DotDict

from assertionengine.assertion_engine import verify_assertion, AssertionOperator

from Browser import Browser
from Browser.base.librarycomponent import LibraryComponent
from Browser.generated.playwright_pb2 import Request


class PythonPlugin(LibraryComponent):
    def __init__(self, library: Browser):
        super().__init__(library)
        self.initialize_js_extension(Path(__file__).parent.resolve() / "JSPlugin.js")

    @keyword
    def new_plugin_cookie_keyword(self) -> dict:
        """Uses grpc to directly call node side function."""
        with self.playwright.grpc_channel() as stub:
            response = stub.GetCookies(Request().Empty())
            cookies = json.loads(response.json)
        assert len(cookies) == 1, "Too many cookies."
        return {"name": cookies[0]["name"], "value": cookies[0]["value"]}

    @keyword
    def get_location_object(self) -> dict:
        """Returns the location object of the current page.

        This keyword calles the python keyword `Evaluate Javascript` to get the location object."""
        location_dict = self.library.evaluate_javascript(None, f"window.location")
        logger.info(f"Location object:\n {json.dumps(location_dict, indent=2)}")
        return DotDict(location_dict)

    @keyword
    def mouse_wheel(self, x: int, y: int):
        """This keyword calls a custom javascript keyword from the file JSPlugin.js."""
        return self.call_js_keyword("mouseWheel", x=x, y=y, logger=None, page=None)

    @keyword
    def blur(self, selector):
        """Calls blur on the element."""
        selector = self.presenter_mode(selector, self.strict_mode)
        self.call_js_keyword("blur", selector=selector, page=None)

    @keyword
    def disable_element(self, selector):
        """Disables an element."""
        selector = self.resolve_selector(selector)
        # self.call_js_keyword("disable_element", selector=selector, disable=True, page=None)
        self.library.evaluate_javascript(selector, "e => e.disabled = true")


    @keyword
    def enable_element(self, selector):
        """Enables an element."""
        selector = self.resolve_selector(selector)
        self.call_js_keyword("disable_element", selector=selector, disable=False, page=None)

