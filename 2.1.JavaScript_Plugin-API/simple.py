from pathlib import Path
from Browser import Browser
from Browser.base.librarycomponent import LibraryComponent
from robot.api import logger
from robot.api.deco import keyword


class simple(LibraryComponent):
    def __init__(self, library: Browser):
        super().__init__(library)
        self.initialize_js_extension(Path(__file__).parent.resolve() / "simple.js")

    @keyword
    def get_elements_value(self, selector: str) -> list[str]:
        """Get elements value."""
        selector = self.resolve_selector(selector)
        values = self.call_js_keyword("getElementsValue", selector=selector)
        logger.info(f"Values: {values}")
        return values