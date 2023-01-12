*** Settings ***
Library    CarConfigLibrary.py
Library    Browser    timeout=5 sec

*** Test Cases ***
Test1
    Open Car Config
    Login User    admin    @RBTFRMWRK@
    Take Screenshot
    Logout User