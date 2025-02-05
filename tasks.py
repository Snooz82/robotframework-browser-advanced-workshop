from invoke import Context, task  # type: ignore
from robot.run import run  # type: ignore


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
    run("./Robots", loglevel=loglevel, variable=["HEADLESS:True"])
