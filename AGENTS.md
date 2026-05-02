## Blush Banter Instructions

- Prefer action over questions; only ask when a decision is genuinely required.
- Keep changes minimal and localized to the files needed for the task.
- Use Bun for package management and task running.
- Do not edit `package.json` directly when installing packages; use `bun add` or `bunx`.
- Format only edited files with `bunx prettier --write <file>` and verify with `bunx prettier --check <file>`.
- Run `bun run check` after substantive edits.

### SvelteKit 5

- Use Svelte 5 runes only: `$state`, `$props`, `$derived`, `$effect`, `$bindable`, and `$inspect`.
- Avoid legacy Svelte patterns such as `export let`, `$:`, `createEventDispatcher`, `$$props`, `$$restProps`, `<slot />`, and `<svelte:component>`.
- Use modern event attributes like `onclick` and `onsubmit`.
- Prefer `$app/state` over `$app/stores`.
- For Svelte components and modules, consult the official Svelte MCP docs and run the Svelte autofixer before finalizing changes.

### Data And State

- Prefer Remote Functions in `src/lib/remote/` for reads and mutations.
- Keep remote function exports explicit in `src/lib/remote/index.ts`.
- Validate inputs with a Standard Schema library, preferably Valibot.
- Use `+page.server.ts` and `+layout.server.ts` only for initial load functions.
- Use Prisma v6 with a singleton client.

### Styling And UI

- Use Tailwind CSS v4 and semantic utility classes where possible.
- Avoid gradients; favor solid colors, clean layouts, and a minimalist visual style.
- Avoid hardcoded HSL or hex values in components when semantic tokens exist.
- Use `cn` for conditional class composition.
- Use `@lucide/svelte` for icons, never `lucide-svelte`.
- Prefer shadcn-svelte primitives and Bits UI, and generate shadcn-svelte components through the official CLI or MCP-backed workflow instead of writing them by hand.

### Project Conventions

- Keep shared UI in `src/lib/components/` and route-specific code near the route.
- Use `src/lib/components/ui/` for generated primitive UI components.
- Keep static assets in `static/`.
- Preserve existing patterns unless the task explicitly asks for a refactor.
