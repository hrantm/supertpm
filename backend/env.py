import os
import re
from pathlib import Path


def load_env(path=".env"):
    env_path = Path(path)
    if env_path.exists():
        for raw_line in env_path.read_text().splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'\"")
            os.environ.setdefault(key, value)

    key_name = os.environ.get("OPENAI_API_KEY_NAME", "OPENAI_API_KEY")
    key_source = os.environ.get("OPENAI_API_KEY_SOURCE")
    if os.environ.get("OPENAI_API_KEY") or not key_source:
        return

    source_path = Path(key_source).expanduser()
    if not source_path.exists():
        return

    pattern = re.compile(rf"^\s*(?:export\s+)?{re.escape(key_name)}=(.+?)\s*$")
    for raw_line in source_path.read_text(errors="replace").splitlines():
        match = pattern.match(raw_line)
        if not match:
            continue
        value = match.group(1).strip().strip("'\"")
        if value:
            os.environ["OPENAI_API_KEY"] = value
            return
