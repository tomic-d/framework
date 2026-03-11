# Orchestrator

## Architecture

### Flow

```
1. classify    → "chat" or "action" (1 LLM call)
2a. chat mode  → chat agent responds, streams tokens, stores raw history
2b. action mode:
    while steps < max:
      1. tasks       → returns next batch of independent tasks (1 LLM call)
         → confidence < 95: ask clarifying question, break
         → empty tasks: break
         → repeated tasks 2x: stuck detection, break
      2. per task (parallel within batch, concurrency-limited):
         a. properties → maps task text to agent input schema (1 LLM call)
         b. execute    → runs the actual agent (1+ LLM calls)
         c. conclusion → deterministic code: merges properties + execution into "[agent_id] Executed <task>. key=value, ..." (0 LLM calls)
         d. on error   → catch, write "[agent_id] Failed: <error>" as conclusion, continue
      3. push conclusions to history, loop
    3. summary   → deterministic code: joins all conclusions with semicolons (0 LLM calls)
```

### Files

| File | Purpose |
|------|---------|
| `orchestrator/addon.js` | Addon fields: id, prompt, agents, data, status, state, history, concurrency, steps, provider, callbacks |
| `orchestrator/load.js` | Imports all items and functions |
| `orchestrator/item/functions/run.js` | Entry point: creates state, classifies, routes to mode |
| `orchestrator/item/functions/state.js` | Creates state object from item fields |
| `orchestrator/item/functions/emit.js` | Calls item callbacks by name |
| `orchestrator/item/functions/history.js` | Pushes entries to item history |
| `orchestrator/item/functions/modes/chat.js` | Chat mode: runs chat agent, stores history, emits done |
| `orchestrator/item/functions/modes/action.js` | Action mode: task loop, batch execution, summary |
| `orchestrator/item/functions/agents/classify.js` | Calls orchestrator-classify agent |
| `orchestrator/item/functions/agents/chat.js` | Calls orchestrator-chat agent with streaming |
| `orchestrator/item/functions/agents/tasks.js` | Calls orchestrator-tasks agent, maps results to agent objects |
| `orchestrator/item/functions/agents/properties.js` | Calls orchestrator-properties agent, sets state.properties |
| `orchestrator/item/functions/agents/execute.js` | Runs the actual user-defined agent |
| `orchestrator/item/functions/agents/conclusion.js` | Action: deterministic code builds conclusion from properties+execution. Chat: calls orchestrator-conclusion-chat agent |
| `orchestrator/item/functions/agents/summary.js` | Deterministic code: joins prompt + all conclusions with semicolons |

### Built-in Agents

| Agent ID | Purpose | Format | Tokens |
|----------|---------|--------|--------|
| `orchestrator-classify` | Routes prompt to chat or action mode | json | 200 |
| `orchestrator-chat` | Conversational responses with streaming | text | 2000 |
| `orchestrator-tasks` | Plans next batch of independent tasks | json | 2000 |
| `orchestrator-properties` | Maps task text to agent input schema (dynamic output) | json | 1000 |
| `orchestrator-conclusion-action` | DEPRECATED — built deterministically in code. Merges properties + execution into key=value string | — | — |
| `orchestrator-conclusion-chat` | One-line record of chat exchange | json | 400 |
| `orchestrator-summary` | DEPRECATED — built deterministically in code. Joins all conclusions with semicolons | — | — |

### Provider

**Nue Tools** serving Qwen 3.5 9B full precision.
- Endpoint: `https://nue.tools.divhunt.com/api/run/ai-chat`
- Model: `qwen3.5-9b`
- JSON schema enforced via XGrammar (field order matters, reasoning first)
- Thinking: disabled for orchestrator sub-agents

### Nue API Format

```js
// Request
{
    messages: [{role, content}],
    tokens: 2000,
    temperature: 0.15,
    top_p: 0.8,
    top_k: 20,
    presence_penalty: 1.5,
    json_schema: { type: 'object', properties: {...}, required: [...], additionalProperties: false },
    thinking: false,
    stream: false
}

// Response
{
    data: {
        response: '...',
        thinking: null,
        usage: { prompt_tokens, completion_tokens, total_tokens }
    },
    code: 200,
    time: '904.55'
}
```

### How Agent Execution Works

1. Input validated via `onetype.DataDefine`
2. System prompt built: base identity + instructions + strict rules + context + input/output field descriptions + format
3. History mapped: `conclusion` → user role with `[agent_id]` prefix, `summary` → user role with `[summary]` prefix
4. Data serialized as JSON in final user message
5. `json_schema` enforces output structure via XGrammar constrained decoding
6. Provider HTTP call (120s timeout)
7. JSON parsed from response (with error handling)
8. Output validated via `onetype.DataDefine` against schema
9. `_meta` attached with tokens/time/tps/reasoning

### Schema Mapping (Framework → JSON Schema)

Agent output fields use framework conventions, schema builder converts for API:
- `config` → `properties`
- `each` → `items`
- `options` → `enum`
- `each.config` → `items.properties` + auto `required` from keys
- `required: false` → `type: [type, 'null']`
- `additionalProperties: false` set on all objects

---

## Key Design Decisions

- **Classify first** — single LLM call determines mode before any work
- **json_schema + XGrammar** — constrained decoding enforces structure, no parsing heuristics needed
- **Field order matters** — reasoning/analysis fields BEFORE answer/result fields in all schemas
- **Tasks agent plans iteratively** — called in a loop, only returns what can run NOW with available data
- **Batch parallelism** — independent tasks within a batch run concurrently (up to concurrency limit)
- **Conclusions are the memory** — one-line records with ALL field=value pairs, prefixed with [agent_id]
- **Summary compresses conclusions** — verbatim copy of all conclusions, separated by semicolons
- **Properties agent has dynamic output** — output schema generated from target agent's input config
- **History uses role mapping** — conclusions/summaries sent as user messages with prefixes, not assistant
- **Numbered rules in instructions** — `#1.`, `#2.` etc. for small model instruction following
- **No synthetic conversations** — system prompt + history + user data, no fake examples

---

## Callbacks

| Name | Data | When |
|------|------|------|
| `onClassify` | `{ mode }` | After classify determines chat/action |
| `onChat` | `{ state, stream, token }` | During streaming (stream=true) and after completion (stream=false) |
| `onTasks` | `{ tasks, message, state }` | After tasks agent returns a batch (or empty = done) |
| `onStep` | `{ agent, task, status, conclusion }` | When a task starts (status=running) and completes (status=done) |
| `onConclusion` | `{ conclusion, mode }` | After conclusion agent summarizes a step |
| `onSummary` | `{ summary }` | After summary agent compresses the run |
| `onSuccess` | `{ state }` | Run completed successfully |
| `onFail` | `{ error, state }` | Run failed |

---

## Bugs — Remaining

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| 1 | No per-step error recovery | High | TODO |
| 2 | No agent oscillation prevention | Medium | TODO |

---

## Next Steps

1. **Per-step retry** — try/catch around execute, 1 retry on parse failure
2. **Stuck detection** — same tasks 3x = force break
3. **Chat conclusion** — optionally compress chat history for long conversations
