<script lang="ts">
	import { fade } from 'svelte/transition';
	import { MorphingText } from '$lib/components/magic/morphing-text/index.js';
	import { Signature } from '$lib/components/spell/signature/index.js';
	import { SpecialText } from '$lib/components/spell/special-text/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ArrowRight } from '@lucide/svelte';

	const heroWords = ['suggestive', 'scandalous', 'dirty', 'filthy'];

	const highlights = [
		{
			title: 'Suggestive setups',
			text: 'Each round starts with a clue that sounds highly inappropriate.'
		},
		{
			title: 'Lock in your guess',
			text: 'Read the clue, assume the worst, and commit to your answer.'
		},
		{
			title: 'Innocent reveals',
			text: 'The answer is always harmless. The joke is entirely on you and your dirty mind.'
		}
	];

	const flowSteps = [
		{
			label: 'Step 1',
			title: 'Start a round',
			copy: 'Jump into the game and read a clue that sounds completely wrong.'
		},
		{
			label: 'Step 2',
			title: 'Take a guess',
			copy: 'Lock in what you think the answer is before the reveal.'
		},
		{
			label: 'Step 3',
			title: 'Face the truth',
			copy: 'See the innocent answer and realize your mind was just in the gutter.'
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
					<span>Adult party game</span>
				</Badge>
				<Badge variant="outline" class="gap-1.5 bg-card/75">
					<span>Innocent answers</span>
				</Badge>
			</div>

			<div class="space-y-5">
				<p class="text-xs font-medium tracking-[0.45em] text-muted-foreground uppercase">
					Blush Banter
				</p>
				<h1
					class="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
				>
					A game that tests how dirty your mind is when the clue sounds
					<span class="mt-3 block text-primary">
						<MorphingText
							texts={heroWords.map((word) => word + '.')}
							class="h-16 text-left sm:h-20"
						/>
					</span>
					Can you guess the
					<span class="stroke-2 line-through decoration-primary/80 decoration-10"> innocent </span>
					answer?
				</h1>
				<p class="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
					Blush Banter keeps it simple: read a highly suggestive setup, lock in your guess, and
					reveal a completely harmless answer. The dirt is entirely in your head.
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
					href="/dashboard"
					class="inline-flex h-11 items-center justify-center rounded-full border border-border/80 bg-card/75 px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5"
				>
					View history
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
						How dirty is your mind?
					</Card.Title>
					<Card.Description>
						Every round starts with a scandalous setup and ends with an innocent reveal.
					</Card.Description>
				</Card.Header>

				<Card.Content class="space-y-3">
					{#each [{ label: 'Setup', copy: 'A highly suggestive clue makes everyone assume the worst.' }, { label: 'Guess', copy: 'You lock in your filthy answer before the truth lands.' }, { label: 'Reveal', copy: 'A completely innocent answer shows up, exposing your dirty mind.' }] as row (row.label)}
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
				Will you guess the innocent answer, or assume the worst?
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
					text="The answer is always innocent. The dirt is in your head."
					speed={18}
					class="h-auto text-sm tracking-[0.28em] whitespace-pre-wrap text-primary uppercase sm:text-base"
				/>
				<p class="max-w-2xl text-sm leading-6 text-muted-foreground">
					Designed to be quick, highly suggestive, and perfect for revealing who in your group has
					the dirtiest mind.
				</p>
			</div>

			<!-- <div
				class="flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
			>
				Signature reveal flow
			</div> -->
		</div>
	</section>

	<!-- <div
		class="rounded-[calc(var(--radius)+0.6rem)] border border-border/80 bg-card/70 px-5 py-4 shadow-sm"
	>
		<Signature text="Blush Banter" color="var(--color-primary)" class="w-full" />
	</div> -->
</section>
