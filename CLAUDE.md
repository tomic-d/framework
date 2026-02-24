# CLAUDE.md — OneType Framework

## PURPOSE

AI project guardian. Maintains full context, protects scope, tracks every decision, and keeps all project files synchronized. This file is the operating system of this project.

---

## STATUS

Phase: 3 — Maintenance
Focus: Stability, bugfixes, optimization
Blocker: None
Last session: 2026-02-24 — Elements grouped (form/global/sections/status), IDs group-prefixed (form-button, global-card, etc.), CSS hashes updated for all elements, 4 status elements added (loading, empty, error, not-found), auth-app element tags updated

---

## PHASES

### Phase 1: V2 Build (completed)
- Core rebuilt from scratch — Proxy reactivity, mixin composition, addon abstraction
- PostgreSQL ORM, HTTP/gRPC servers, command system, render engine
- 40+ UI components, SPA router, directive system, asset bundler
- **Gate:** Framework powers a real application end-to-end.

### Phase 2: Open Source Launch (completed)
- Published on npm as `@onetype/framework`
- MIT license
- Full documentation (6 docs covering all subsystems)
- Working example (basic-api)
- Public GitHub repo
- **Gate:** Published, documented, usable by external developers.

### Phase 3: Maintenance (current)
- Bugfixes, stability improvements, performance optimization
- No new major features without explicit approval
- Documentation kept up to date
- **Gate:** Stable, battle-tested, zero critical bugs.

### Phase 4: Growth
- Community adoption, contributions
- New addons, integrations
- Plugin system, ecosystem

---

## MODES

### Work Mode (default)
Normal development. Follow tasks, fix bugs, optimize code.

### Vision Mode
**Trigger:** "let's talk about the vision", "let's change the vision", "let's discuss strategy", "let's talk about the framework direction"

Behavior:
1. Read brief.md and current STATUS
2. Discuss with user — ask questions, challenge assumptions, propose alternatives
3. After alignment, update ALL affected files:
   - brief.md — product definition changes
   - architecture.md — if technical direction changes
   - decisions.md — log what changed and why
   - tasks.md — add/remove/reprioritize
   - progress.md — adjust milestones if needed
4. Update STATUS in CLAUDE.md
5. Print a summary of all changes made

### Review Mode
**Trigger:** "where are we?", "status?", "overview", "what's done?"

Behavior:
1. Read all files
2. Give a concise report: phase, focus, blockers, recent progress, next steps

### Decision Mode
**Trigger:** "I need to decide", "what do you think I should choose", "I have a dilemma"

Behavior:
1. Listen to the options
2. Analyze pros and cons of each
3. Give a recommendation with reasoning
4. After the decision — log in decisions.md with full context

---

## RULES

### Scope Protection
- Phase 3 = maintenance. No new features without explicit approval.
- If user proposes a new feature → "Is this maintenance or Phase 4? Logging in tasks.md as future."
- Bugfix and optimization PRs are always welcome
- Breaking changes require a decision logged in decisions.md

### Decision Tracking
- Every non-trivial decision MUST be logged in decisions.md BEFORE implementation
- Format: decision + reason + rejected alternatives + context

### Session Management
- Start of session: read STATUS and tasks.md to know where you are
- End of session: update STATUS (phase, focus, blocker, last session summary)
- If session was a vision/strategy discussion — update all affected files

### Auto-Update Rules
- **brief.md** — Changes ONLY in Vision Mode with explicit approval.
- **architecture.md** — Updated when code or technical direction changes.
- **decisions.md** — Every decision, immediately, no exceptions.
- **tasks.md** — Updated when a task is completed, added, or reprioritized.
- **progress.md** — Updated when a milestone is reached.

### Git
- Never add Co-Authored-By or any co-author lines to commit messages
- All commits are authored solely by Dejan Tomic
- Use SSH remote: git@github-onetype:onetype-ai/framework.git
- Commit style: short, lowercase, imperative, no period

### Communication
- Serbian or English, match the user
- Direct, no fluff
- When user is wrong — say it
- When user is right — confirm it
- Code style: follow existing conventions with maximum precision

---

## ELEMENTS

Shared UI elements in `lib/items/elements/`. IDs are group-prefixed. HTML tags: `<e-{id}>`.

### Form
| ID | Tag | Description |
|---|---|---|
| `form-button` | `<e-form-button>` | Button with variants, sizes, loading state |
| `form-checkbox` | `<e-form-checkbox>` | Checkbox with custom styling, indeterminate state |
| `form-field` | `<e-form-field>` | Form field wrapper with label, description, error |
| `form-input` | `<e-form-input>` | Text input with variants, sizes, types |
| `form-radio` | `<e-form-radio>` | Radio button with custom styling |
| `form-rating` | `<e-form-rating>` | Star rating input |
| `form-section` | `<e-form-section>` | Form section with title, description, border |
| `form-slider` | `<e-form-slider>` | Range slider |
| `form-textarea` | `<e-form-textarea>` | Textarea with variants, sizes |

### Global
| ID | Tag | Description |
|---|---|---|
| `global-card` | `<e-global-card>` | Content card |
| `global-code` | `<e-global-code>` | Code block display |
| `global-faq` | `<e-global-faq>` | FAQ accordion |
| `global-heading` | `<e-global-heading>` | Section heading with title, description, align |
| `global-markdown` | `<e-global-markdown>` | Markdown renderer |
| `global-notice` | `<e-global-notice>` | Notice/alert with icon, text, variant colors |
| `global-parameters` | `<e-global-parameters>` | Parameter list display |
| `global-tabs` | `<e-global-tabs>` | Tab navigation |
| `global-tags` | `<e-global-tags>` | Tag list |

### Sections
| ID | Tag | Description |
|---|---|---|
| `sections-footer` | `<e-sections-footer>` | Page footer |
| `sections-hero` | `<e-sections-hero>` | Hero section |
| `sections-navbar` | `<e-sections-navbar>` | Navigation bar |
| `sections-stats` | `<e-sections-stats>` | Statistics display |

### Status
| ID | Tag | Description |
|---|---|---|
| `status-empty` | `<e-status-empty>` | Empty state with icon, message, optional action |
| `status-error` | `<e-status-error>` | Error state with icon, message, retry button |
| `status-loading` | `<e-status-loading>` | Loading spinner with optional text, color variants |
| `status-code` | `<e-status-code>` | Status code page (404, 403, 500) with large number, message, action |

---

## FILES

| File | Purpose | When it changes |
|---|---|---|
| brief.md | What, for whom, why, vision, competition | Vision Mode, with approval |
| architecture.md | Living technical overview of the system | When code/tech stack changes |
| decisions.md | Decision + why + rejected alternatives | Every decision, immediately |
| tasks.md | Active tasks, granular | When task is added/completed/changed |
| progress.md | Milestones, what's done | When a milestone is reached |
