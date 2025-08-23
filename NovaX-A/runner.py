#!/usr/bin/env python3

import argparse
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from urllib import request as urlrequest
from urllib.error import URLError, HTTPError
import subprocess
import heapq


TRANSIENT_ERROR_PATTERNS = [
    r"Environment failed to start",
    r"resource allocation",
    r"OutOfMemory",
    r"out of memory",
    r"oom\-kill",
    r"insufficient resources",
    r"Insufficient.*CPU",
    r"Insufficient.*memory",
    r"node.*not.*available",
    r"capacity.*exceeded",
    r"device.*busy",
    r"GPU.*not.*available",
    r"Cluster.*autoscaler.*unable",
    r"failed.*to.*(schedule|allocate)",
]

DEFAULT_MAX_ATTEMPTS = int(os.getenv("NOVAXA_MAX_RETRIES", "10"))
DEFAULT_RETRY_INTERVAL_SECONDS = int(os.getenv("NOVAXA_RETRY_INTERVAL_SECONDS", "120"))
NOTIFY_ONLY_FINAL = os.getenv("NOVAXA_NOTIFY_ONLY_FINAL", "1") != "0"
SLACK_WEBHOOK = os.getenv("NOVAXA_SLACK_WEBHOOK", "").strip()
CUSTOM_NOTIFY_COMMAND = os.getenv("NOVAXA_NOTIFY_COMMAND", "").strip()

BASE_DIR = Path(__file__).resolve().parent
STATE_DIR = BASE_DIR / "state"
LOGS_DIR = BASE_DIR / "logs"


@dataclass
class TaskStep:
    name: str
    cmd: str


@dataclass
class Task:
    task_id: str
    priority: int
    dependencies: List[str]
    steps: List[TaskStep]


class NotificationService:
    def __init__(self, slack_webhook: str = SLACK_WEBHOOK, custom_command: str = CUSTOM_NOTIFY_COMMAND) -> None:
        self.slack_webhook = slack_webhook
        self.custom_command = custom_command

    def notify(self, title: str, message: str, level: str = "info") -> None:
        payload = {
            "title": title,
            "message": message,
            "level": level,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        text_message = f"[{payload['level'].upper()}] {payload['title']}: {payload['message']}"

        if self.slack_webhook:
            try:
                data = json.dumps({"text": text_message}).encode("utf-8")
                req = urlrequest.Request(self.slack_webhook, data=data, headers={"Content-Type": "application/json"})
                with urlrequest.urlopen(req) as _:
                    pass
            except (URLError, HTTPError) as exc:
                print(f"Slack notification failed: {exc}", file=sys.stderr)

        if self.custom_command:
            try:
                subprocess.run(
                    self.custom_command,
                    input=text_message.encode("utf-8"),
                    shell=True,
                    check=False,
                )
            except Exception as exc:  # noqa: BLE001
                print(f"Custom notification command failed: {exc}", file=sys.stderr)

        # Always echo to stdout as a fallback
        print(text_message)


class StateStore:
    def __init__(self, state_dir: Path) -> None:
        self.state_dir = state_dir
        self.state_dir.mkdir(parents=True, exist_ok=True)

    def path_for(self, task_id: str) -> Path:
        return self.state_dir / f"{task_id}.json"

    def load(self, task_id: str) -> Dict:
        path = self.path_for(task_id)
        if path.exists():
            with path.open("r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "task_id": task_id,
            "status": "pending",
            "completed_steps": [],
            "step_attempts": {},
            "started_epoch": None,
            "last_updated_epoch": None,
            "last_error": None,
        }

    def save(self, task_state: Dict) -> None:
        path = self.path_for(task_state["task_id"])
        task_state["last_updated_epoch"] = time.time()
        with path.open("w", encoding="utf-8") as f:
            json.dump(task_state, f, indent=2, sort_keys=True)


def configure_logging(task_id: Optional[str] = None) -> logging.Logger:
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger(task_id or "NovaX-A")
    logger.setLevel(logging.INFO)

    # Prevent duplicate handlers
    if logger.handlers:
        return logger

    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    if task_id:
        file_handler = logging.FileHandler(LOGS_DIR / f"{task_id}.log")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


def is_transient_environment_error(output_text: str) -> bool:
    text = output_text or ""
    for pattern in TRANSIENT_ERROR_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE):
            return True
    return False


