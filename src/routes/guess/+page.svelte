<script lang="ts">
	import { fade } from 'svelte/transition';
	import ProfileSheet from '$lib/components/profile-sheet.svelte';
	import ProfileSummaryCard from '$lib/components/profile-summary-card.svelte';
	import RiddleCard from '$lib/components/riddle-card.svelte';
	import { SpecialText } from '$lib/components/spell/special-text/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		cleanPrompt,
		hasProfileDetails,
		normalizeProfile,
		type PersonalizationProfile,
		type Riddle
	} from '$lib/data/riddles';
	import { db, PROFILE_RECORD_ID, type SavedProfile } from '$lib/db';
	import { generateRound as requestRound } from '$lib/remote';
	import { BadgeInfo, Brain, CircleAlert, Eye, RefreshCw, Target } from '@lucide/svelte';

	const roundGuide = [
		{
			label: 'Read the setup',
			copy: 'One suspicious clue at a time, written to sound dirtier than it is.',
			icon: Brain
		},
		{
			label: 'Lock a guess or skip',
			copy: 'Type an answer if you have one. If not, reveal anyway and keep the pace moving.',
			icon: Target
		},
		{
			label: 'Check the clean reveal',
			copy: 'The joke only lands if the answer stays harmless and obvious in hindsight.',
			icon: BadgeInfo
		}
	];

	const profileQuery = db.profile.liveGet(PROFILE_RECORD_ID);
	const activeProfile = $derived.by(() =>
		normalizeProfile(profileQuery.current as SavedProfile | undefined)
	);
	const hasSavedProfile = $derived(hasProfileDetails(activeProfile));

	let generationCount = $state(0);
	let revealed = $state(false);
	let loading = $state(false);
	let roundError = $state('');
	let guessInput = $state('');
	let lockedGuess = $state('');
	let currentRound = $state<Partial<Riddle> | undefined>(undefined);
	let profileSheetOpen = $state(false);
	let profilePrompted = $state(false);

	const trimmedGuess = $derived(cleanPrompt(guessInput));
	const profileCopy = $derived.by(() => {
		if (!hasSavedProfile) {
			return 'Add a quiet local profile if you want future rounds to borrow your name, vibe, and favorite topics.';
		}

		if (activeProfile.name) {
			return `Future rounds will quietly personalize for ${activeProfile.name}.`;
		}

		return 'Future rounds will quietly use your saved vibe and favorite topics.';
	});
	const statusCopy = $derived.by(() => {
		if (loading) {
			return 'The engine is drafting the next suspicious setup.';
		}

		if (roundError) {
			return roundError;
		}

		if (!currentRound) {
			return 'Start a round to get the first clue.';
		}

		if (revealed) {
			return 'Answer revealed. Load another round whenever you are ready.';
		}

		return currentRound.statusLine ?? 'Type a guess, then reveal the innocent answer.';
	});

	$effect(() => {
		if (profilePrompted || profileQuery.loading || profileQuery.error) {
			return;
		}

		// if (!hasSavedProfile) {
		// 	profileSheetOpen = true;
		// 	profilePrompted = true;
		// }
	});

	async function saveProfile(profile: PersonalizationProfile) {
		const normalized = normalizeProfile(profile);

		await db.profile.put({
			id: PROFILE_RECORD_ID,
			...normalized,
			updatedAt: Date.now()
		});

		profileSheetOpen = false;
	}

	async function generateRound() {
		const nextRound = generationCount + 1;

		generationCount = nextRound;
		revealed = false;
		roundError = '';
		guessInput = '';
		lockedGuess = '';
		loading = true;

		const draft: Partial<Riddle> = {
			promptLabel: 'The room goes quiet...',
			safetyLabel: 'AI is writing live',
			statusLine: 'DeepSeek is writing a new riddle...'
		};

		currentRound = draft;

		try {
			const round = await requestRound({
				prompt: '',
				round: nextRound,
				profile: activeProfile
			});

			currentRound = round;
		} catch (error) {
			roundError = error instanceof Error ? error.message : 'Failed to generate the next riddle.';
			currentRound = undefined;
		} finally {
			loading = false;
		}
	}

	async function revealAnswer() {
		lockedGuess = trimmedGuess;
		revealed = true;

		if (currentRound && currentRound.answer) {
			try {
				await db.rounds.add({
					riddle: currentRound as Riddle,
					userGuess: lockedGuess,
					createdAt: Date.now()
				});
			} catch (error) {
				console.error('Failed to save round history:', error);
			}
		}
	}

	function handleGuessSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!currentRound?.answer || loading || revealed) {
			return;
		}

		revealAnswer();
	}

	function handlePrimaryGuessAction() {
		if (revealed) {
			void generateRound();
			return;
		}

		void revealAnswer();
	}
</script>

<svelte:head>
	<title>Guess before the reveal | Blush Banter</title>
	<meta
		name="description"
		content="Play Blush Banter's riddle round: start, guess, and reveal the harmless answer."
	/>
</svelte:head>

