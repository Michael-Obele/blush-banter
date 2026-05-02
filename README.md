# Blush Banter

Blush Banter is the SvelteKit home for **Blushing Riddles**, a playful party game built around cheeky double-entendre riddles with harmless answers.

The app plan is still in draft, so this repository currently serves two purposes:

- a starter SvelteKit codebase for the game UI and server routes
- a planning hub for the product, research, architecture, and implementation tasks

## Project Plan

The detailed plan lives in the [blushing-riddles](blushing-riddles/README.md) folder:

- [Plan Overview](blushing-riddles/README.md)
- [Research Notes](blushing-riddles/research.md)
- [Architecture](blushing-riddles/architecture.md)
- [Execution Tasks](blushing-riddles/tasks.md)

## What the MVP Should Do

The initial version focuses on a small, safe loop:

1. show a curated riddle card
2. let the player flip it to reveal the answer
3. optionally generate new riddles from safe topics through a protected server endpoint
4. fall back to stock content if generation is refused or unsafe

## Developing

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

Open a browser tab automatically if you want the app to launch on start:

```sh
npm run dev -- --open
```

## Building

Create a production build with:

```sh
npm run build
```

Preview the production output with:

```sh
npm run preview
```

## Notes

- The repo uses SvelteKit, TypeScript, Tailwind CSS, ESLint, and Prettier.
- The product direction emphasizes safe wordplay, curated seed content, and a polished reveal interaction.
- Deployment is planned for Vercel, with generated content stored in Postgres-backed storage.

> If you are looking for the product strategy, start with the [plan overview](blushing-riddles/README.md).
