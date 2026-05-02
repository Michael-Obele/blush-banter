---
title: "Blushing Riddles Architecture"
status: draft
owner: "@github-handle"
tags: [architecture, sveltekit, database, ai]
estimated_time: "2-4 hours"
prototype: false
---

# Architecture

[← Back to Plan](./README.md)

---

## High-level system shape

Blushing Riddles should be a small SvelteKit app with three responsibilities:

1. render the game UI
2. serve curated riddles from the backend
3. optionally generate new riddles through a protected server endpoint

Keeping these responsibilities inside SvelteKit makes the MVP simpler to maintain.

---

## Suggested route structure

- `src/routes/+page.svelte` — landing page and featured riddle
- `src/routes/play/+page.svelte` — main game experience
- `src/routes/api/riddles/+server.ts` — fetch random curated riddles
- `src/routes/api/generate/+server.ts` — safe topic-based generation
- `src/routes/api/favorites/+server.ts` — save liked riddles
- `src/lib/server/riddles.ts` — content selection and storage helpers
- `src/lib/server/moderation.ts` — safety checks and refusal handling
- `src/lib/components/RiddleCard.svelte` — flip card UI

You can keep this even smaller for the first version if needed.

---

## Data model

### `riddles`
- `id`
- `prompt`
- `answer`
- `topic`
- `difficulty`
- `tone`
- `source` (`seed`, `generated`, `manual`)
- `status` (`approved`, `needs-edit`, `rejected`)
- `created_at`

### `generation_requests`
- `id`
- `topic`
- `user_text`
- `moderation_status`
- `model_name`
- `result_status`
- `error_message`
- `created_at`

### `favorites`
- `id`
- `riddle_id`
- `user_id` or session identifier
- `created_at`

If user accounts are not needed, keep favorites session-based for the MVP.

---

## Request flow

### Seeded riddle flow
1. Client requests a riddle.
2. Server returns a random approved entry.
3. Client renders the front of the card.
4. User flips the card to reveal the answer.

### Custom generation flow
1. User submits a topic.
2. Server validates the topic.
3. Moderation or safety checks run.
4. The model generates one or more candidates.
5. The server validates the output.
6. Approved results are stored and returned.
7. If anything fails, the server returns a stock riddle instead.

---

## UI notes

The card component should be deliberately simple:
- front: riddle text
- back: answer and short explanation
- tap or click to flip
- colorful gradient background
- small particle or shake animation on reveal

The most important interaction is the reveal moment, so the UI should prioritize clarity and motion over complexity.

---

## Deployment notes

- Use Vercel for the first deployment target
- Keep API keys in environment variables only
- Store generated content in Supabase or Postgres
- Add rate limiting to the generation endpoint
- Log refusal cases so you can tune prompts later

---

## Related Documents

- [Plan Overview](./README.md)
- [Research Notes](./research.md)
- [Execution Tasks](./tasks.md)
