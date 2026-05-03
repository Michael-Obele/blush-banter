<script lang="ts">
	import { fade } from 'svelte/transition';
	import { MorphingText } from '$lib/components/magic/morphing-text/index.js';
	import { Signature } from '$lib/components/spell/signature/index.js';
	import { SpecialText } from '$lib/components/spell/special-text/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ArrowRight } from '@lucide/svelte';

	const heroWords = ['clean', 'dirty', 'innocent', 'harmless'];

	const highlights = [
		{
			title: 'Spot the hint',
			text: 'Each round starts with a setup that sounds cheeky, but the answer stays innocent.'
		},
		{
			title: 'Clean or dirty mind?',
			text: 'See how fast your brain wanders, then bring it back to the harmless answer.'
		},
		{
			title: 'Always innocent',
			text: 'The joke lives in the misdirection, not in anything explicit.'
		}
	];

	const flowSteps = [
		{
			label: 'Step 1',
			title: 'Open the game',
			copy: 'Jump into the guessing room and see how clean your first instinct is.'
		},
		{
			label: 'Step 2',
			title: 'Make the call',
			copy: 'Read the playful clue, type your guess, and commit before the reveal.'
		},
		{
			label: 'Step 3',
			title: 'Reveal the answer',
			copy: 'Compare your guess with the innocent punch line and see if your mind was too dirty.'
		}
	];
</script>

<svelte:head>
	<title>Blush Banter | Guess before the reveal</title>
	<meta
		name="description"
		content="A playful multi-page riddle game where you guess before the reveal and keep the answers harmless."
	/>
</svelte:head>

<section class="space-y-12" transition:fade={{ duration: 180 }}>
	<div class="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
		<div class="space-y-8">
			<div class="flex flex-wrap items-center gap-2">
				<Badge
					variant="secondary"
					class="gap-1.5 border border-primary/20 bg-primary/10 text-primary"
				>
					<span>One click to start</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/75">
					<span>Family-friendly answers</span>
				</Badge>
			</div>

			<div class="space-y-5">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					Blush Banter
				</p>
				<h1
					class="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
				>
					How clean is your mind when the clue sounds
					<span class="mt-3 block text-primary">
						<MorphingText
							texts={heroWords.map((word) => word + '?')}
							class="h-16 text-left sm:h-20"
						/>
					</span>
					Can you guess the
					<span class="stroke-2 line-through decoration-primary/80 decoration-10"> innocent </span>
					answer?
				</h1>
				<p class="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
					Blush Banter turns the joke into a test of imagination: read a suggestive setup, guess the
					harmless answer, and find out whether your mind stayed clean or drifted dirty.
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<a
					href="/guess"
					class="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<ArrowRight class="size-4" />
					Play the game
				</a>
				<a
					href="#how-it-works"
					class="inline-flex h-11 items-center justify-center rounded-full border border-border/80 bg-card/75 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
				>
					See how it works
				</a>
			</div>
		</div>

		<div class="relative">
			<div
				class="absolute -inset-4 rounded-[2rem] border border-primary/10 bg-primary/5 blur-3xl"
			></div>
			<Card.Root
				class="relative overflow-hidden border-border/80 bg-card/90 shadow-xl backdrop-blur"
			>
				<Card.Header class="space-y-3 pb-4">
					<div class="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" class="gap-1.5 bg-secondary/80">
							<span>Live preview</span>
						</Badge>
						<Badge variant="outline" class="gap-1.5 bg-background/70">
							<span>Guess first</span>
						</Badge>
					</div>
					<Card.Title class="text-2xl font-semibold tracking-tight">
						Can you keep it clean?
					</Card.Title>
					<Card.Description>
						Every round starts innocent and ends with a reveal that checks how dirty your first
						thought got.
					</Card.Description>
				</Card.Header>

				<Card.Content class="space-y-3">
					{#each [{ label: 'Setup', copy: 'A suspicious clue appears and the room gets quieter.' }, { label: 'Guess', copy: 'You lock in the answer before the punch line lands.' }, { label: 'Reveal', copy: 'The harmless answer shows up with a small wink.' }] as row (row.label)}
						<div class="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
							<p class="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
								{row.label}
							</p>
							<p class="mt-2 text-sm leading-6 text-foreground">{row.copy}</p>
						</div>
					{/each}
				</Card.Content>

				<Card.Footer class="flex flex-col gap-3 pt-0 sm:flex-row">
					<a
						href="/guess"
						class="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Test your mind
					</a>
					<div
						class="flex flex-1 items-center rounded-full border border-border/80 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
					>
						Only innocent answers. The dirt is in the guessing.
					</div>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>

	<section class="grid gap-3 sm:grid-cols-3">
		{#each highlights as highlight (highlight.title)}
			<Card.Root class="border-border/80 bg-card/80 shadow-none">
				<Card.Header class="space-y-2 py-4">
					<Card.Description class="text-xs tracking-[0.2em] uppercase">Feature</Card.Description>
					<Card.Title class="text-base leading-6">{highlight.title}</Card.Title>
					<p class="text-sm leading-6 text-muted-foreground">{highlight.text}</p>
				</Card.Header>
			</Card.Root>
		{/each}
	</section>

	<section
		id="how-it-works"
		class="space-y-5 rounded-[calc(var(--radius)+0.5rem)] border border-border/80 bg-card/75 p-5 shadow-sm sm:p-6"
	>
		<div class="space-y-2">
			<p class="text-xs font-medium tracking-[0.4em] text-muted-foreground uppercase">
				How it works
			</p>
			<h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
				Can you guess the innocent answer before the reveal?
			</h2>
		</div>

		<div class="grid gap-3 lg:grid-cols-3">
			{#each flowSteps as step (step.label)}
				<Card.Root class="border-border/80 bg-background/70 shadow-none">
					<Card.Header class="space-y-2 py-4">
						<Card.Description class="text-xs tracking-[0.2em] uppercase">
							{step.label}
						</Card.Description>
						<Card.Title class="text-base leading-6">{step.title}</Card.Title>
						<p class="text-sm leading-6 text-muted-foreground">{step.copy}</p>
					</Card.Header>
				</Card.Root>
			{/each}
		</div>

		<Separator />

		<div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
			<div class="space-y-1">
				<SpecialText
					text="The answer stays innocent, even if your mind does not."
					speed={18}
					class="text-sm tracking-[0.28em] text-primary uppercase sm:text-base"
				/>
				<p class="max-w-2xl text-sm leading-6 text-muted-foreground">
					Everything is designed to feel quick, playful, and a little suggestive without crossing
					into explicit territory.
				</p>
			</div>

			<div
				class="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
			>
				Signature reveal flow
			</div>
		</div>
	</section>

	<div
		class="rounded-[calc(var(--radius)+0.6rem)] border border-border/80 bg-card/70 px-5 py-4 shadow-sm"
	>
		<Signature text="Blush Banter" color="var(--color-primary)" class="w-full" />
	</div>
</section>
