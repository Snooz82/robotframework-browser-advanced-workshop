# robotframework-browser-advanced-workshop
Repository with Training material


# Introduction
	
- Introduce Tatu and Rene
- Go over the participants and ask them to introduce them.
 
# Browser Fundamentals

## Installation and binary structure						(*Tatu*)

### rfbowser init

### where is log from installation

### hwo to manage browser binaries in CI

## Importing Settings 										(*Rene*)

- auto_closing_level: AutoClosingLevel = AutoClosingLevel.TEST,
- enable_playwright_debug: bool = False,
- enable_presenter_mode: Union[HighLightElement, bool] = False,
- external_browser_executable: Optional[Dict[SupportedBrowsers, str]] = None,
- jsextension: Optional[str] = None,
- playwright_process_port: Optional[int] = None,
- retry_assertions_for: timedelta = timedelta(seconds=1),
- run_on_failure: str = "Take Screenshot  fail-screenshot-{index}",
- selector_prefix: Optional[str] = None,
- show_keyword_call_banner: Optional[bool] = None,
- strict: bool = True,
- timeout: timedelta = timedelta(seconds=10),
- plugins: Optional[str] = None,

## Logging (playwright Logs, Robot Loglevel, PW Trace)		(*Tatu*)

- enable_playwright_debug
- log.html
- Playwright trace.

## Browser, Context, Page (Catalog, Switching) 			(*Tatu*)

### Life cycle of 3 pillars

### Catalog, Switching

- Catalog
- New, Switch, Close
- ALL/ANY & CURRENT/ACTIVE

## Basic JS 									(*Rene*)

### Fundamentals

- JS Environments: Browser vs NodeJS
  - Playwright == NodeJS
  - `document` & `window` == Chrome
- Variable definition
  - `let`: scoped to block 
  - `var`: scoped to function
  - `const`: not reassignable
- Strings
  - `"str"` & `'str'`
  - ``` `test${var}` ```
- Equality 
  - `"32" == 32` > `true`
  - `"32" === 32` > `false`
- Async
  - `async function`
  - promises
  - `await funCall`
  - `.then`
- function vs Lambda/Arrow-functions
  - `function add(a, b) { return a + b; }`
  - `const add = (a, b) => {a + b}`
- Objects, JSON, Dictionaries

- Browser Dev Tools Console

- Evaluate Javascript


# Extending Browser

## JavaScript Plugin-API												(*Tatu & Rene*)
	 Explain how it works
	 Make an exercise

## Python Plugin-API 										(*Tatu*)
	Comes from PLC
	Python class, inherit LibraryComponent use @keyword decorator
	Explain how to call existing stuff from Node side
	Make an exercise

## AssertionEngine											(*Tatu*)
	Separate python package, usefull also for other libraries
	Automatic retry
	Inline assertions with one keywords
	Make an exercise  

## Assertion Formatters 									(*Tatu*)
	Allows formatting return value from node side
	Make an exercise

# Browser Advanced Keywords

## Waiting (playwright, Assertion, keywords, timeout) 		(*Tatu*)
	Not sure where this should go? 

## Promise To 												(*Rene*)
	?

## Get Element States 										(*Rene*)
	?
	Make an exercise

## Upload File (Selector or Dialog) 						(*Rene*)
	?

## Selectors (CSS, nth, playwright possibilities) 			(*Rene*)
	Make an exercise
