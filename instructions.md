# Agent Instructions Guide

How to write effective instructions for OneType agents.

## Core Principles

### 1. Every word biases the model

If your instruction mentions a concept, the model will lean toward it. "Confirmations are action" makes the model classify confirmations as action even when wrong. If a word appears in the instruction, the model treats it as a signal.

### 2. Define what the target IS, not what it ISN'T

Negative rules ("never do X") are weaker than positive definitions ("Y requires ALL of: A, B, C"). The model follows checklists better than prohibitions.

### 3. Use concrete criteria, not vague thresholds

Bad: "Default to chat unless score is 98 or above"
Good: "action requires ALL of: a verb, a concrete data object, and enough detail to execute without follow-up questions"

Numeric thresholds are arbitrary and the model will hit them whenever it wants to justify a decision.

### 4. Keep instructions short

Every extra rule is a potential contradiction. 4-5 lines is ideal. If you need more, the task is too ambiguous.

### 5. No examples in framework agents

Framework agents are reusable across apps. Examples like "if they say hi" bind the agent to one context. Use generic rules that work everywhere.

### 6. Reasoning before classification

For classification agents, add a `reasoning` field BEFORE the classification field in the output schema. This forces the model to think before deciding, which dramatically reduces misclassification.

```js
output: {
    reasoning: { type: 'string', description: 'Brief explanation' },
    type: { type: 'string', options: ['chat', 'action'] }
}
```

## Agent Type Settings

### Classification agents (deterministic output)

```js
temperature: 0,
top_k: 1,
top_p: 1,
tokens: 200
```

Zero randomness. Same input = same output. Tokens slightly higher to accommodate reasoning.

### Conversational agents (natural language)

```js
temperature: 0.4,
top_k: 40,
top_p: 0.9,
tokens: 2000
```

Slight creativity for natural feel without being random.

### Planning/analysis agents (structured output)

```js
temperature: 0.1,
top_k: 40,
top_p: 0.9,
tokens: 8000
```

Low creativity, high token budget for complex structured responses.

## Instruction Patterns

### Classification

```
- Classify X as "A" or "B"
- Default to "A"
- "B" requires ALL of: [concrete checklist]
- "B" only applies to [narrow scope]
- [Anything about the assistant itself] is always "A"
```

Key: define the rare class strictly. The default class catches everything else.

### Conversation

```
- Match the tone and length of the user message
- Never volunteer [specific thing] unless explicitly asked
- Never fabricate [specific thing]
```

Key: prevent over-sharing. Models default to being helpful which means verbose.

### Task planning

```
- [Confidence check before acting]
- Every value must come from [explicit source]
- If a required value is missing, [specific fallback behavior]
- One task = one action
```

Key: prevent hallucinated values. Models will invent IDs and names if not constrained.

## Common Mistakes

| Mistake | Why it fails | Fix |
|---|---|---|
| Numeric thresholds | Model hits the number to justify any decision | Use concrete checklists |
| Mentioning the unwanted class | Biases model toward it | Define wanted class strictly, default to other |
| Long instruction lists | Contradictions between rules | Keep to 4-5 lines |
| Examples in framework code | Binds to one context | Generic rules only |
| "Be helpful" / "Be friendly" | Model over-shares | "Match tone and length of user" |
| Relying on instructions alone | Input data leaks context | Control what data reaches the agent |

## Data Leakage

Instructions are not enough if the input data biases the model. If you send a list of agent capabilities as input, the model will mention them regardless of instructions telling it not to.

Fix: only send data the agent actually needs. If a chat agent doesn't need to know about available agents, don't send them.
