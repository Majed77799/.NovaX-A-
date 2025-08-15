# NovaX-A Task Runner

This task runner adds automatic retries for transient environment/resource failures, persistent checkpointing to resume from the last successful step, priority-based scheduling, dependency handling, and final notifications.

## Features
- Retries failures that match environment/resource issues (e.g., "Environment failed to start", insufficient resources) every 2 minutes, up to 10 attempts by default
- Saves progress after each successful step to allow resume without repeating work
- Prioritizes tasks by `priority` value and respects `dependencies` using a topological order
- Notifies only when a task completes successfully or fails after exhausting retries (Slack webhook and/or custom command supported)

## Quick start

1. Prepare a queue file with your tasks (see `queue.example.json`).
2. Run the queue:

```bash
python3 NovaX-A/runner.py run-queue --queue NovaX-A/queue.json
```

Alternatively, wrap individual steps in existing pipelines:

```bash
python3 NovaX-A/runner.py run-step \
  --task-id build-service-A \
  --step-id build \
  --cmd "./scripts/build_service_A.sh"
```

## Queue file schema

`queue.json` example:

```json
{
  "tasks": [
    {
      "id": "build-service-A",
      "priority": 10,
      "dependencies": [],
      "steps": [
        { "name": "build", "cmd": "./scripts/build_service_A.sh" },
        { "name": "deploy", "cmd": "./scripts/deploy_service_A.sh" },
        { "name": "optimize", "cmd": "./scripts/optimize_service_A.sh" }
      ]
    }
  ]
}
```

- **id**: unique task identifier
- **priority**: higher number runs earlier (after dependency constraints)
- **dependencies**: list of other task ids that must complete first
- **steps**: ordered list of steps with a `name` and shell `cmd`

## Retries and resume
- Retries are triggered only for transient environment/resource failures detected in output
- Defaults: 10 attempts, 120s between attempts. Override via env:
  - `NOVAXA_MAX_RETRIES`
  - `NOVAXA_RETRY_INTERVAL_SECONDS`
- Checkpoints stored in `NovaX-A/state/<task_id>.json`
- Logs in `NovaX-A/logs/<task_id>.log`

## Notifications
- Set `NOVAXA_SLACK_WEBHOOK` to send Slack messages
- Or set `NOVAXA_NOTIFY_COMMAND` to receive the final message on stdin (e.g., a mailer or CLI)
- By default only final notifications are sent. To emit all messages to notifier(s), set `NOVAXA_NOTIFY_ONLY_FINAL=0`

## Notes
- To ensure resume works, define steps as idempotent or safe to re-run
- Non-transient errors fail immediately without retry
- Cycles in dependencies are rejected