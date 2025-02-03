*** Settings ***
Library     Browser     timeout=2s
Suite Setup             New Browser   headless=False

*** Test Cases ***
Example Logging On Error
    New Page    http://localhost:7272/prefilled_email_form.html
    Click    id=foobar
