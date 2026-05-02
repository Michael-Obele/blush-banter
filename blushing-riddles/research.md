---
title: "Blushing Riddles Research Notes"
status: draft
owner: "@github-handle"
tags: [research, ai, moderation, prompt-engineering]
estimated_time: "2-4 hours"
prototype: false
---

# Research Notes

[← Back to Plan](./README.md)

---

## Why seeded content matters

For this kind of game, live generation is useful, but a curated seed bank is safer and more reliable.

A seed bank gives you:
- predictable quality
- lower cost per play session
- fewer safety edge cases
- the ability to hand-pick the funniest results

This is especially important because the core joke depends on tone. If the riddle is too explicit, too weak, or too ambiguous, the joke lands badly.

---

## Prompt design principles

The safest framing is to treat the request as a **wordplay puzzle** rather than a provocative prompt.

Recommended constraints:
- everyday objects only
- clean answers only
- no explicit body references in the prompt text
- no sexualized instructions
- no hateful, discriminatory, or humiliating content
- keep the output short and readable

### Good prompt shape
> Write a playful riddle about an everyday object. The clue should sound surprising or slightly mischievous, but the answer must be completely innocent. Keep it concise and avoid explicit content.

### Better generation inputs
- object list: toaster, tea bag, umbrella, key, glove, vacuum cleaner
- tone: playful, cheeky, family-friendly
- difficulty: easy / medium / hard
- output format: riddle + answer + one-line rationale

---

## Few-shot examples

A few reviewed examples are better than a vague one-line prompt.

Use a small set of examples to establish:
- length
- cadence
- balance between misdirection and clarity
- acceptable boundaries

This reduces variance and makes the output more consistent across model calls.

---

## Moderation and refusal handling

A generation pipeline should assume that some requests are not suitable.

### Recommended behavior
1. Validate the user’s topic on the server.
2. If it is outside the game’s safe scope, reject it early.
3. If the model refuses, do not keep re-trying with increasingly clever wording.
4. Serve a stock riddle instead.

The goal is a smooth user experience, not forcing the model into unsafe territory.

---

## Review rubric

Each generated riddle should pass all of these checks:
- innocent answer
- playful misdirection
- no explicit sexual content
- no hateful or demeaning content
- understandable without explanation
- funny enough to be worth keeping

A simple three-state review system works well:
- `approved`
- `needs-edit`
- `rejected`

---

## Research conclusion

The best version of *Blushing Riddles* is not an “AI that says risky things.”
It is a polished wordplay game with a safe generation pipeline, human curation, and reliable fallback content.

That approach protects the product, keeps the tone consistent, and makes the game easier to ship.

---

## Related Documents

- [Plan Overview](./README.md)
- [Architecture](./architecture.md)
- [Execution Tasks](./tasks.md)