<section class="space-y-8" transition:fade={{ duration: 180 }}>
	<header class="flex flex-wrap items-end justify-between gap-4">
		<div class="space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
					<span>{generationCount > 0 ? `Round ${generationCount}` : 'Ready to test your mind'}</span
					>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					<span>All innocent answers</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					<span>{hasSavedProfile ? 'Profile saved locally' : 'Profile optional'}</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					{revealed ? 'Answer open' : loading ? 'Writing' : 'Guessing'}
				</Badge>
			</div>
			<div class="space-y-2">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					How dirty is your mind?
				</p>
				<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
					Guess the harmless answer before the reveal.
				</h1>
				<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
					Read one suggestive setup, lock in a guess, and see whether your brain stayed clean or
					drifted straight into the gutter. {profileCopy}
				</p>
			</div>
		</div>

		<div class="flex flex-wrap gap-3">
			<a
				href="/"
				class="inline-flex h-11 items-center justify-center rounded-full border border-border/80 bg-card/80 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
			>
				Back to the setup
			</a>
			<a
				href="/dashboard"
				class="inline-flex h-11 items-center justify-center rounded-full border border-border/80 bg-card/80 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
			>
				History
			</a>
			<Button class="gap-2 px-5" onclick={generateRound} disabled={loading}>
				{#if loading}
					<RefreshCw class="size-4 animate-spin" />
					Summoning a scandalous clue
				{:else}
					<Eye class="size-4" />
					Start the test
				{/if}
			</Button>
		</div>
	</header>

	<div
		class="rounded-[calc(var(--radius)+0.5rem)] border border-border/80 bg-card/75 p-4 shadow-sm backdrop-blur"
	>
		<SpecialText
			text={statusCopy}
			speed={18}
			class="h-auto text-sm tracking-[0.28em] whitespace-pre-wrap text-primary uppercase sm:text-base"
		/>
	</div>

	<section class="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
		<div>
			<RiddleCard
				riddle={currentRound}
				{revealed}
				{loading}
				playerGuess={lockedGuess}
				onShuffle={generateRound}
			/>
		</div>

		<div class="space-y-4">
			<Card.Root class="border-border/80 bg-card/80 shadow-sm backdrop-blur">
				<Card.Header class="space-y-3 pb-4">
					<div class="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" class="gap-1.5 bg-secondary/70">
							<Target class="size-3.5" />
							<span>Your guess</span>
						</Badge>
						<Badge variant="outline" class="bg-background/70">
							{currentRound?.topic ?? 'Waiting for a suggestive category'}
						</Badge>
					</div>
					<Card.Title class="text-2xl font-semibold tracking-tight">Lock in your answer</Card.Title>
					<Card.Description>
						{revealed
							? 'Round complete. Compare your guess to the reveal, then move straight to the next one.'
							: 'This is the only decision that matters on this screen. Type a guess, or skip and reveal.'}
					</Card.Description>
				</Card.Header>

				<Card.Content class="space-y-6">
					<form class="space-y-4" onsubmit={handleGuessSubmit}>
						<div class="space-y-3">
							<label for="guess" class="text-sm leading-none font-medium text-foreground">
								What harmless answer do you think this points to?
							</label>
							<p class="text-sm leading-6 text-muted-foreground">
								You can leave this blank and reveal anyway. The fun is in seeing where your mind
								went.
							</p>
							<div class="flex flex-col gap-3 sm:flex-row">
								<Input
									id="guess"
									bind:value={guessInput}
									placeholder="Type the innocent answer you think fits"
									disabled={loading || revealed}
									autocomplete="off"
									class="flex-1"
								/>
								{#if revealed}
									<Button
										type="button"
										class="gap-2 sm:min-w-44"
										onclick={handlePrimaryGuessAction}
										disabled={loading}
									>
										<RefreshCw class="size-4" />
										<span>Load next round</span>
									</Button>
								{:else}
									<Button
										type="submit"
										class="gap-2 sm:min-w-52"
										disabled={!currentRound?.answer || loading}
									>
										<Eye class="size-4" />
										<span>Reveal the answer</span>
									</Button>
								{/if}
							</div>
						</div>
					</form>

					<Separator />

					<div
						class="space-y-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/70 bg-background/60 p-4"
					>
						<div class="flex items-start gap-3">
							<CircleAlert class="mt-0.5 size-4 shrink-0 text-primary" />
							<div class="space-y-1">
								<p class="text-sm font-medium text-foreground">Round status</p>
								<p class="text-sm leading-6 text-muted-foreground">{statusCopy}</p>
							</div>
						</div>
						<div class="flex items-start gap-3 border-t border-border/60 pt-3">
							<Brain class="mt-0.5 size-4 shrink-0 text-primary" />
							<div class="space-y-1">
								<p class="text-sm font-medium text-foreground">Your latest read</p>
								<p class="text-sm leading-6 text-muted-foreground">
									{lockedGuess || trimmedGuess || 'Nothing typed yet.'}
								</p>
							</div>
						</div>
					</div>

					<div
						class="space-y-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/70 bg-background/60 p-4"
					>
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<BadgeInfo class="size-4 text-primary" />
							<span>How a round works</span>
						</div>
						<div class="grid gap-3">
							{#each roundGuide as step (step.label)}
								<div class="rounded-2xl border border-border/60 bg-card/65 px-4 py-3">
									<div class="flex items-center gap-2 text-sm font-medium text-foreground">
										<step.icon class="size-4 text-primary" />
										<span>{step.label}</span>
									</div>
									<p class="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
								</div>
							{/each}
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<ProfileSummaryCard
				profile={activeProfile}
				onEdit={() => {
					profileSheetOpen = true;
				}}
				title="Optional local profile"
				description="Saved only on this device and used to nudge future rounds without taking over the screen."
			/>
		</div>
	</section>

	<ProfileSheet
		bind:open={profileSheetOpen}
		profile={activeProfile}
		onSave={saveProfile}
		title="Quiet profile, sharper rounds"
		description="Saved only on this device with svelte-idb and used to personalize new riddles without getting in the way."
	/>
</section>
