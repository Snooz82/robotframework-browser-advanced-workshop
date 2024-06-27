from Browser.base.librarycomponent import LibraryComponent
from robot.api.deco import keyword


class mylib(LibraryComponent):


    @keyword
    def get_attributes_comma_sep(self, selector: str):
        """Get attributes comma separated."""
        attributes = self.library.evaluate_javascript(
            selector, "(element) => element.getAttributeNames()"
        )
        return ",".join(attributes)
