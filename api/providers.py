import json
import os
import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DEFAULT_DB_PATH = Path("/workspace/data/app.db")
DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)


@dataclass
class Message:
	id: Optional[int]
	author: str
	content: str
	created_at: str

	def to_dict(self) -> Dict[str, Any]:
		return {
			"id": self.id,
			"author": self.author,
			"content": self.content,
			"created_at": self.created_at,
		}


class DataProvider:
	def get_messages(self) -> List[Dict[str, Any]]:
		raise NotImplementedError

	def source_name(self) -> str:
		raise NotImplementedError

	def source_details(self) -> Dict[str, Any]:
		return {}


class MockProvider(DataProvider):
	def __init__(self, json_path: Optional[Path] = None) -> None:
		self.json_path = json_path or (DATA_DIR / "mock_messages.json")

		if not self.json_path.exists():
			# Seed with a few defaults if file does not exist
			self.json_path.parent.mkdir(parents=True, exist_ok=True)
			seed = [
				{
					"id": 1,
					"author": "system",
					"content": "Welcome to NovaX AI",
					"created_at": "2025-01-01T00:00:00Z",
				},
				{
					"id": 2,
					"author": "user",
					"content": "Hello world",
					"created_at": "2025-01-02T12:34:56Z",
				},
			]
			self.json_path.write_text(json.dumps(seed, ensure_ascii=False, indent=2), encoding="utf-8")

	def get_messages(self) -> List[Dict[str, Any]]:
		with self.json_path.open("r", encoding="utf-8") as f:
			return json.load(f)

	def source_name(self) -> str:
		return "mock-json"

	def source_details(self) -> Dict[str, Any]:
		return {"path": str(self.json_path)}


class SQLiteProvider(DataProvider):
	def __init__(self, db_path: Optional[Path] = None) -> None:
		self.db_path = db_path or DEFAULT_DB_PATH
		self.db_path.parent.mkdir(parents=True, exist_ok=True)
		self._ensure_schema()
		self._seed_if_empty()

	def _connect(self) -> sqlite3.Connection:
		return sqlite3.connect(str(self.db_path))

	def _ensure_schema(self) -> None:
		with self._connect() as conn:
			conn.execute(
				"""
				CREATE TABLE IF NOT EXISTS messages (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					author TEXT NOT NULL,
					content TEXT NOT NULL,
					created_at TEXT NOT NULL
				);
				"""
			)
			conn.commit()

	def _seed_if_empty(self) -> None:
		with self._connect() as conn:
			cursor = conn.execute("SELECT COUNT(1) FROM messages;")
			count = int(cursor.fetchone()[0])
			if count == 0:
				# Load from mock provider
				mock = MockProvider()
				rows = [(m["author"], m["content"], m["created_at"]) for m in mock.get_messages()]
				conn.executemany(
					"INSERT INTO messages(author, content, created_at) VALUES (?, ?, ?);",
					rows,
				)
				conn.commit()

	def get_messages(self) -> List[Dict[str, Any]]:
		with self._connect() as conn:
			cursor = conn.execute(
				"SELECT id, author, content, created_at FROM messages ORDER BY id ASC;"
			)
			rows = cursor.fetchall()
			return [
				{"id": r[0], "author": r[1], "content": r[2], "created_at": r[3]}
				for r in rows
			]

	def source_name(self) -> str:
		return "sqlite"

	def source_details(self) -> Dict[str, Any]:
		return {"db_path": str(self.db_path)}


def select_data_provider() -> DataProvider:
	use_sqlite = os.getenv("USE_SQLITE", "0").strip() in {"1", "true", "yes", "on"}
	if use_sqlite:
		return SQLiteProvider()
	return MockProvider()


def provider_source_info(provider: Optional[DataProvider] = None) -> Dict[str, Any]:
	p = provider or select_data_provider()
	return {"source": p.source_name(), "details": p.source_details()}