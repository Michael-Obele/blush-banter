<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import RiddleCard from '$lib/components/riddle-card.svelte';
	import {
		cleanPrompt,
		fallbackRiddle,
		getPromptTone,
		isUnsafePrompt,
		pickRiddleForPrompt,
		promptPresets,
		type PromptPreset,
		type Riddle
	} from '$lib/data/riddles';
	import { ArrowRight, RefreshCw, Shield, Sparkles } from '@lucide/svelte';

	let promptInput = $state(promptPresets[0].prompt);
	let generationCount = $state(0);
	let revealed = $state(false);
	let loading = $state(false);
	let promptLabel = $state(promptPresets[0].label);
	let safetyLabel = $state('Family-friendly only');
	let statusLine = $state('Ready to start a harmless round.');
	let currentRiddle = $state<Riddle>(pickRiddleForPrompt(promptPresets[0].prompt, 0));

	const roundTone = $derived(getPromptTone(promptInput));
	const promptPreview = $derived(cleanPrompt(promptInput));
	const canGenerate = $derived(promptPreview.length > 0 && !loading);

	const sleep = (milliseconds: number) =>
		new Promise((resolve) => setTimeout(resolve, milliseconds));

	async function startRound(nextPrompt = promptInput, preset?: PromptPreset) {
		const cleanedPrompt = cleanPrompt(nextPrompt);
		const resolvedPrompt = cleanedPrompt || promptPresets[0].prompt;

		promptInput = resolvedPrompt;
		promptLabel = preset?.label ?? getPromptTone(resolvedPrompt);
		loading = true;
		revealed = false;
		statusLine = 'Checking the wording and picking a clean seed riddle.';
		safetyLabel = 'Family-friendly only';

		await sleep(320);

		generationCount += 1;

		if (isUnsafePrompt(resolvedPrompt)) {
			currentRiddle = fallbackRiddle;
			promptLabel = 'Family-friendly fallback';
			safetyLabel = 'Unsafe prompt blocked';
			statusLine = 'That prompt was too spicy, so a safe backup took the stage.';
		} else {
			currentRiddle = pickRiddleForPrompt(resolvedPrompt, generationCount);
			promptLabel = preset?.label ?? getPromptTone(resolvedPrompt);
			safetyLabel = 'Family-friendly only';
			statusLine = resolvedPrompt
				? `Matched a clean round for ${resolvedPrompt.toLowerCase()}.`
				: 'Using a curated seed round.';
		}

		loading = false;
	}

	function revealAnswer() {
		revealed = true;
		statusLine = 'Answer revealed. The room can breathe again.';
	}

	function shufflePrompt() {
		const nextPreset = promptPresets[generationCount % promptPresets.length];
		promptInput = nextPreset.prompt;
		void startRound(nextPreset.prompt, nextPreset);
	}

	function applyPreset(preset: PromptPreset) {
		promptInput = preset.prompt;
		void startRound(preset.prompt, preset);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void startRound(promptInput);
	}
</script>

<svelte:head>
	<title>Blushing Riddles</title>
	<meta
		name="description"
		content="A playful party game about clean double-entendre riddles, safe prompts, and quick reveals."
	/>
</svelte:head>

<div
	class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
