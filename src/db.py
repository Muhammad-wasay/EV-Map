"""
Neon (PostgreSQL) persistence layer for VoltPath.

Schema (one logical "dataset" per JSON file in data/):
  datasets(name PK, metadata JSONB, ev JSONB, extra JSONB)
  nodes(dataset, node_id, name, lat, lon, position)
  stations(dataset, node_id, station_id, name, power_kw, cost_per_kwh, is_available, queue_wait_hours)
  edges(id, dataset, u, v, distance_km, speed_kmh, is_blocked, road_name, position)

`load_dataset_dict` returns the exact same dict shape as the JSON files, so the
rest of the code is agnostic to where the data came from.
"""
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv

load_dotenv()

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS datasets (
    name     TEXT PRIMARY KEY,
    metadata JSONB NOT NULL DEFAULT '{}',
    ev       JSONB,
    extra    JSONB NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS nodes (
    dataset  TEXT NOT NULL REFERENCES datasets(name) ON DELETE CASCADE,
    node_id  TEXT NOT NULL,
    name     TEXT NOT NULL,
    lat      DOUBLE PRECISION NOT NULL,
    lon      DOUBLE PRECISION NOT NULL,
    position INT NOT NULL,
    PRIMARY KEY (dataset, node_id)
);
CREATE TABLE IF NOT EXISTS stations (
    dataset          TEXT NOT NULL,
    node_id          TEXT NOT NULL,
    station_id       TEXT NOT NULL,
    name             TEXT NOT NULL,
    power_kw         DOUBLE PRECISION NOT NULL,
    cost_per_kwh     DOUBLE PRECISION NOT NULL,
    is_available     BOOLEAN NOT NULL DEFAULT TRUE,
    queue_wait_hours DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    PRIMARY KEY (dataset, node_id),
    FOREIGN KEY (dataset, node_id) REFERENCES nodes(dataset, node_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS edges (
    id          SERIAL PRIMARY KEY,
    dataset     TEXT NOT NULL REFERENCES datasets(name) ON DELETE CASCADE,
    u           TEXT NOT NULL,
    v           TEXT NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    speed_kmh   DOUBLE PRECISION NOT NULL,
    is_blocked  BOOLEAN NOT NULL DEFAULT FALSE,
    road_name   TEXT NOT NULL DEFAULT 'Highway',
    position    INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_edges_dataset ON edges(dataset);
CREATE TABLE IF NOT EXISTS vehicles (
    id                      TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    brand                   TEXT NOT NULL,
    body_type               TEXT,
    edition                 TEXT,
    capacity_kwh            DOUBLE PRECISION NOT NULL,
    usable_kwh              DOUBLE PRECISION NOT NULL,
    range_real_km           INT NOT NULL,
    acceptance_kw           DOUBLE PRECISION NOT NULL,
    consumption_kwh_per_km  DOUBLE PRECISION NOT NULL,
    accel_0_100_s           DOUBLE PRECISION,
    image                   TEXT
);
"""

VEHICLE_COLUMNS = [
    "id", "name", "brand", "body_type", "edition", "capacity_kwh", "usable_kwh",
    "range_real_km", "acceptance_kw", "consumption_kwh_per_km", "accel_0_100_s", "image",
]


def save_vehicles(conn, vehicles) -> None:
    cols = ", ".join(VEHICLE_COLUMNS)
    ph = ", ".join(["%s"] * len(VEHICLE_COLUMNS))
    updates = ", ".join(f"{c} = EXCLUDED.{c}" for c in VEHICLE_COLUMNS[1:])
    with conn.cursor() as cur:
        for v in vehicles:
            cur.execute(
                f"INSERT INTO vehicles ({cols}) VALUES ({ph}) "
                f"ON CONFLICT (id) DO UPDATE SET {updates}",
                [v.get(c) for c in VEHICLE_COLUMNS],
            )
    conn.commit()


def load_vehicles():
    with connect() as conn, conn.cursor() as cur:
        cur.execute(f"SELECT {', '.join(VEHICLE_COLUMNS)} FROM vehicles ORDER BY brand, name")
        return [dict(zip(VEHICLE_COLUMNS, row)) for row in cur.fetchall()]


def list_datasets():
    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            "SELECT d.name, d.metadata->>'network_name', "
            "(SELECT count(*) FROM nodes n WHERE n.dataset = d.name), "
            "(SELECT count(*) FROM edges e WHERE e.dataset = d.name) "
            "FROM datasets d ORDER BY d.name"
        )
        return [
            {"name": n, "network_name": nn, "nodes": nc, "edges": ec}
            for n, nn, nc, ec in cur.fetchall()
        ]


def database_url() -> Optional[str]:
    return os.environ.get("DATABASE_URL", "").strip() or None


def dataset_name_from_path(path: str) -> str:
    return os.path.splitext(os.path.basename(path))[0]


def connect():
    import psycopg

    url = database_url()
    if not url:
        raise RuntimeError("DATABASE_URL is not set.")
    return psycopg.connect(url, connect_timeout=10)


def create_schema(conn) -> None:
    with conn.cursor() as cur:
        cur.execute(SCHEMA_SQL)
    conn.commit()


def save_dataset(conn, name: str, raw: Dict[str, Any]) -> None:
    """Replace a dataset (idempotent)."""
    from psycopg.types.json import Jsonb

    extra = {
        k: v for k, v in raw.items() if k not in ("metadata", "default_ev", "nodes", "edges")
    }
    with conn.cursor() as cur:
        cur.execute("DELETE FROM datasets WHERE name = %s", (name,))
        cur.execute(
            "INSERT INTO datasets (name, metadata, ev, extra) VALUES (%s, %s, %s, %s)",
            (
                name,
                Jsonb(raw.get("metadata", {})),
                Jsonb(raw["default_ev"]) if raw.get("default_ev") is not None else None,
                Jsonb(extra),
            ),
        )
        for i, n in enumerate(raw.get("nodes", [])):
            cur.execute(
                "INSERT INTO nodes (dataset, node_id, name, lat, lon, position) "
                "VALUES (%s, %s, %s, %s, %s, %s)",
                (name, n["node_id"], n["name"], n["lat"], n["lon"], i),
            )
            st = n.get("station")
            if st:
                cur.execute(
                    "INSERT INTO stations (dataset, node_id, station_id, name, power_kw, "
                    "cost_per_kwh, is_available, queue_wait_hours) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                    (
                        name,
                        n["node_id"],
                        st["station_id"],
                        st["name"],
                        st["power_kw"],
                        st["cost_per_kwh"],
                        bool(st.get("is_available", True)),
                        st.get("queue_wait_hours", 0.10),
                    ),
                )
        for i, e in enumerate(raw.get("edges", [])):
            cur.execute(
                "INSERT INTO edges (dataset, u, v, distance_km, speed_kmh, is_blocked, "
                "road_name, position) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    name,
                    e["u"],
                    e["v"],
                    e["distance_km"],
                    e["speed_kmh"],
                    bool(e.get("is_blocked", False)),
                    e.get("road_name", "Highway"),
                    i,
                ),
            )
    conn.commit()


def load_dataset_dict(name: str) -> Optional[Dict[str, Any]]:
    """Return the dataset in JSON-file shape, or None if absent."""
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT metadata, ev, extra FROM datasets WHERE name = %s", (name,))
        row = cur.fetchone()
        if row is None:
            return None
        metadata, ev, extra = row

        cur.execute(
            "SELECT n.node_id, n.name, n.lat, n.lon, s.station_id, s.name, s.power_kw, "
            "s.cost_per_kwh, s.is_available, s.queue_wait_hours "
            "FROM nodes n LEFT JOIN stations s ON s.dataset = n.dataset AND s.node_id = n.node_id "
            "WHERE n.dataset = %s ORDER BY n.position",
            (name,),
        )
        nodes = []
        for nid, nname, lat, lon, sid, sname, pw, cost, avail, qw in cur.fetchall():
            node: Dict[str, Any] = {"node_id": nid, "name": nname, "lat": lat, "lon": lon}
            if sid is not None:
                node["station"] = {
                    "station_id": sid,
                    "name": sname,
                    "power_kw": pw,
                    "cost_per_kwh": cost,
                    "is_available": avail,
                    "queue_wait_hours": qw,
                }
            nodes.append(node)

        cur.execute(
            "SELECT u, v, distance_km, speed_kmh, is_blocked, road_name FROM edges "
            "WHERE dataset = %s ORDER BY position",
            (name,),
        )
        edges = [
            {
                "u": u,
                "v": v,
                "distance_km": d,
                "speed_kmh": s,
                "is_blocked": b,
                "road_name": r,
            }
            for u, v, d, s, b, r in cur.fetchall()
        ]

    result: Dict[str, Any] = {"metadata": metadata, "default_ev": ev, "nodes": nodes, "edges": edges}
    result.update(extra or {})
    return result
