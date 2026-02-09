*** Settings ***
Library     Browser


*** Test Cases ***
Test With Chrome
    New Browser    headless=False    channel=chrome
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=comment]    This is comment
