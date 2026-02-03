# 3.4 Localization
Browser library support localization for your own language if there is a need.

Localization is done by Browser,
[PythonLibcore](https://github.com/robotframework/PythonLibCore) (PLC)
and translation project
[robotframework-browser-translation][https://github.com/MarketSquare/robotframework-browser-translation]

Translation project is responsible to maintain translation json files and
using the API defined by Browser library. If library is imported by `language`
argument and match is found from translation project, then the json file
is given to the PLC. PLC will search translated keyword names and documentation
from json file and will give translated objects to Robot Framework

```robotframework
*** Settings ***
Library     Browser    language=FI

*** Test Cases ***
Translation Works With Translation
    Uusi Sivu    https://github.com/MarketSquare/
```

If you want to create translation for Browser library at your
preferred language, make a PR to the Browser library translation
project.

`rfbrowser translation` command line can create initial json file
structure for you. Also command line can check has the new version of
Browser library caused updates for you translation json file.
