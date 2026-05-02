---
title: "Blushing Riddles Tasks"
status: draft
owner: "@github-handle"
tags: [tasks, implementation, sveltekit]
estimated_time: "4-8 hours"
prototype: false
---

# Execution Tasks

[← Back to Plan](./README.md)

---

## Phase 1 — Content definition

- [ ] Write a short content policy for acceptable riddles
- [ ] Define the review rubric for approved / needs-edit / rejected
- [ ] Create the first 25 seed riddles by hand or with AI + review
- [ ] Decide the supported topic categories

## Phase 2 — SvelteKit foundation

- [ ] Create the SvelteKit app structure
- [ ] Add Tailwind styling and a bold visual theme
- [ ] Build the card component with flip animation
- [ ] Create the main game page and basic routing

## Phase 3 — Backend and data

- [ ] Set up Supabase or Prisma-backed storage
- [ ] Add server routes for fetching curated riddles
- [ ] Add a safe generation endpoint for custom topics
- [ ] Store generation logs and review status

## Phase 4 — Safety and fallback

- [ ] Add moderation or server-side topic validation
- [ ] Define the refusal fallback path
- [ ] Prevent unsafe prompts from reaching the model
- [ ] Add a small blocklist for risky inputs

## Phase 5 — Polish and launch

- [ ] Add sound or motion feedback for correct reveals
- [ ] Make the UI responsive for mobile and desktop
- [ ] Test the game with a few real users
- [ ] Measure whether the tone stays playful but clean
- [ ] Deploy to Vercel

---

## Definition of done

The plan is ready to ship when:
- the seed library is good enough to play without generation
- custom generation works for safe topics
- the app never breaks when the model refuses
- the experience feels fast, polished, and playful

---

## Related Documents

- [Plan Overview](./README.md)
- [Research Notes](./research.md)
- [Architecture](./architecture.md)
