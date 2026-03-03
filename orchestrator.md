# Orchestrator Research & Analysis

Research and implementation notes. Updated March 3, 2026.

---

## Architecture

### State Machine Loop

```
while steps < max:
  1. done       → skip on empty history, checks if task is complete
  2. agent+goal → merged: selects next agent + writes goal (1 LLM call)
  3. input      → extracts literal values from goal
  4. execute    → runs the actual agent
  5. conclusion → summarizes what happened
  → push to history, loop
```

Each step = 4 LLM calls (was 6). First iteration = 3 calls (done skipped).

### Files

| File | Purpose |
|------|---------|
| `orchestrator/addon.js` | Addon: id, data, task, steps, agents, status, state, hooks |
| `orchestrator/item/functions/run.js` | Main loop with always-on colored logging, per-call token tracking, elapsed time |
| `orchestrator/item/functions/state/done.js` | Calls orchestrator-done, derives total/confirmed from actions array |
| `orchestrator/item/functions/state/agent.js` | Calls orchestrator-agent, sets state.agent + state.goal + agent ID validation |
| `orchestrator/item/functions/state/goal.js` | UNUSED — merged into agent.js |
| `orchestrator/item/functions/state/input.js` | Calls orchestrator-input, extracts values, DataDefine |
| `orchestrator/item/functions/state/execute.js` | Runs agent via agents.ItemGet(state.agent).Fn('run') |
| `orchestrator/item/functions/state/conclusion.js` | Calls orchestrator-conclusion, reads result.conclusion |
| `orchestrator/item/functions/state/summary.js` | Calls orchestrator-summary after task complete |
| `orchestrator/items/agents/done.js` | Agent: actions array [{action, confirmed}], done boolean |
| `orchestrator/items/agents/agent.js` | Agent: selects next agent + writes goal + reason field |
| `orchestrator/items/agents/goal.js` | UNUSED — merged into agent.js |
| `orchestrator/items/agents/input.js` | Agent: extracts literal values from goal text |
| `orchestrator/items/agents/conclusion.js` | Agent: dense paragraph, all fields/values from output, task-aware |
| `orchestrator/items/agents/summary.js` | Agent: final user-facing summary, max 40 words |

### Agents & Providers

| File | Purpose |
|------|---------|
| `agents/addon.js` | Agent addon: id, name, description, instructions, tokens, provider, model, input, output, callback, hooks |
| `agents/item/functions/run.js` | Build payload, call provider, parse JSON, validate, return |
| `agents/functions/parse.js` | Balanced-brace JSON extraction, smart quote cleaning |
| `providers/addon.js` | Provider: id, endpoint, key, model, models, hooks |
| `providers/item/functions/request.js` | HTTP fetch with retry, timeout, think tag handling |
| `providers/items/nue.js` | Provider definitions |
| `providers/functions/default.js` | Default provider selection |

### Current Provider

**llama-server** serving Qwen3.5-27B Q4_K_M (bartowski GGUF) on RTX 3090.
- Endpoint: `http://localhost:8000/v1/chat/completions`
- Model: `Qwen_Qwen3.5-27B-Q4_K_M`
- Thinking: disabled (`--chat-template-kwargs '{"enable_thinking": false}'`)
- Config: `-ngl 99 -c 65536 -np 4 -fa on`
- Speed: ~35 t/s single request, ~15 t/s per slot with 4 parallel
- `response_format: { type: 'json_object' }`, `presence_penalty: 1.5`

### How Agent Execution Works

1. Input validated via `onetype.DataDefine`
2. Payload: system prompt + synthetic conversation + output schema
3. `response_format: { type: 'json_object' }` — NOT tool calling
4. Provider HTTP call with single retry
5. JSON extracted via balanced-brace parser
6. Callback mutates output if defined, then validate
7. `_meta` attached with tokens/time/tps

---

## Implemented Fixes (March 3, 2026)

### Round 1 — Core Optimizations

| Fix | File | Impact |
|-----|------|--------|
| Skip done on empty history | run.js | 1 LLM call saved per run |
| Merge agent+goal into one call | agent.js (state + prompt) | 1 LLM call saved per step (~25%) |
| Agent ID validation | agent.js (state) | Prevents crash on hallucinated IDs |
| Added `reason` field | agent.js (prompt) | Forces justification, reduces mistakes |
| Explicit remaining counts in conclusion | conclusion.js (prompt) | Prevents unnecessary recheck steps |
| Compact instructions (~50% shorter) | All orchestrator agent prompts | Less instruction tokens, faster prefill |
| Fixed debug log | run.js | Was logging same object twice |

