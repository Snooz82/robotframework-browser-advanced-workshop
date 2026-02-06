# 3.5 Clock
Clock [keywords](https://marketsquare.github.io/robotframework-browser/Browser.html?tag=Clock)
allows accurate simulating time-dependent behavior, example user closes laptop lid, but
does not logout from the web application. Keywords are based on Playwright
[Clock](https://playwright.dev/docs/api/class-clock) API.

There are ways adjust the time, like
[Set Time](https://marketsquare.github.io/robotframework-browser/Browser.html?tag=Clock#Set%20Time)
or
[Advance Clock](https://marketsquare.github.io/robotframework-browser/Browser.html?tag=Clock#Advance%20Clock)
. Many keyword have a mode how the clock is advanced.
1) Underlying timers are fired, meaning that clock is fast forwarded to the time
2) Timers are not fired, meaning clock jumped to the time.

The later former one simulates time passing, just in speeded phase. Later one
is more like closing the laptop lid, where the application does not run.

# Exercise
Lets look some basic example of clock keywords. The is an example `clock.html` page which allows you to test different
[clock](https://marketsquare.github.io/robotframework-browser/Browser.html?tag=Clock)
keywords. To use the page your test should do setup like this:

```robotframework
*** Settings ***
Library    Browser
Library    DateTime
Test Setup    Clock Setup

*** Test Cases ***
Set Time Continues To Run Clock
    Log    Your test here

*** Keywords ***
Clock Setup
    VAR    ${file}    file://${CURDIR}/clock.html
    New Browser    chromium    False
    New Page    ${file}
```

## Set clock
Write test that fast forwards time 60 minutes to the future. CLock should remain running
after time is adjusted. Write assertion that verifies that time is correctly set.

## Pause, advance and resume clock
Write test that will pause time 90 minutes in the future and verify that time is set.
Then advance time again 30 minutes in the future and verify that time is set.
Lastly free the clock and observe that time is passing.

# Solutions
Solution can be found from [clock.robot](clock.robot) file.