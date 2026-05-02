<script lang="ts">
	import { fade } from 'svelte/transition';
	import { MorphingText } from '$lib/components/magic/morphing-text/index.js';
	import RiddleCard from '$lib/components/riddle-card.svelte';
	import { Signature } from '$lib/components/spell/signature/index.js';
	import { SpecialText } from '$lib/components/spell/special-text/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cleanPrompt, type PersonalizationProfile, type Riddle } from '$lib/data/riddles';
	import { generateRound as requestRound } from '$lib/remote';
	import { Eye, Play, RefreshCw, Shield, Sparkles, WandSparkles } from '@lucide/svelte';

	const heroWords = ['clean', 'dramatic', 'harmless', 'ridiculous'];
	const flowSteps = [
		'Start a round with one click.',
		'Read the setup and type your guess.',
		'Reveal the answer and compare.'
	];
	const emptyProfile: PersonalizationProfile = {
		name: '',
		vibe: '',
		favoriteTopics: ''
	};

	let generationCount = $state(0);
	let started = $state(false);
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

		if (!started) {
			return 'Click start and the AI will deal the first round.';
		}

		if (revealed) {
			return 'Answer revealed. Queue another round whenever you are ready.';
		}

		return currentRound?.statusLine ?? 'Type your guess, then reveal the answer.';
	});

	async function generateRound() {
		const nextRound = generationCount + 1;

		started = true;
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

		if (!currentRound?.answer || loading) {
			return;
		}

		revealAnswer();
	}
</script>

<svelte:head>
	<title>Blushing Riddles</title>
	<meta
		name="description"
		content="One-click AI riddles with a simple flow: start, guess, and reveal the harmless answer."
	/>
</svelte:head>

<div class="relative isolate min-h-screen overflow-hidden">
	<div class="absolute inset-0 bg-background"></div>
	<div
		class="absolute inset-0 opacity-20"
		style="background-image: linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px); background-size: 4.5rem 4.5rem;"
	></div>
	<div
		class="absolute top-18 -left-24 h-72 w-72 rounded-full border border-primary/20 bg-primary/10 blur-3xl"
	></div>
	<div
		class="absolute top-30 right-0 h-80 w-80 rounded-full border border-accent/30 bg-accent/10 blur-3xl"
	></div>

	{#if !started}
		<section
			transition:fade={{ duration: 180 }}
			class="relative mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:px-8"
		>
			<div class="flex flex-wrap items-center gap-2">
				<Badge
					variant="secondary"
					class="gap-1.5 border border-primary/20 bg-primary/10 text-primary"
				>
					<Sparkles class="size-3.5" />
					<span>One-click game flow</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/70">
					<Shield class="size-3.5" />
					<span>AI-generated and family-friendly</span>
				</Badge>
			</div>

			<div class="space-y-5">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					Blush Banter
				</p>
				<h1 class="text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
					One click. One strange setup. One
					<span class="mt-3 block text-primary">
						<MorphingText texts={heroWords} class="h-16 text-left sm:h-20" />
					</span>
					reveal.
				</h1>
				<p class="max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
					No prompt writing. No card flipping. Just start a round, lock your guess, and reveal the
					harmless answer.
				</p>
			</div>

			<div
				class="rounded-[calc(var(--radius)+0.5rem)] border border-border/80 bg-card/75 p-4 shadow-sm backdrop-blur"
			>
				<SpecialText
					text={statusCopy}
					speed={18}
					class="text-sm tracking-[0.28em] text-primary uppercase sm:text-base"
				/>
			</div>

			<div class="flex flex-col gap-3 sm:flex-row">
				<Button class="gap-2 px-6" onclick={generateRound} disabled={loading}>
					{#if loading}
						<RefreshCw class="size-4 animate-spin" />
						Summoning a riddle
					{:else}
						<Play class="size-4" />
						Start the first riddle
					{/if}
				</Button>
				<div
					class="flex items-center rounded-[calc(var(--radius)+0.4rem)] border border-border/80 bg-card/65 px-4 py-3 text-sm text-muted-foreground shadow-sm"
				>
					<Eye class="mr-2 size-4 text-primary" />
					Answer stays hidden until you reveal.
				</div>
			</div>

			<div class="grid gap-3 sm:grid-cols-3">
				{#each flowSteps as step, index (step)}
					<Card.Root class="border-border/80 bg-card/75 shadow-none">
						<Card.Header class="space-y-2 py-4">
							<Card.Description class="text-xs tracking-[0.2em] uppercase">
								Step {index + 1}
							</Card.Description>
							<Card.Title class="text-base leading-6">{step}</Card.Title>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>

			<div
				class="rounded-[calc(var(--radius)+0.6rem)] border border-border/80 bg-card/70 px-5 py-4 shadow-sm"
			>
				<Signature text="Blush Banter" color="var(--color-primary)" class="w-full" />
			</div>
		</section>
	{:else}
		<div
			transition:fade={{ duration: 180 }}
			class="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
		>
			<header class="flex flex-wrap items-end justify-between gap-4">
				<div class="space-y-3">
					<div class="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
							<WandSparkles class="size-3.5" />
							<span>Round {generationCount}</span>
						</Badge>
						<Badge variant="outline" class="gap-1.5 bg-card/70">
							{revealed ? 'Answer open' : loading ? 'Writing' : 'Guessing'}
						</Badge>
					</div>
					<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Guess before the reveal</h2>
					<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						Same flow, cleaner layout: read the setup, type a guess, and reveal when ready.
					</p>
				</div>

				<Button class="gap-2" onclick={generateRound} disabled={loading}>
					{#if loading}
						<RefreshCw class="size-4 animate-spin" />
						Drafting
					{:else}
						<RefreshCw class="size-4" />
						New round
					{/if}
				</Button>
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
								<span>Your guess</span>
							</Badge>
							<Badge variant="outline" class="bg-background/70">
								{currentRound?.topic ?? 'Waiting for a category'}
							</Badge>
						</div>
						<Card.Title class="text-2xl font-semibold tracking-tight"
							>Name the harmless answer</Card.Title
						>
						<Card.Description>
							{revealed
								? 'Round complete. Compare your guess, then queue the next one.'
								: 'Type your best guess. You can reveal with or without an entry.'}
						</Card.Description>
					</Card.Header>

					<Card.Content class="space-y-6">
						<form class="space-y-4" onsubmit={handleGuessSubmit}>
							<div class="space-y-2">
								<label for="guess" class="text-sm leading-none font-medium text-foreground">
									What do you think it is?
								</label>
								<Input
									id="guess"
									bind:value={guessInput}
									placeholder="Type your guess before reveal"
									disabled={loading || revealed}
									autocomplete="off"
								/>
							</div>

							<div class="flex flex-col gap-3 sm:flex-row">
								<Button
									type="submit"
									class="flex-1 gap-2"
									disabled={!currentRound?.answer || loading || revealed}
								>
									<Eye class="size-4" />
									Lock guess and reveal
								</Button>
								<Button
									type="button"
									variant="outline"
									class="gap-2"
									onclick={generateRound}
									disabled={loading}
								>
									<RefreshCw class="size-4" />
									Skip to a fresh round
								</Button>
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
					</Card.Content>
				</Card.Root>
			</section>
		</div>
	{/if}
</div>