### Round 2 — Logging, Instructions, Done Stability

| Fix | File | Impact |
|-----|------|--------|
| Always-on colored logging | run.js | Replaced _debug flag with always-on per-step logging (agent/input/exec/concl/done) with ANSI colors, per-call token tracking, elapsed time |
| Conclusion output field renamed | conclusion.js (prompt + state) | `summary` → `conclusion` — fixes naming mismatch (bug #8) |
| Conclusion instructions genericized | conclusion.js (prompt) | No examples, no specific field names. Dense paragraph, all fields/values, task-aware. Max 60 words |
| Done agent: actions array | done.js (prompt + state) | Output changed from `total/confirmed/done` to `actions[{action,confirmed}]/done`. Stable counting — total no longer fluctuates |
| Done agent: listings excluded | done.js (prompt) | Only mutating actions counted (create/update/delete/add/remove). Listings are not actions |
| Done logging: pending actions | run.js | Shows `3/6 pending: add font, create site` instead of raw total/confirmed |
| All instructions genericized | All orchestrator agents | No examples, no numbered lists, no specific field names. Pure generic rules |
| Agent reason description tightened | agent.js (prompt) | "One sentence: why this agent now" |
| Summary compacted | summary.js (prompt) | Max 40 words, 200 tokens |
| Input instructions compacted | input.js (prompt) | Removed examples, 300 tokens |

**Results:**
- 6-step test: 66s → 54s (18% faster), 24.5K → 22K input tokens (10% less)
- 11-step test: 11 steps correct, 42K input / 2.7K output, 137s
- Done agent total stable at 6/6 throughout entire 11-step run (was fluctuating 6→12→7)

---

## Bugs — Remaining

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| 1 | No per-step error recovery | High | TODO |
| 2 | `request.js` — onBefore/onAfter no null check | Low | Dormant |
| 3 | `request.js` — timeout field not in schema | Low | Dormant |
| 4 | `default.js` — random provider selection | Low | Dormant |
| 5 | `test.js` — font ID uses length+1 | Low | Test only |
| 6 | No agent oscillation prevention | Medium | TODO |
| 7 | No `onSummary` hook | Low | TODO |
| 8 | ~~Conclusion output `summary` stored as `state.conclusion`~~ | ~~Low~~ | ✅ FIXED |

---

## Prompt Design Principles

- **All instructions must be generic** — no examples, no specific field names, no numbered lists
- **Description = contract** — output field descriptions guide the LLM more than instructions
- **Conclusion is memory** — must preserve every field/value from output, task-aware for relevance
- **Done counts only mutations** — listings/reads are not actions, prevents inflated totals
- **Actions array > total/confirmed** — forces LLM to enumerate before deciding, stabilizes counting
- **Agent description = API docs for LLM** — invest in precise descriptions
- **`reason` field** forces justification, reduces hallucinations
- **ONE ACTION, ONE TARGET** per goal
- **json_object > tool calling** for deterministic orchestrator

---

## Model Research

### Engine Support for Qwen3.5-27B (March 3, 2026)

| Engine | Status | Verdict |
|--------|--------|---------|
| **llama.cpp** | Stable (b8192+), ~35 t/s, OpenAI API, GBNF grammar | ✅ IN USE |
| **Ollama** | Works, Q4_K_M default, ~15-25 t/s, no parallel requests | Backup |
| **SGLang** | AWQ broken (#19406 Marlin bug), GGUF broken | Wait 2-4 weeks |
| **vLLM** | v0.17 not released, nightly hangs | Wait |

### Quantization

| Format | VRAM (27B) | Quality | Speed |
|--------|-----------|---------|-------|
| Q4_K_M | 17GB | ~92-95% | ~35 t/s |
| Q5_K_M | 19.6GB | ~95-99% | ~33 t/s |
| AWQ 4-bit | 14GB | ~92-95% (worse on Qwen3) | Needs vLLM/SGLang |

Hybrid architecture (Gated DeltaNet) is more quantization-friendly — no attention sinks in 75% of layers.

### VRAM Budget (24GB, Q4_K_M)

| Context | VRAM | Free |
|---------|------|------|
| 8K | ~17GB | ~7GB |
| 32K | ~18GB | ~6GB |
| 65K | ~20GB | ~4GB |
| 131K | ~24GB | 0 (limit) |

### Key Model Settings

- `presence_penalty: 1.5` — prevents repetition loops
- `enable_thinking: false` — disabled on server, saves ~6.5x tokens
- `temperature: 0.15` — low for deterministic agent selection

### Thinking Mode

ON by default. Generates `<think>` tags. Disabled via `--chat-template-kwargs '{"enable_thinking": false}'` on llama-server. Thinking + json_object are mutually exclusive on some APIs. For orchestrator sub-agents: always disable.

### Future: SGLang Migration

When SGLang fixes AWQ (#19406), switch for:
- **RadixAttention** — 2-5x prefill speedup for shared prompt prefixes (75-90% cache hit)
- **XGrammar** — constrained JSON decoding, 10x faster than alternatives
- Migration = change endpoint URL only (both are OpenAI-compatible)

### Future: 2x RTX 3090

Q5_K_M (19.6GB) + 48GB total = 64K+ context with headroom. Tensor split automatic in llama.cpp.
Estimated 11-step performance: ~65s (vs 137s on 1x 3090). With SGLang prefix caching: ~40s.

---

## Test Results

### Qwen3.5-27B Q4_K_M on llama-server (March 3, 2026)

**Curl tests — 9/9 correct:**

| Test | Tokens | Time | Result |
|------|--------|------|--------|
| Agent selection (simple) | 45 | 1.3s | ✅ |
| Agent selection (history) | 33 | 0.9s | ✅ |
| Done check | 18 | 0.5s | ✅ |
| Input extraction | 15 | 0.4s | ✅ |
| Conclusion (ID preservation) | 125 | 3.6s | ✅ All IDs preserved |
| Agent selection (step 10, 3 Roboto) | 39 | 1.1s | ✅ |
| Sub-task prioritization | 67 | 1.9s | ✅ |
| Done check (complete) | 33 | 0.9s | ✅ done:true |
| Hallucination (impossible task) | 15 | 0.4s | ✅ null, no hallucination |

**Mega test (30-step history, 1400 token prompt):** Correctly identified missing service cards in 3-col grid layout.

### 6-step chat test (post-optimization)

Task: Publish Portfolio, rename to Creative Portfolio, add Inter 300, delete Archive page from Blog.

| Run | Steps | Time | Input | Output | Result |
|-----|-------|------|-------|--------|--------|
| 1 (pre-compact) | 6 | 66.0s | 24,615 | 1,112 | ✅ |
| 2 (pre-compact) | 6 | 64.7s | 24,495 | 1,095 | ✅ |
| 3 (post-compact) | 6 | 53.9s | 22,054 | 797 | ✅ |

### 11-step chat test (post-optimization)

Task: Rename Blog to Tech Blog, remove Merriweather, delete Shop drafts, remove Roboto fonts, add Open Sans 400, create Docs site.

| Version | Steps | Time | Input | Output | Done stability | Result |
|---------|-------|------|-------|--------|----------------|--------|
| Pre-optimization (5 runs) | 11 | ~90s | ~45K | ~1.2K | Fluctuating (6→12→7) | 2/5 strict, 5/5 correct |
| Post-compact (no actions) | 11 | 94s | 41K | 1.2K | Fluctuating | ✅ correct |
| Post-actions array | 11 | 137s | 42K | 2.7K | Stable 6/6 | ✅ correct |

---

## Deferred Ideas

- **Task Splitting** — top-level LLM splits into independent sub-tasks, each gets own run
- **Refs System** — conclusion tags data with `@key`, input resolves `@`-prefixed values
- **Agent Type Field** — `list`, `get`, `create`, `update`, `remove` types for ordering hints
- **History Pruning** — summarize old entries at 20+ steps, keep last 5 in full

---

## Next Steps

1. **Run 11-step test 5x** with final prompts — verify consistency
2. **Per-step retry** — try/catch around execute, 1 retry on parse failure
3. **Stuck detection** — same actions 3x = force escalation
4. **Monitor SGLang** — #19406 fix for AWQ migration
5. **2x RTX 3090** — Q5_K_M for quality + speed boost
