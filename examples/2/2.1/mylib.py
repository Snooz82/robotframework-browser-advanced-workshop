from Browser.base.librarycomponent import LibraryComponent  # type: ignore
from robot.api.deco import keyword  # type: ignore


class MyLib(LibraryComponent):
    @keyword
    def get_attributes_comma_sep(self, selector: str):
        """Get attributes comma separated."""
        attributes = self.library.evaluate_javascript(
            selector, "(element) => element.getAttributeNames()"
        )
        return ",".join(attributes)
