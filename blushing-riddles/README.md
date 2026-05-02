---
title: "Blushing Riddles"
status: draft
owner: "@github-handle"
tags: [game, sveltekit, ai, moderation, prompt-engineering]
estimated_time: "12-18 hours"
prototype: false
---

# Blushing Riddles

> **A playful party game about double-entendre riddles where the setup sounds scandalous, but the answer is always harmless.**
>
> The product should feel cheeky and surprising without crossing into explicit sexual content. The key challenge is keeping the generation pipeline safe, consistent, and fun.

---

## Problem / Opportunity

The core appeal of *Blushing Riddles* is the “mind out of the gutter” moment: players hear a misleading riddle, make a wrong assumption, and then laugh when the answer is innocently obvious.

That creates a strong product opportunity because the game is:
- easy to understand in seconds
- highly shareable in social settings
- well-suited for AI-assisted content generation
- cheap to expand once a safe content pipeline exists

The main risk is not technical difficulty; it is **content reliability**. Generic AI prompts can drift into explicit, offensive, or refusal-prone territory, so the product needs a careful framing and review process.

---

## Proposed Approach

### 1) Start with a curated seed library
Generate a fixed set of riddles in batches, then review them by hand before they ever reach users.

This keeps launch quality high and avoids relying on real-time generation for every request.

### 2) Treat generation as a safe wordplay problem
Frame the model task as a linguistic puzzle:
- everyday objects or scenarios
- misleading but technically accurate phrasing
- clean answers with no explicit content
- consistent tone and difficulty levels

### 3) Add moderation and fallback paths
For any user-submitted topic:
- check input with moderation or safety filters
- generate only from approved topic shapes
- fall back to stock riddles if generation fails or is refused

### 4) Build a lightweight SvelteKit app
Use SvelteKit for both UI and server-side generation endpoints.
A card-flip interface, playful animations, and a fast API-backed content feed are enough for an MVP.

---

## Technical Architecture

| Layer | Recommendation | Why |
| --- | --- | --- |
| Frontend | SvelteKit + Svelte 5 | Fast UI, SSR/SEO, simple server/client sharing |
| Styling | Tailwind CSS | Quick iteration on the colorful party-game look |
| Backend | SvelteKit server routes | Keeps API keys and generation logic off the client |
| Database | Supabase Postgres or Prisma on Postgres | Store curated riddles, favorites, and generation logs |
| AI Model | GPT-4o or Claude 3.5 Sonnet | Strong at wordplay and structured generation |
| Deployment | Vercel | Straightforward SvelteKit hosting |

### Suggested runtime flow
1. User opens the game and gets a seed riddle.
2. The app serves a curated riddle from the database.
3. If the user requests a custom topic, the server validates the request.
4. A generation job creates a candidate riddle.
5. The candidate is checked, saved, and optionally queued for review.
6. If generation fails, the app falls back to stock content.

---

## Content Safety Strategy

The product should not try to “beat” moderation systems. Instead, it should reduce false positives by keeping the task clearly framed as harmless wordplay.

### Guardrails
- Avoid explicit sexual wording in prompts and UI copy
- Use neutral terms like “double entendre,” “misleading clue,” and “clean answer”
- Reject topics that are clearly inappropriate or unsafe
- Review generated output before adding it to the public seed bank
- Keep an internal blocklist for risky prompt patterns

### Quality checklist for each riddle
- The answer is unambiguously innocent
- The clue is playful but not explicit
- The riddle works without added context
- The punchline is understandable quickly
- The riddle is not offensive or discriminatory

---

## Success Criteria

- [ ] A curated seed library of at least 100 reviewed riddles exists
- [ ] Users can flip a card to reveal the answer with a smooth animation
- [ ] Topic-based generation works for safe user prompts
- [ ] Moderation or safety checks run before generation
- [ ] Failed generations fall back to stock riddles without breaking the UX
- [ ] The app is responsive on mobile and desktop
- [ ] The tone feels playful, colorful, and polished

---

## Next Actions

1. Define the content rubric and review checklist.
2. Design the SvelteKit route structure and data model.
3. Create a small seed set of hand-reviewed riddles.
4. Implement the card UI and flip animation.
5. Add safe generation + fallback handling.
6. Deploy the MVP and validate the tone with a few test users.

---

## Related Documents

- [Research Notes](./research.md)
- [Architecture](./architecture.md)
- [Execution Tasks](./tasks.md)

Back to [plans](../) | [AI-Plans root](../../)
