<script lang="ts">
	import { fade } from 'svelte/transition';
	import RiddleCard from '$lib/components/riddle-card.svelte';
	import { SpecialText } from '$lib/components/spell/special-text/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cleanPrompt, type PersonalizationProfile, type Riddle } from '$lib/data/riddles';
	import { generateRound as requestRound } from '$lib/remote';
	import { Eye, RefreshCw, Shield, WandSparkles } from '@lucide/svelte';

	const emptyProfile: PersonalizationProfile = {
		name: '',
		vibe: '',
		favoriteTopics: ''
	};

	const flowSteps = [
		'Start a round and test how clean your first thought is.',
		'Read the clue, guess the innocent answer, and commit.',
		'Reveal the answer and see if your mind went dirtier than the riddle.'
	];

	let generationCount = $state(0);
	let revealed = $state(false);
	let loading = $state(false);
	let roundError = $state('');
	let guessInput = $state('');
	let lockedGuess = $state('');
	let currentRound = $state<Partial<Riddle> | undefined>(undefined);

	const trimmedGuess = $derived(cleanPrompt(guessInput));
	const statusCopy = $derived.by(() => {
		if (loading) {
			return 'The engine is drafting a suspicious setup.';
		}

		if (roundError) {
			return roundError;
		}

		if (!currentRound) {
			return 'Tap start to generate the first round.';
		}

		if (revealed) {
			return 'Answer revealed. Queue another round whenever you are ready.';
		}

		return currentRound.statusLine ?? 'Type your guess, then reveal the answer.';
	});

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
				profile: emptyProfile
			});

			currentRound = round;
		} catch (error) {
			roundError = error instanceof Error ? error.message : 'Failed to generate the next riddle.';
			currentRound = undefined;
		} finally {
			loading = false;
		}
	}

	function revealAnswer() {
		lockedGuess = trimmedGuess;
		revealed = true;
	}

	function handleGuessSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!currentRound?.answer || loading || revealed) {
			return;
		}

		revealAnswer();
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
					<WandSparkles class="size-3.5" />
					<span>{generationCount > 0 ? `Round ${generationCount}` : 'Ready to test your mind'}</span
					>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					<Shield class="size-3.5" />
					<span>All innocent answers</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					{revealed ? 'Answer open' : loading ? 'Writing' : 'Guessing'}
				</Badge>
			</div>
			<div class="space-y-2">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					How clean is your mind?
				</p>
				<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
					Guess the innocent question before the reveal.
				</h1>
				<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
					Read the playful setup, type your best guess, and find out whether your mind went clean or
					dirty.
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
			<Button class="gap-2 px-5" onclick={generateRound} disabled={loading}>
				{#if loading}
					<RefreshCw class="size-4 animate-spin" />
					Summoning an innocent clue
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
			class="text-sm tracking-[0.28em] text-primary uppercase sm:text-base"
		/>
	</div>

	<section class="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr]">
		<div>
			<RiddleCard
				riddle={currentRound}
				{revealed}
				{loading}
				playerGuess={lockedGuess}
				onReveal={revealAnswer}
				onShuffle={generateRound}
			/>
		</div>

		<Card.Root class="border-border/80 bg-card/80 shadow-sm backdrop-blur">
			<Card.Header class="space-y-3 pb-4">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="secondary" class="gap-1.5 bg-secondary/70">
						<WandSparkles class="size-3.5" />
						<span>Your clean guess</span>
					</Badge>
					<Badge variant="outline" class="bg-background/70">
						{currentRound?.topic ?? 'Waiting for an innocent category'}
					</Badge>
				</div>
				<Card.Title class="text-2xl font-semibold tracking-tight"
					>Name the innocent answer</Card.Title
				>
				<Card.Description>
					{revealed
						? 'Round complete. Compare your guess, then try another one.'
						: 'Type your best guess. You can reveal with or without an entry.'}
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-6">
				<form class="space-y-4" onsubmit={handleGuessSubmit}>
					<div class="space-y-3">
						<label for="guess" class="my-2 text-sm leading-none font-medium text-foreground">
							What innocent answer are you seeing?
						</label>
						<div class="flex gap-2">
							<Input
								id="guess"
								bind:value={guessInput}
								placeholder="Type your guess here"
								disabled={loading || revealed}
								autocomplete="off"
								class="flex-1"
							/>
							<Button
								type="submit"
								class="gap-2"
								disabled={!currentRound?.answer || loading || revealed}
							>
								<Eye class="size-4" />
								<span class="hidden sm:inline">Reveal</span>
							</Button>
						</div>
					</div>
				</form>

				<Separator />

				<div class="grid gap-3 sm:grid-cols-2">
					<Card.Root class="border-border/70 bg-background/60 shadow-none">
						<Card.Header class="space-y-2 py-4">
							<Card.Title class="text-base">Round status</Card.Title>
							<Card.Description>{statusCopy}</Card.Description>
						</Card.Header>
					</Card.Root>
					<Card.Root class="border-border/70 bg-background/60 shadow-none">
						<Card.Header class="space-y-2 py-4">
							<Card.Title class="text-base">Your last entry</Card.Title>
							<Card.Description>
								{lockedGuess || trimmedGuess || 'Nothing typed yet.'}
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>

				<div>
					<Separator />
				</div>

				<div class="grid gap-3">
					{#each flowSteps as step, index (step)}
						<Card.Root class="border-border/70 bg-background/60 shadow-none">
							<Card.Header class="space-y-2 py-4">
								<Card.Description class="text-xs tracking-[0.2em] uppercase">
									Clue {index + 1}
								</Card.Description>
								<Card.Title class="text-base leading-6">{step}</Card.Title>
							</Card.Header>
						</Card.Root>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</section>
