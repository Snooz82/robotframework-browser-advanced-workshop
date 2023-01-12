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
        assert len(cookies) > 1, "Too little cookies."
        return {"name": cookies[0]["name"], "value": cookies[0]["value"]}

    @keyword
    def other_plugin_cookie_keyword_with_public_api(self) -> dict:
        """Use Browser public API to create new keyword"""
        cookies = self.library.get_cookies()
        for index, cookie in enumerate(cookies):
            logger.debug(f"cookie {index}: {cookie}")
        assert len(cookies) > 1, "Too little cookies."
        return {"name": cookies[0]["name"], "value": cookies[0]["value"]}
