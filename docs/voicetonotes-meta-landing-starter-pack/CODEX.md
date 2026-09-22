# Codex project instructions

First read:
- `00_START_HERE.md`
- `AGENT_MASTER_PROMPT.md`
- `06_FACT_CHECK_AND_CLAIMS.md`
- `07_QA_ACCEPTANCE.md`

Then inspect the repository.

## Engineering rules

- Preserve existing package manager and deploy conventions.
- Static Next.js export only.
- No server routes, middleware, or unnecessary runtime dependencies.
- Keep store navigation and analytics centralized.
- Keep campaign route differences in data/config, not duplicated page implementations.
- Prefer platform/browser APIs and CSS over dependencies.
- Add a dependency only when it clearly reduces complexity.

## Before finishing

Run the repository’s:
- install if necessary
- lint
- typecheck
- tests
- build

Verify `out/` contains all four routes.

Report any requirement that could not be validated on a real device.
