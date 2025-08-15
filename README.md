# NovaX

Lightweight API and static web demo.

## Run locally

- API (FastAPI via Uvicorn):
  ```bash
  cd /workspace
  python3 -m venv .venv && source .venv/bin/activate
  pip install -U pip
  pip install fastapi uvicorn[standard]
  # Optional for SQLite provider is built-in (sqlite3), no extra deps needed
  # Run API
  uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
  ```

- Web (static):
  - Open `/workspace/web/index.html` in a browser, or serve statically:
    ```bash
    python3 -m http.server 5500 --directory /workspace/web
    ```
    Then visit `http://127.0.0.1:5500` and set API base URL to `http://127.0.0.1:8000`.

## Data providers

- Default: Mock JSON file at `api/data/mock_messages.json`.
- Real: SQLite database at `/workspace/data/app.db`.

Toggle via environment variable before starting the API:
```bash
# Mock JSON (default)
export USE_SQLITE=0

# SQLite
export USE_SQLITE=1
```

Endpoints:
- `GET /health` – API status
- `GET /source` – active provider details
- `GET /messages` – list messages

## Mobile

No mobile app in this repository. The API and web can be consumed by any mobile client.

## Known limitations / next steps

- No auth or write APIs (read-only demo). Add POST/PUT/DELETE for messages.
- No export features. Next: endpoints to export JSON/CSV and UI buttons to download.
- No containerization. Next: add Dockerfile and `docker-compose.yml`.
- No CI. Next: add GitHub Actions workflow for lint/test/build.