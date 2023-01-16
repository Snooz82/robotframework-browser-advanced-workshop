import json
from pathlib import Path

from Browser import Browser
from Browser.base.librarycomponent import LibraryComponent
from robot.api import logger
from robot.api.deco import keyword
from robot.utils import DotDict


class PythonPlugin(LibraryComponent):
    def __init__(self, library: Browser):
        super().__init__(library)
        self.initialize_js_extension(Path(__file__).parent.resolve() / "JSPlugin.js")

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
        return self.call_js_keyword("mouseWheel", x=x, y=y)

    @keyword
    def blur(self, selector):
        """Calls blur on the element."""
        selector = self.presenter_mode(selector, self.strict_mode)
        self.call_js_keyword("blur", selector=selector)

    @keyword
    def disable_element(self, selector):
        """Disables an element."""
        selector = self.resolve_selector(selector)
        # self.call_js_keyword("disableElement", selector=selector, disable=True, page=None)
        self.library.evaluate_javascript(selector, "e => e.disabled = true")

    @keyword
    def enable_element(self, selector):
        """Enables an element."""
        selector = self.resolve_selector(selector)
        self.call_js_keyword(
            "disableElement", selector=selector, disable=False, page=None
        )
