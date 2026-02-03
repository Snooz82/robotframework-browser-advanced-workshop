from pathlib import Path

from Browser import Browser  # type: ignore
from Browser.base.librarycomponent import LibraryComponent  # type: ignore
from robot.api import logger  # type: ignore
from robot.api.deco import keyword


class simple(LibraryComponent):
    def __init__(self, library: Browser):
        super().__init__(library)
        self.initialize_js_extension(Path(__file__).parent.resolve() / "simple.js")

    @keyword
    def get_elements_value(self, selector: str) -> list[str]:
        """Get elements value."""
        selector = self.resolve_selector(selector)
        values = list(self.call_js_keyword("getElementsValue", selector=selector))
        logger.info(f"Values: {values}")
        return values

    @keyword
    def start_tracing(self):
        """Start tracing."""
        self.call_js_keyword("startTracing")

    @keyword
    def stop_tracing(self, path: Path):
        """Stop tracing."""
        return self.call_js_keyword("stopTracing", tracefile=str(path.resolve().absolute()))
