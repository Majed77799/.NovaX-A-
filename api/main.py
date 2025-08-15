import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .providers import select_data_provider, provider_source_info

app = FastAPI(title="NovaX API", version="1.0.0")

# Allow local dev origins by default
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
	return {"ok": True}


@app.get("/source")
def source() -> dict:
	return provider_source_info()


@app.get("/messages")
def list_messages() -> dict:
	provider = select_data_provider()
	return {"messages": provider.get_messages()}