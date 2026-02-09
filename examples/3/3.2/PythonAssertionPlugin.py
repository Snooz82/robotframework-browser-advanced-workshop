import json

from assertionengine.assertion_engine import AssertionOperator, verify_assertion
from Browser.base.librarycomponent import LibraryComponent  # type: ignore
from robot.api import logger  # type: ignore
from robot.api.deco import keyword  # type: ignore
from robot.utils import DotDict  # type: ignore


class PythonAssertionPlugin(LibraryComponent):
    @keyword
    def get_location_object(self) -> DotDict:
        """Returns the location object of the current page.

        Example:
        | {
        |   'ancestorOrigins': {},
        |   'href': 'https://robotframework.org/code/',
        |   'origin': 'https://robotframework.org',
        |   'protocol': 'https:',
        |   'host': 'robotframework.org',
        |   'hostname': 'robotframework.org',
        |   'port': '',
        |   'pathname': '/code/',
        |   'search': '',
        |   'hash': ''
        | }

        This keyword calles the python keyword `Evaluate Javascript` to get the location object."""
        location_dict = self.library.evaluate_javascript(None, "window.location")
        logger.info(f"Location object:\n {json.dumps(location_dict, indent=2)}")
        return DotDict(location_dict)

    @keyword
    def get_hostname(
        self,
        assertion_operator: AssertionOperator | None = None,
        assertion_expected=None,
    ) -> str:
        """Returns the hostname from URL

        | =Arguments= | =Description= |
        | ``assertion_operator`` | See `Assertions` for further details. Defaults to None. |
        | ``assertion_expected`` | Expected value for the state |
        | ``message`` | overrides the default error message for assertion. |

        Optionally asserts that hostname matches the specified assertion. See `Assertions`
        for further details for the assertion arguments. By default assertion is not done.
        """
        hostname = self.library.evaluate_javascript(None, "window.location.hostname")
        logger.info(f"Hostname: {hostname}")
        return verify_assertion(hostname, assertion_operator, assertion_expected)  # type: ignore

    @keyword
    def get_protocol(
        self,
        assertion_operator: AssertionOperator | None = None,
        assertion_expected: str | None = None,
        message: str | None = None,
    ) -> str:
        """Returns the protocol from URL

        | =Arguments= | =Description= |
        | ``assertion_operator`` | See `Assertions` for further details. Defaults to None. |
        | ``assertion_expected`` | Expected value for the state |
        | ``message`` | overrides the default error message for assertion. |

        Optionally asserts that protocol matches the specified assertion. See `Assertions`
        for further details for the assertion arguments. By default assertion is not done.
        """
        protocol = self.library.evaluate_javascript(None, "window.location.protocol")
        logger.info(f"Protocol: {protocol}")
        return verify_assertion(protocol, assertion_operator, assertion_expected, message or "")  # type: ignore
