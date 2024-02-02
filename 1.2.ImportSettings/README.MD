[<- Back](/README.md)

# 1.2 Importing Settings 										(*Rene*)

- auto_closing_level: AutoClosingLevel = AutoClosingLevel.TEST,
- enable_playwright_debug: bool = False,
- enable_presenter_mode: Union[HighLightElement, bool] = False,
- external_browser_executable: Optional[Dict[SupportedBrowsers, str]] = None,
- jsextension: Optional[str] = None,
- playwright_process_port: Optional[int] = None,
- plugins: Union[List[str], str, None] = None,
- retry_assertions_for: timedelta = timedelta(seconds=1),
- run_on_failure: str = "Take Screenshot  fail-screenshot-{index}",
- selector_prefix: Optional[str] = None,
- show_keyword_call_banner: Optional[bool] = None,
- strict: bool = True,
- timeout: timedelta = timedelta(seconds=10),
