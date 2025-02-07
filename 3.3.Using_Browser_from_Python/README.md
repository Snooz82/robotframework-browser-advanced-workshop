[<- Back](/README.md)

# 2.4 Using Browser from Python

To create a library that accesses the same instance of Browser you have to import it from robot.

This import has to be done when the first keyword is called otherwise you get issues with LibDoc!

Use @properties !

```python
@library
class CarConfigLibrary:
    ROBOT_LIBRARY_SCOPE = "GLOBAL"
    ROBOT_LIBRARY_VERSION = VERSION

    def __init__(self, headless: bool = False):
        self._browser_instance: Optional[Browser] = None

    @property
    def b(self) -> Browser:
        if self._browser_instance is None:
            try:
                self._browser_instance = BuiltIn().get_library_instance("Browser")
            except RuntimeError:
                raise ImportError("You have to import the library 'Browser' as well.")
        return self._browser_instance
```

With this property `self.b` you can then access all Browser keywords directly.

**Example:**

```python
    @keyword
    def login_user(self, user: str, password: str):
        """Login a User"""
        self.b.type_text("#input_username", user)
        self.b.type_text("#input_password", password)
        self.b.click("#button_login")
```

See the example files...