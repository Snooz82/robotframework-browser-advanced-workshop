[<- Back](/README.md)

# 1.4 Browser, Context, Page
Browser/Context/Page are the three pillars of Playwright and how it controls the browser binaries and how the
pages are opened. 

## 1.4.1 Browser
Browser defines which browser engine is used (chromium, firefox and webkit) and few other environment related options,
like timeout or location of an external browser binary. Browser is the highest level in the hierarchy and there can be
many browser open at the same time.

## 1.4.3 Context
Context defines how the browser engine is opened, one can see as a definition how the browser profile is created. 
Example context defines is the offline mode enabled or what geolocation is set for the context, or allows modification
of browser headers. Also controls few debugging options, like trace or video creation.

Each contex is opened under the specific browser and one browser can have multiple context open at the same time.

## 1.3.4 Page
Page is like a tab in the browser, it renders the opened URL. Page is always open under a specific context. 

Example browsers/contexts/pages structure could be opened like this:
```
Browser 1
    -> Context 1.1 
        -> Page 1.1.1
        -> Page 1.1.2
    -> Context 1.2
        -> Page 1.2.1
        -> Page 1.2.2
        -> Page 1.2.3
Browser 2
    -> Context 2.1
        -> Page 2.1.1
        -> Page 2.1.2
```

## Life cycle of 3 pillars


## Catalog, Switching

- Catalog
- New, Switch, Close
- ALL/ANY & CURRENT/ACTIVE