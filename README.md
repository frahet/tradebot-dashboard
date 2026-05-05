> **ARCHIVED.** This project has been replaced by [`frahet/huginn-portal`](https://github.com/frahet/huginn-portal),
> which is deployed at [huginn.huginndigital.com](https://huginn.huginndigital.com).
> This repo is preserved for git history only — do not deploy or contribute.

---

# tradebot-dashboard

A Next.js dashboard for the tradebot system. **Superseded** as of Phase 4 of
the operator-portal consolidation (see [`tradebot-ops#109`](https://github.com/frahet/tradebot-ops/issues/109)).
The replacement, `huginn-portal`, ships:

- Real-time bot config + recent trades + equity chart at `/tradebot/bot/[id]`
- RJSF schema-driven config editor with semantic readonly guards
- API proxy to `api.huginndigital.com` via X-API-Key auth (CF Tunnel safe)

This repo's last meaningful change was before the Bun ops console SPA was
decommissioned in `tradebot#204`.

## Why this README exists

This file was added during a one-off un-archive cycle on 2026-05-05 to leave
a clear breadcrumb on GitHub's repo page. Without it, future visitors hit
working-looking code with no indication it's dead. The file's only purpose
is to point at the canonical replacement and prevent wrong-repo time loss.

— closes [`tradebot-ops#126`](https://github.com/frahet/tradebot-ops/issues/126) (D-PR-1).
