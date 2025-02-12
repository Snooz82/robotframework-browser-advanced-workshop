from assertionengine.assertion_engine import AssertionOperator  # type: ignore
from Browser import Browser, ElementState, SupportedBrowsers  # type: ignore
from robot.api.deco import keyword, library  # type: ignore
from robot.libraries.BuiltIn import BuiltIn  # type: ignore

VERSION = "0.0.1"


@library
class CarConfigLibrary:
    ROBOT_LIBRARY_SCOPE = "GLOBAL"
    ROBOT_LIBRARY_VERSION = VERSION

    def __init__(self, headless: bool = False):
        self._browser_instance: Browser | None = None

    @property
    def b(self) -> Browser:
        if self._browser_instance is None:
            try:
                self._browser_instance = BuiltIn().get_library_instance("Browser")
            except RuntimeError as err:
                raise ImportError("You have to import the library 'Browser' as well.") from err
        return self._browser_instance

    @keyword
    def open_car_config(self):
        catalog = self.b.get_browser_catalog()
        if not catalog:
            browser_id = self.b.new_browser(browser=SupportedBrowsers.chromium, headless=False)
        else:
            browser_id = next(
                browser.get("id") for browser in catalog if browser.get("activeBrowser")
            )
        context_id = self.b.new_context(recordVideo={"dir": ""}, tracing="trace.zip")
        page_details = self.b.new_page("http://car.keyword-driven.de")
        return browser_id, context_id, page_details

    @keyword
    def login_user(self, user: str, password: str):
        self.b.type_text("#input_username", user)
        self.b.type_text("#input_password", password)
        self.b.click("#button_login")

    @keyword
    def logout_user(self):
        if self.b.get_element_states('//a[.="Logout"]', return_names=False) & ElementState.hidden:
            self.b.click('label[for="drop"]')
        self.b.click('//a[.="Logout"]')
        self.b.get_url(AssertionOperator["$="], "login")