>
	<section class="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
		<div class="space-y-6">
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="secondary" class="gap-1.5">
					<Sparkles class="size-3.5" />
					<span>Clean wordplay only</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5">
					<Shield class="size-3.5" />
					<span>Safe prompts, safe fallback</span>
				</Badge>
			</div>

			<div class="space-y-4">
				<h1
					class="max-w-3xl text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl"
				>
					Blushing Riddles
				</h1>
				<p class="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
					A cheeky party game where the setup sounds scandalous, the answer stays innocent, and the
					reveal lands fast.
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<Button class="gap-2" onclick={shufflePrompt} disabled={loading}>
					<Sparkles class="size-4" />
					Start a new round
				</Button>
				<Button variant="secondary" class="gap-2" onclick={revealAnswer} disabled={loading}>
					<ArrowRight class="size-4" />
					Skip to the answer
				</Button>
			</div>

			<div class="grid gap-3 sm:grid-cols-3">
				<Card.Root class="border-border/80 bg-card/80 shadow-sm">
					<Card.Header class="space-y-1.5 py-4">
						<Card.Title class="text-base">Seed bank</Card.Title>
						<Card.Description>Curated riddles keep the tone predictable.</Card.Description>
					</Card.Header>
				</Card.Root>
				<Card.Root class="border-border/80 bg-card/80 shadow-sm">
					<Card.Header class="space-y-1.5 py-4">
						<Card.Title class="text-base">Reveal loop</Card.Title>
						<Card.Description>Tap once to flip, tap again to reshuffle.</Card.Description>
					</Card.Header>
				</Card.Root>
				<Card.Root class="border-border/80 bg-card/80 shadow-sm">
					<Card.Header class="space-y-1.5 py-4">
						<Card.Title class="text-base">Safety guard</Card.Title>
						<Card.Description>Unsafe wording falls back to a clean prompt.</Card.Description>
					</Card.Header>
				</Card.Root>
			</div>
		</div>

		<Card.Root
			class="border-border/80 bg-card/90 shadow-[0_24px_80px_rgba(61,26,53,0.12)] backdrop-blur-sm"
		>
			<Card.Header class="space-y-3 pb-4">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="outline" class="gap-1.5">
						<RefreshCw class="size-3.5" />
						<span>Round flow</span>
					</Badge>
					<Badge variant="secondary">{roundTone}</Badge>
				</div>
				<Card.Title class="text-2xl font-semibold tracking-tight">How the game flows</Card.Title>
				<Card.Description>
					Enter a playful prompt, load a clean riddle, then flip the card to reveal the answer.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid gap-4">
					<div class="flex items-start gap-3">
						<Badge variant="secondary" class="mt-0.5 min-w-8 justify-center rounded-full px-0"
							>1</Badge
						>
						<div class="space-y-1">
							<p class="font-medium">Pick a prompt</p>
							<p class="text-sm leading-6 text-muted-foreground">
								Use a preset or type your own safe topic.
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Badge variant="secondary" class="mt-0.5 min-w-8 justify-center rounded-full px-0"
							>2</Badge
						>
						<div class="space-y-1">
							<p class="font-medium">Load the round</p>
							<p class="text-sm leading-6 text-muted-foreground">
								The app selects a matching seed riddle or a safe fallback.
							</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Badge variant="secondary" class="mt-0.5 min-w-8 justify-center rounded-full px-0"
							>3</Badge
						>
						<div class="space-y-1">
							<p class="font-medium">Flip the card</p>
							<p class="text-sm leading-6 text-muted-foreground">
								The answer appears with a clean punch line and a tiny wink.
							</p>
						</div>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="pt-0">
				<p class="text-sm leading-6 text-muted-foreground">{statusLine}</p>
			</Card.Footer>
		</Card.Root>
	</section>

	<Separator />

	<section class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
		<RiddleCard
			riddle={currentRiddle}
			{revealed}
			{loading}
			{promptLabel}
			{safetyLabel}
			onReveal={revealAnswer}
			onShuffle={shufflePrompt}
		/>

		<Card.Root class="border-border/80 bg-card/90 shadow-sm">
			<Card.Header class="space-y-3 pb-4">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="secondary" class="gap-1.5">
						<Sparkles class="size-3.5" />
						<span>Prompt studio</span>
					</Badge>
					<Badge variant="outline">{promptPreview || 'Ready for a clean prompt'}</Badge>
				</div>
				<Card.Title class="text-2xl font-semibold tracking-tight">Write a safe prompt</Card.Title>
				<Card.Description>
					Use the presets for a fast start or type your own family-friendly misdirection.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-6">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<div class="space-y-2">
						<label for="prompt" class="text-sm leading-none font-medium text-foreground"
							>Prompt</label
						>
						<Input
							id="prompt"
							bind:value={promptInput}
							placeholder="Try 'kitchen gadgets' or 'travel drama'"
							autocomplete="off"
						/>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each promptPresets as preset (preset.label)}
							<Button
								type="button"
								variant="secondary"
								class="gap-2"
								onclick={() => applyPreset(preset)}
							>
								<Sparkles class="size-4" />
								<span>{preset.label}</span>
							</Button>
						{/each}
					</div>

					<div class="flex flex-col gap-3 sm:flex-row">
						<Button type="submit" class="flex-1 gap-2" disabled={!canGenerate}>
							{#if loading}
								<RefreshCw class="size-4 animate-spin" />
								Generating
							{:else}
								<ArrowRight class="size-4" />
								Generate a clean round
							{/if}
						</Button>
						<Button
							type="button"
							variant="outline"
							class="gap-2"
							onclick={shufflePrompt}
							disabled={loading}
						>
							<RefreshCw class="size-4" />
							Randomize
						</Button>
					</div>
				</form>

				<Separator />

				<div class="grid gap-3 sm:grid-cols-2">
					<Card.Root class="border-border/70 bg-background/70 shadow-none">
						<Card.Header class="space-y-2 py-4">
							<Card.Title class="text-base">Safety check</Card.Title>
							<Card.Description>
								{#if isUnsafePrompt(promptPreview)}
									That wording gets replaced with a clean backup.
								{:else}
									The prompt stays inside the harmless wordplay lane.
								{/if}
							</Card.Description>
						</Card.Header>
					</Card.Root>
					<Card.Root class="border-border/70 bg-background/70 shadow-none">
						<Card.Header class="space-y-2 py-4">
							<Card.Title class="text-base">Round status</Card.Title>
							<Card.Description>
								{loading
									? 'Loading a fresh seed...'
									: revealed
										? 'Answer open and ready.'
										: 'Waiting for the reveal.'}
							</Card.Description>
						</Card.Header>
					</Card.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</div>
