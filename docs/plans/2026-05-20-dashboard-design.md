# Dashboard & History Storage Design

## 1. Goal
Add client-side history using `svelte-idb` to prevent loss of past rounds, and expose a `/dashboard` route that lists these rounds (including the user's locked-in guess and the innocent answer). Maintain the "Option B" minimalist aesthetic.

## 2. Architecture & Data Flow
- **Package:** `svelte-idb`
- **Database Schema:**
  - Database: `blush-banter-db`
  - Store: `rounds`
    - `id`: Auto-incrementing primary key.
    - `riddle`: The full riddle object (clue, answer, topic, etc.).
    - `userGuess`: The filthy guess entered by the user.
    - `createdAt`: Timestamp.
- **Save Trigger:** In `src/routes/guess/+page.svelte`, the `revealAnswer()` function will invoke `db.rounds.add(...)`.

## 3. UI / Components
- **Route:** `src/routes/dashboard/+page.svelte`
- **Component:** A clean Data Table built using `shadcn-svelte` (`Table`, `TableRow`, `TableCell`, etc.).
- **Data Fetching:** Use `db.rounds.liveAll()` to get a reactive list of history.
- **Design:** Minimalist. No emojis. Just clean typography comparing the "Scandalous Clue", "Your Filthy Guess", and "Innocent Answer".
- **Navigation:** Add a link to the Dashboard in the `guess` page or main landing page so users can view their history.

## 4. Next Steps
1. Install `svelte-idb` and `shadcn-svelte` Table components.
2. Define the schema in `src/lib/db.ts`.
3. Hook up the mutation in `src/routes/guess/+page.svelte`.
4. Build the `/dashboard` route.