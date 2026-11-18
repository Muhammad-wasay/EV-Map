"""
Seed the Neon database from every JSON file in data/.

Usage (from project root):  python -m scripts.seed_db
Idempotent: re-running replaces each dataset with the JSON contents.
"""
import glob
import json
import os

from src import db


def main() -> None:
    if not db.database_url():
        raise SystemExit("DATABASE_URL is not set (see .env.example).")
    with db.connect() as conn:
        db.create_schema(conn)
        for path in sorted(glob.glob(os.path.join("data", "*.json"))):
            with open(path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            name = db.dataset_name_from_path(path)
            db.save_dataset(conn, name, raw)
            print(
                f"Seeded '{name}': {len(raw.get('nodes', []))} nodes, "
                f"{len(raw.get('edges', []))} edges"
            )
        vpath = os.path.join("data", "vehicles", "vehicles.json")
        with open(vpath, "r", encoding="utf-8") as f:
            vehicles = json.load(f)
        db.save_vehicles(conn, vehicles)
        print(f"Seeded {len(vehicles)} vehicles")


if __name__ == "__main__":
    main()
