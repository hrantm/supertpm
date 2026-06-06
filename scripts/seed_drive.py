import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend.db import upsert_record
from fixtures.demo_data import DEMO_RECORDS


def main():
    records = [record for record in DEMO_RECORDS if record["source"] == "google_drive"]
    for record in records:
        upsert_record(record)
    print(f"Seeded {len(records)} fake Google Drive docs into SQLite")


if __name__ == "__main__":
    main()
