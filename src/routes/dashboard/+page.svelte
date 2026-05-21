<script lang="ts">
	import { fade } from 'svelte/transition';
	import ProfileSheet from '$lib/components/profile-sheet.svelte';
	import ProfileSummaryCard from '$lib/components/profile-summary-card.svelte';
	import { db, PROFILE_RECORD_ID, type RoundHistory, type SavedProfile } from '$lib/db';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { cleanPrompt, normalizeProfile, type PersonalizationProfile } from '$lib/data/riddles';
	import { ArrowLeft, History, Sparkles, Trash2 } from '@lucide/svelte';

	const roundsQuery = db.rounds.liveAll();
	const rounds = $derived((roundsQuery.current as unknown as RoundHistory[] | undefined) ?? []);
	const profileQuery = db.profile.liveGet(PROFILE_RECORD_ID);
	const activeProfile = $derived.by(() =>
		normalizeProfile(profileQuery.current as SavedProfile | undefined)
	);
	const roundsWithGuesses = $derived(
		rounds.filter((round) => cleanPrompt(round.userGuess).length > 0)
	);
	const latestRoundAt = $derived.by(() => {
		if (rounds.length === 0) {
			return null;
		}

		return Math.max(...rounds.map((round) => round.createdAt));
	});
	let profileSheetOpen = $state(false);

	async function saveProfile(profile: PersonalizationProfile) {
		const normalized = normalizeProfile(profile);

		await db.profile.put({
			id: PROFILE_RECORD_ID,
			...normalized,
			updatedAt: Date.now()
		});

		profileSheetOpen = false;
	}

	async function clearHistory() {
		if (confirm('Are you sure you want to clear your entire guess history?')) {
			await db.rounds.clear();
		}
	}
</script>

<svelte:head>
	<title>History Dashboard | Blush Banter</title>
	<meta name="description" content="Review your past rounds and see how dirty your mind was." />
</svelte:head>

<section class="space-y-8" transition:fade={{ duration: 180 }}>
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div class="space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					<span>Client-side storage</span>
				</Badge>
				<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
					<span>History</span>
				</Badge>
			</div>
			<div class="space-y-2">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					Dashboard
				</p>
				<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Your past rounds</h1>
				<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
					A complete record of your filthy guesses and the innocent answers.
				</p>
			</div>
		</div>

		<div class="flex flex-wrap gap-3">
			<a
				href="/guess"
				class="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/80 bg-card/80 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
			>
				<ArrowLeft class="size-4" />
				Back to guessing
			</a>
			{#if rounds.length > 0}
				<Button variant="destructive" class="gap-2 rounded-full px-5" onclick={clearHistory}>
					<Trash2 class="size-4" />
					Clear history
				</Button>
			{/if}
		</div>
	</header>

	<section class="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
		<ProfileSummaryCard
			profile={activeProfile}
			onEdit={() => {
				profileSheetOpen = true;
			}}
			title="Your saved player profile"
			description="Local-only personalization used to shape future riddles across this browser."
		/>

		<Card.Root class="border-border/80 bg-card/80 shadow-sm backdrop-blur">
			<Card.Header class="space-y-3 pb-4">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
						<History class="size-3.5" />
						<span>Session stats</span>
					</Badge>
					<Badge variant="outline" class="bg-background/70">
						<Sparkles class="size-3.5" />
						<span>{rounds.length} rounds stored</span>
					</Badge>
				</div>
				<Card.Title class="text-xl font-semibold tracking-tight"
					>A quick look at your history</Card.Title
				>
				<Card.Description>
					Your saved rounds live entirely in IndexedDB, alongside the quiet profile used for
					personalization.
				</Card.Description>
			</Card.Header>

			<Card.Content class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-2xl border border-border/70 bg-background/65 px-4 py-4">
					<p class="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
						Rounds played
					</p>
					<p class="mt-2 text-3xl font-semibold tracking-tight text-foreground">{rounds.length}</p>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">
						Total innocent-answer rounds stored on this device.
					</p>
				</div>

				<div class="rounded-2xl border border-border/70 bg-background/65 px-4 py-4">
					<p class="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
						Guesses logged
					</p>
					<p class="mt-2 text-3xl font-semibold tracking-tight text-foreground">
						{roundsWithGuesses.length}
					</p>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">
						Rounds where you actually committed a guess before the reveal.
					</p>
				</div>

				<div class="rounded-2xl border border-border/70 bg-background/65 px-4 py-4 sm:col-span-2">
					<p class="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
						Last played
					</p>
					<p class="mt-2 text-base font-medium text-foreground">
						{#if latestRoundAt}
							{new Date(latestRoundAt).toLocaleString(undefined, {
								month: 'short',
								day: 'numeric',
								hour: 'numeric',
								minute: '2-digit'
							})}
						{:else}
							No rounds yet
						{/if}
					</p>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">
						Come back here after a few rounds to review your guesses and your saved profile
						together.
					</p>
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<div
		class="rounded-[calc(var(--radius)+0.5rem)] border border-border/80 bg-card/75 p-1 shadow-sm backdrop-blur"
	>
		{#if roundsQuery.loading}
			<div class="p-8 text-center text-sm text-muted-foreground">Loading history...</div>
		{:else if roundsQuery.error}
			<div class="p-8 text-center text-sm text-destructive">Failed to load history.</div>
		{:else if rounds.length === 0}
			<div class="space-y-3 p-12 text-center">
				<p class="text-sm font-medium text-foreground">No history yet.</p>
				<p class="text-sm text-muted-foreground">
					Play a few rounds to see your dirty mind on display.
				</p>
				<a
					href="/guess"
					class="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Start playing
				</a>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<Table.Root>
					<Table.Header>
						<Table.Row class="hover:bg-transparent">
							<Table.Head class="w-[40%]">Scandalous Clue</Table.Head>
							<Table.Head class="w-[20%]">Your Filthy Guess</Table.Head>
							<Table.Head class="w-[20%]">Innocent Answer</Table.Head>
							<Table.Head class="w-[20%] text-right">Date</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each rounds.toReversed() as round (round.id)}
							<Table.Row>
								<Table.Cell class="font-medium">
									<span class="line-clamp-2" title={round.riddle.clue}>
										{round.riddle.clue}
									</span>
								</Table.Cell>
								<Table.Cell>
									{#if round.userGuess}
										<span class="text-foreground">{round.userGuess}</span>
									{:else}
										<span class="text-muted-foreground italic">No guess</span>
									{/if}
								</Table.Cell>
								<Table.Cell>
									<span class="text-primary">{round.riddle.answer}</span>
								</Table.Cell>
								<Table.Cell class="text-right text-muted-foreground">
									{new Date(round.createdAt).toLocaleDateString(undefined, {
										month: 'short',
										day: 'numeric',
										hour: 'numeric',
										minute: '2-digit'
									})}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		{/if}
	</div>

	<ProfileSheet
		bind:open={profileSheetOpen}
		profile={activeProfile}
		onSave={saveProfile}
		title="Quiet profile, cleaner dashboard"
		description="Update the local profile that powers personalization across the guessing screen and this dashboard."
	/>
</section>
