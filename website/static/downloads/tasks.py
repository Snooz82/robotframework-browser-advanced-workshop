import socket
import subprocess
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
from datetime import timedelta
from time import monotonic

import psutil  # type: ignore
from Browser import Browser, SupportedBrowsers  # type: ignore
from invoke import Context, task  # type: ignore
from robot.run import run  # type: ignore


def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("", 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def run_command(c: Context, command: str) -> int:
    """Run a command and return whether it failed."""
    result = c.run(command, warn=True)
    return int(result.failed if result else True)


@task
def lint_robot(c: Context) -> None:
    """Runs robocop on the project files."""
    failed = run_command(c, "robotidy .")
    failed += run_command(c, "robocop .")
    if failed:
        raise SystemExit(failed)


@task
def lint_python(c: Context) -> None:
    """Task to run ruff and mypy on project files."""
    failed = run_command(c, "mypy --config-file pyproject.toml .")
    failed += run_command(c, "ruff format --config pyproject.toml .")
    failed += run_command(c, "ruff check --fix --config pyproject.toml .")
    if failed:
        raise SystemExit(failed)


@task(lint_python, lint_robot)
def lint(c: Context) -> None:
    """Runs all linting tasks."""


@task
def test(c: Context, loglevel: str = "TRACE:INFO") -> None:
    """Runs the robot tests."""
    run("./pabot_tests", loglevel=loglevel, variable=["HEADLESS:False"])


def get_process_count():
    return psutil.cpu_count(logical=False)


def init_browser(reuse_node: bool, args: list[str]) -> Browser:
    start_node = monotonic()
    browser_lib: Browser | None = None
    if reuse_node:
        browser_lib = Browser()
        _ = browser_lib.playwright._playwright_process  # init node and create port
        port = str(browser_lib.playwright.port)
        args.extend(["--variable", f"PLAYWRIGHT_PORT:{port}"])
        # os.environ["ROBOT_FRAMEWORK_BROWSER_NODE_PORT"] = port
    else:
        browser_lib = Browser()
    print(f"## Node setup took {timedelta(seconds=monotonic() - start_node)}")
    return browser_lib


def launch_browsers_in_parallel(
    browser_lib: Browser, headfull: bool, browser: str, count: int, endpoints: list[str]
):
    with ThreadPoolExecutor(max_workers=count) as executor:
        endpoints.extend(
            executor.map(
                lambda _: browser_lib.launch_browser_server(
                    browser=SupportedBrowsers[browser], headless=not headfull
                ),
                range(count),
            )
        )
    for i, endpoint in enumerate(endpoints):
        print(f"## Browser server {i} started at {endpoint}")


def launch_browser_servers_serial(
    browser_lib: Browser, headfull: bool, browser: str, count: int, endpoints: list[str]
):
    for i in range(count):
        endpoint = browser_lib.launch_browser_server(
            browser=SupportedBrowsers[browser], headless=not headfull
        )
        endpoints.append(endpoint)
        print(f"## Browser server {i} started at {endpoint}")


def run_pabot_tests(process_count: int, args: list[str], browser: str, headfull: bool) -> None:
    start_pabot = monotonic()
    command = [
        "pabot",
        "--testlevelsplit",
        "--processes",
        str(process_count),
        *args,
        "--variable",
        f"BROWSER:{browser}",
        "--variable",
        f"HEADLESS:{not headfull}",
        "-d",
        "./results",
        "./pabot_tests/",
    ]
    subprocess.call(command)
    print(f"## Pabot execution took {timedelta(seconds=monotonic() - start_pabot)}")


@task
def test_pabot(  # noqa: PLR0913
    c: Context,
    headfull: bool = False,
    reuse_browser: bool = False,
    reuse_node: bool = False,
    processes: int = 0,
    browser: str = "chromium",
    browser_start_mode: str = "parallel",
) -> None:
    overall_start = monotonic()
    args: list[str] = []
    process_count = (get_process_count() if processes == 0 else processes) or 4
    browser_lib = init_browser(reuse_node, args)
    if reuse_browser:
        start_browsers = monotonic()
        endpoints: list[str] = []
        if browser_start_mode == "serial" or not reuse_node:
            launch_browser_servers_serial(browser_lib, headfull, browser, process_count, endpoints)
        elif browser_start_mode == "parallel":
            launch_browsers_in_parallel(browser_lib, headfull, browser, process_count, endpoints)
        else:
            raise ValueError("Invalid browser_mode. Choose from: 'serial', 'parallel'")
        args.extend(["--variable", f"WS_ENDPOINTS:{','.join(endpoints)}"])
        print(f"## Browser servers took {timedelta(seconds=monotonic() - start_browsers)}")
    print(f"## Running tests with {process_count} process(es)")
    run_pabot_tests(process_count, args, browser, headfull)
    print(f"## Total test run took {timedelta(seconds=monotonic() - overall_start)}")