def run_command_with_retries(
    cmd: str,
    logger: logging.Logger,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    retry_interval_seconds: int = DEFAULT_RETRY_INTERVAL_SECONDS,
    attempts_already_made: int = 0,
) -> Tuple[bool, str, int]:
    attempts_used = 0
    last_output = ""

    allowed_attempts = max(0, max_attempts - attempts_already_made)
    if allowed_attempts == 0:
        logger.error(
            f"No attempts left (already made {attempts_already_made}/{max_attempts}). Skipping execution."
        )
        return False, "Max attempts exhausted", 0

    while attempts_used < allowed_attempts:
        attempts_used += 1
        current_attempt = attempts_already_made + attempts_used
        logger.info(
            f"Executing command (attempt {current_attempt}/{max_attempts}): {cmd}"
        )
        started = time.time()

        proc = subprocess.run(
            cmd,
            shell=True,
            text=True,
            capture_output=True,
        )

        duration = time.time() - started
        combined_output = (proc.stdout or "") + (proc.stderr or "")
        last_output = combined_output

        if proc.returncode == 0:
            logger.info(f"Command succeeded in {duration:.2f}s")
            return True, combined_output, attempts_used

        logger.warning(
            f"Command failed with exit code {proc.returncode} in {duration:.2f}s. Checking if retryable..."
        )

        if is_transient_environment_error(combined_output):
            if attempts_used < allowed_attempts:
                logger.warning(
                    f"Detected transient environment/resource issue. Retrying in {retry_interval_seconds}s..."
                )
                time.sleep(retry_interval_seconds)
                continue
            else:
                logger.error("Max retry attempts reached for transient error.")
                return False, combined_output, attempts_used
        else:
            logger.error("Non-retryable error encountered. Aborting without retry.")
            return False, combined_output, attempts_used

    return False, last_output, attempts_used


def load_queue(queue_path: Path) -> List[Task]:
    with queue_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    tasks: List[Task] = []
    for t in data.get("tasks", []):
        steps = [TaskStep(name=s["name"], cmd=s["cmd"]) for s in t.get("steps", [])]
        tasks.append(
            Task(
                task_id=t["id"],
                priority=int(t.get("priority", 0)),
                dependencies=list(t.get("dependencies", [])),
                steps=steps,
            )
        )
    return tasks


def topological_order_with_priority(tasks: List[Task]) -> List[Task]:
    id_to_task: Dict[str, Task] = {t.task_id: t for t in tasks}

    # Build graph
    in_degree: Dict[str, int] = {t.task_id: 0 for t in tasks}
    adj: Dict[str, List[str]] = {t.task_id: [] for t in tasks}

    for t in tasks:
        for dep in t.dependencies:
            if dep not in id_to_task:
                raise ValueError(f"Task '{t.task_id}' depends on missing task '{dep}'")
            adj[dep].append(t.task_id)
            in_degree[t.task_id] += 1

    # Use a heap with (-priority, task_id) to pop highest priority first
    heap: List[Tuple[int, str]] = []
    for tid, deg in in_degree.items():
        if deg == 0:
            heapq.heappush(heap, (-id_to_task[tid].priority, tid))

    ordered: List[Task] = []
    while heap:
        _, tid = heapq.heappop(heap)
        ordered.append(id_to_task[tid])
        for nbr in adj[tid]:
            in_degree[nbr] -= 1
            if in_degree[nbr] == 0:
                heapq.heappush(heap, (-id_to_task[nbr].priority, nbr))

    if len(ordered) != len(tasks):
        raise ValueError("Cycle detected in task dependencies")

    return ordered


def get_starting_step_index(task: Task, completed_steps: List[str]) -> int:
    if not completed_steps:
        return 0
    # Continue from the first step not in completed_steps (by name)
    completed_set: Set[str] = set(completed_steps)
    for idx, step in enumerate(task.steps):
        if step.name not in completed_set:
            return idx
    return len(task.steps)


def execute_task(
    task: Task,
    state_store: StateStore,
    notifier: NotificationService,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    retry_interval_seconds: int = DEFAULT_RETRY_INTERVAL_SECONDS,
) -> None:
    logger = configure_logging(task.task_id)
    logger.info(f"Starting task '{task.task_id}' with priority {task.priority}")

    state = state_store.load(task.task_id)
    if not state.get("started_epoch"):
        state["started_epoch"] = time.time()
    state["status"] = "in_progress"
    state_store.save(state)

    start_index = get_starting_step_index(task, state.get("completed_steps", []))

    if start_index >= len(task.steps):
        logger.info("All steps already completed. Marking task as completed.")
        state["status"] = "completed"
        state_store.save(state)
        if NOTIFY_ONLY_FINAL:
            notifier.notify(
                title=f"Task {task.task_id} already completed",
                message="No work needed.",
                level="info",
            )
        return

    for idx in range(start_index, len(task.steps)):
        step = task.steps[idx]
        logger.info(f"Executing step {idx + 1}/{len(task.steps)}: {step.name}")

        prior_attempts_for_step = state.get("step_attempts", {}).get(step.name, 0)
        ok, output, attempts_used = run_command_with_retries(
            step.cmd,
            logger,
            max_attempts=max_attempts,
            retry_interval_seconds=retry_interval_seconds,
            attempts_already_made=prior_attempts_for_step,
        )

        state.setdefault("step_attempts", {})[step.name] = prior_attempts_for_step + attempts_used

        if not ok:
            state["status"] = "failed"
            state["last_error"] = f"Step '{step.name}' failed. Output tail: {output[-1000:]}"
            state_store.save(state)
            if NOTIFY_ONLY_FINAL:
                notifier.notify(
                    title=f"Task {task.task_id} failed",
                    message=state["last_error"] or "Unknown error",
                    level="error",
                )
            return

        # Record successful step completion
        completed_steps: List[str] = state.get("completed_steps", [])
        if step.name not in completed_steps:
            completed_steps.append(step.name)
        state["completed_steps"] = completed_steps
        state_store.save(state)
        logger.info(f"Step '{step.name}' completed successfully")

    state["status"] = "completed"
    state_store.save(state)

    if NOTIFY_ONLY_FINAL:
        notifier.notify(
            title=f"Task {task.task_id} completed",
            message=f"All {len(task.steps)} steps finished successfully.",
            level="success",
        )


