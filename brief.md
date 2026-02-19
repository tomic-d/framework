# BRIEF — Divhunt Framework

*Product definition. What this is, for whom, and why.*

---

## What is this?

Full-stack isomorphic JavaScript framework built from scratch. No React, no Express, no Vue — original architecture from zero. One universal abstraction — the **addon** — powers everything: databases, servers, commands, pages, directives, queues, and more.

Published on npm as `divhunt`. Version 2.0.0.

## Who is it for?

Primary: Dejan's own projects (Divhunt platform, Agents, freelance work).
Secondary: Open-source community — developers who want a different approach to full-stack JS.

## What problem does it solve?

Modern JS ecosystem is fragmented. You need React + Express + Prisma + Next + 50 packages just to build a CRUD app. This framework gives you one abstraction that handles backend, frontend, data, APIs, and reactivity — all from a single addon definition.

Define an addon with fields → you get: validation, events, middleware, PostgreSQL CRUD, API exposure, frontend reactivity, and DOM manipulation. No glue code.

## Technical identity

- **Zero external framework dependencies** — built from scratch
- **Addon as universal abstraction** — every entity is an addon
- **Mixin composition** — no inheritance hierarchies, Object.assign on prototypes
- **Middleware chains** — storage-agnostic CRUD (in-memory by default, PostgreSQL via addon)
- **Proxy-based reactivity** — 16ms debounced DOM diffing, no virtual DOM
- **gRPC + HTTP** — dual transport, binary-safe
- **Convention-based bundling** — no webpack, no config
- **Self-registering imports** — import order doesn't matter

## Production track record

- V1 powered Divhunt cloud SaaS for 4+ years (thousands of users)
- Travel agency site (27 addons, 50+ components)
- Distributed function execution gateway
- Multi-tenant CMS
- Divhunt Agents platform (current)

## Competition

| Framework | How we're different |
|---|---|
| Express | Backend only, no frontend, no ORM, no reactivity |
| Next.js | React-based, different paradigm, heavy |
| Nuxt | Vue-based, same issue |
| Fastify | Backend only, no addon abstraction |
| Hono | Lightweight but backend only |

Our edge: one abstraction for everything. No framework soup. One person can build a full production app.

## Vision

1. ~~V2 rebuild~~ (done)
2. ~~Open source~~ (done)
3. Stability and documentation (current)
4. Community adoption
5. Plugin ecosystem
6. Become a viable alternative for solo developers and small teams
