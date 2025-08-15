PYTHON?=python3
PIP?=$(PYTHON) -m pip
ROOT:=$(shell pwd)
DEPS_DIR:=$(ROOT)/.deps

.PHONY: install install-local api api-local api-sqlite web

install:
	$(PIP) install -r requirements.txt

install-local:
	$(PIP) install --upgrade --target $(DEPS_DIR) -r requirements.txt

api:
	uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

api-local:
	PYTHONPATH=$(DEPS_DIR) uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

api-sqlite:
	USE_SQLITE=1 PYTHONPATH=$(DEPS_DIR) uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

web:
	$(PYTHON) -m http.server 5500 --directory web