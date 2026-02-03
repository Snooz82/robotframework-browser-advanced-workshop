"""Creates a virtual environment for developing the library.

Also installs the needed dependencies.
"""

import platform
import subprocess
from pathlib import Path
from venv import EnvBuilder

venv_dir = Path(".venv")
if not platform.platform().startswith("Windows"):
    venv_bin = venv_dir / "bin"
    venv_python = venv_bin / "python"
    venv_pre_commit = venv_bin / "pre-commit"
else:
    venv_bin = venv_dir / "Scripts"
    venv_python = venv_bin / "python.exe"
    venv_pre_commit = venv_bin / "pre-commit.exe"
src_dir = Path("Browser")

if not venv_dir.exists():
    print(f"Creating virtualenv in {venv_dir}")
    EnvBuilder(with_pip=True).create(venv_dir)

subprocess.run([venv_python, "-m", "pip", "install", "-U", "pip"], check=True)
subprocess.run([venv_python, "-m", "pip", "install", "-U", "-r", "requirements.txt"], check=True)
subprocess.run([venv_python, "-m", "Browser.entry", "init"], check=True)
subprocess.run([venv_pre_commit, "install"], check=True)

activate_script = (
    "source .venv/bin/activate"
    if not platform.platform().startswith("Windows")
    else ".venv\\Scripts\\activate.bat"
)
print(f"Virtualenv `{venv_dir}` is ready and up-to-date.")
print(f"Run `{activate_script}` to activate the virtualenv.")
