# DECISIONS — Divhunt Framework

*Every decision with reasoning. Never delete, only append.*

---

## D001 — Mixin composition over class inheritance
**Date:** Pre-open-source
**Decision:** Use `Object.assign(Class.prototype, mixin)` instead of class inheritance.
**Reason:** No diamond problem, no deep hierarchies, easy to add/remove capabilities. Each mixin is a plain object — simple to read, test, and compose.
**Rejected alternatives:**
- Class inheritance — fragile hierarchies, hard to compose multiple behaviors
- Functional composition — loses `this` context, harder to debug

---

## D002 — Addon as universal abstraction
**Date:** Pre-open-source
**Decision:** Every entity (users, pages, commands, servers) is an addon with the same interface: fields, items, functions, events, middleware.
**Reason:** One pattern to learn. Backend and frontend use the same abstraction. Reduces cognitive load.
**Rejected alternatives:**
- Separate abstractions for models, controllers, components — more code, more concepts, more glue

---

## D003 — Open source under MIT
**Date:** 2026-02-19
**Decision:** Publish framework as open source on GitHub under MIT license.
**Reason:** Portfolio value. Framework proves deep technical capability. Public code > private code for career and credibility.
**Rejected alternatives:**
- Keep private — no portfolio benefit, no community
- AGPL/proprietary — limits adoption

---

## D004 — AI-managed project files
**Date:** 2026-02-19
**Decision:** Use CLAUDE.md + structured files (brief, architecture, decisions, tasks, progress) for project management.
**Reason:** Same system used for Agents repo and iamdejan.com. AI maintains context across sessions, tracks decisions, protects scope.
**Context:** Third project using this system. Pattern is proven.

---

## D005 — divhunt.Error() instead of global DivhuntError class
**Date:** 2026-02-19
**Decision:** Structured errors via `divhunt.Error(code, message, context)` method on the instance, not a global class.
**Reason:** `divhunt` is already imported everywhere. No additional imports needed. Emits `'error'` event on creation so listeners can react. Returns a throwable `DivhuntError extends Error`.
**Rejected alternatives:**
- `globalThis.DivhuntError` — global pollution
- `throw new Error({})` — Error constructor expects string, object becomes `[object Object]`
- Separate import — extra boilerplate in every file

---

## D006 — Remove copyright headers from source files
**Date:** 2026-02-19
**Decision:** Remove `// © 2025 Divhunt GmbH` comment from all 92 source files.
**Reason:** MIT license in LICENSE file is sufficient. Copyright headers add noise to every file.
