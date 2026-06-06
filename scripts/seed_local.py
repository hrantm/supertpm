import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.db import upsert_record
from fixtures.demo_data import DEMO_RECORDS


def main():
    for record in DEMO_RECORDS:
        upsert_record(record)
    print(f"Seeded {len(DEMO_RECORDS)} local records into data/signal-desk.sqlite")


if __name__ == "__main__":
    main()
