### Summary

Provide a concise description of the change, motivation, and the approach taken.

### Linked issues

- GitHub: reference issues with keywords (e.g., `Fixes #123`, `Closes #456`).
- Linear: include the issue key (e.g., `ABC-123`) in the title and branch name when Linear is connected.

### Test plan

Describe how you verified the change works. Include:
- Commands run and their outputs
- Screenshots/GIFs if UI changes
- Edge cases covered

### Performance impact

Explain the expected performance impact. If applicable, provide:
- Baseline vs. after metrics (timings, memory, DB queries, bundle size)
- How the numbers were measured
- Any trade-offs or mitigations

### Security notes

Call out any security-sensitive areas:
- Secrets/credentials handling
- PII/Data exposure
- AuthZ/AuthN changes
- Input validation and escaping
- Dependency risk (new or updated packages)

### Health Gate

All items below must be checked and remain green before merge. If something is not applicable, mark it checked and write `N/A` alongside the item.

- [ ] Title and branch include the Linear issue key (e.g., `ABC-123`) when Linear is connected
- [ ] Tests updated and passing (unit/integration/e2e as applicable)
- [ ] Lint and type checks pass
- [ ] QA/E2E scenario covered or marked `N/A`
- [ ] Docs/CHANGELOG updated or marked `N/A`
- [ ] Security reviewed: no secrets in code, PII safe, dependencies acceptable
- [ ] Performance assessed: numbers provided or marked `N/A` with justification
- [ ] Observability updated (logs/metrics/traces/alerts) or marked `N/A`
- [ ] Rollout and rollback plan noted
- [ ] Risk acknowledged; reviewers/owners identified