def run_queue(
    queue_path: Path,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    retry_interval_seconds: int = DEFAULT_RETRY_INTERVAL_SECONDS,
) -> None:
    tasks = load_queue(queue_path)
    if not tasks:
        print(f"No tasks found in queue: {queue_path}")
        return

    ordered = topological_order_with_priority(tasks)
    state_store = StateStore(STATE_DIR)
    notifier = NotificationService()

    for task in ordered:
        # Ensure dependencies completed
        all_deps_completed = True
        for dep_id in task.dependencies:
            dep_state = state_store.load(dep_id)
            if dep_state.get("status") != "completed":
                all_deps_completed = False
                print(
                    f"Skipping '{task.task_id}' until dependency '{dep_id}' is completed. Current dep status: {dep_state.get('status')}"
                )
                break

        if not all_deps_completed:
            continue

        execute_task(
            task,
            state_store,
            notifier,
            max_attempts=max_attempts,
            retry_interval_seconds=retry_interval_seconds,
        )


def run_single_step(
    task_id: str,
    step_id: str,
    cmd: str,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    retry_interval_seconds: int = DEFAULT_RETRY_INTERVAL_SECONDS,
) -> int:
    """
    Wrapper to run a single step with retry and checkpointing. If the step was
    previously completed, it will be skipped.
    """
    state_store = StateStore(STATE_DIR)
    notifier = NotificationService()
    logger = configure_logging(task_id)

    state = state_store.load(task_id)
    if not state.get("started_epoch"):
        state["started_epoch"] = time.time()
    state.setdefault("completed_steps", [])

    # If step already completed, skip
    if step_id in state["completed_steps"]:
        logger.info(f"Step '{step_id}' already completed. Skipping.")
        return 0

    ok, output, attempts_used = run_command_with_retries(
        cmd,
        logger,
        max_attempts=max_attempts,
        retry_interval_seconds=retry_interval_seconds,
        attempts_already_made=state.get("step_attempts", {}).get(step_id, 0),
    )

    prior_attempts_for_step = state.get("step_attempts", {}).get(step_id, 0)
    state.setdefault("step_attempts", {})[step_id] = prior_attempts_for_step + attempts_used

    if not ok:
        state["status"] = "failed"
        state["last_error"] = f"Step '{step_id}' failed. Output tail: {output[-1000:]}"
        state_store.save(state)
        if NOTIFY_ONLY_FINAL:
            notifier.notify(
                title=f"Task {task_id} failed",
                message=state["last_error"] or "Unknown error",
                level="error",
            )
        return 1

    # Success
    completed_steps: List[str] = state.get("completed_steps", [])
    if step_id not in completed_steps:
        completed_steps.append(step_id)
    state["completed_steps"] = completed_steps
    state["status"] = "in_progress"
    state_store.save(state)

    logger.info(f"Step '{step_id}' completed successfully")
    return 0


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "NovaX-A Task Runner: retries transient environment/resource failures, "
            "saves progress for resume, prioritizes queue, handles dependencies, and sends final notifications."
        )
    )

    sub = parser.add_subparsers(dest="command", required=True)

    q = sub.add_parser("run-queue", help="Run tasks from a queue JSON file with priority and dependencies")
    q.add_argument("--queue", type=str, default=str(BASE_DIR / "queue.json"), help="Path to queue JSON file")
    q.add_argument("--max-retries", type=int, default=DEFAULT_MAX_ATTEMPTS, help="Max retry attempts per step")
    q.add_argument(
        "--retry-interval-seconds",
        type=int,
        default=DEFAULT_RETRY_INTERVAL_SECONDS,
        help="Seconds to wait between retries for transient errors",
    )

    s = sub.add_parser("run-step", help="Run a single step with retry and checkpointing")
    s.add_argument("--task-id", required=True, type=str, help="Task ID to associate state with")
    s.add_argument("--step-id", required=True, type=str, help="Step ID/name")
    s.add_argument("--cmd", required=True, type=str, help="Shell command to execute")
    s.add_argument("--max-retries", type=int, default=DEFAULT_MAX_ATTEMPTS, help="Max retry attempts")
    s.add_argument(
        "--retry-interval-seconds",
        type=int,
        default=DEFAULT_RETRY_INTERVAL_SECONDS,
        help="Seconds to wait between retries",
    )

    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)

    if args.command == "run-queue":
        run_queue(
            Path(args.queue),
            max_attempts=args.max_retries,
            retry_interval_seconds=args.retry_interval_seconds,
        )
        return 0

    if args.command == "run-step":
        return run_single_step(
            task_id=args.task_id,
            step_id=args.step_id,
            cmd=args.cmd,
            max_attempts=args.max_retries,
            retry_interval_seconds=args.retry_interval_seconds,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())