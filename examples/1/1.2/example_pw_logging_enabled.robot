*** Settings ***
Library         Browser    enable_playwright_debug=True    timeout=2s

Suite Setup     New Browser    headless=False


*** Variables ***
${secret}       this is secret in log.html but not in other logging


*** Test Cases ***
Playwrifght debug logs
    New Page    http://localhost:7272/prefilled_email_form.html
    Type Text    [name=comment]    this is not secret
    Type Secret    [name=comment]    $secret
