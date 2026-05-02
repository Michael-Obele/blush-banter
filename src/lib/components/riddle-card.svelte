<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { Bot, ArrowRight, Eye, RefreshCw, Shield, Shuffle } from '@lucide/svelte';
	import type { Riddle } from '$lib/data/riddles';

	type Props = {
		riddle?: Partial<Riddle>;
		revealed?: boolean;
		loading?: boolean;
		playerGuess?: string;
		onReveal?: () => void;
		onShuffle?: () => void;
	};

	let {
		riddle,
		revealed = false,
		loading = false,
		playerGuess = '',
		onReveal,
		onShuffle
	}: Props = $props();

	const hasGuess = $derived(playerGuess.trim().length > 0);
	const canReveal = $derived(Boolean(riddle?.answer) && !loading);
	const canShuffle = $derived(!loading);

	const handlePrimaryAction = () => {
		if (!canReveal) {
			return;
		}

		if (revealed) {
			onShuffle?.();
			return;
		}

		onReveal?.();
	};
</script>

<Card.Root
	class="overflow-hidden border-border/80 bg-card shadow-[0_24px_80px_rgba(61,26,53,0.12)]"
>
	<Card.Header class="space-y-3 pb-4">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="secondary" class="gap-1.5">
				<Bot class="size-3.5" />
				<span>{riddle?.topic ?? 'AI round'}</span>
			</Badge>
			<Badge variant="outline" class="gap-1.5">
				<Shield class="size-3.5" />
				<span>{riddle?.safetyLabel ?? 'Waiting for DeepSeek'}</span>
			</Badge>
			<Badge variant="outline" class="gap-1.5">
				<span class="tracking-[0.24em] uppercase">{riddle?.difficulty ?? 'ready'}</span>
			</Badge>
		</div>

		<div class="space-y-1.5">
			<Card.Title class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
				{revealed
					? (riddle?.answer ?? 'Ready when DeepSeek responds')
					: 'Can you guess the answer before reveal?'}
			</Card.Title>
			<Card.Description class="max-w-prose text-sm leading-6 sm:text-base">
				{revealed
					? 'The punch line stays harmless, even when the setup sounds suspicious.'
					: 'Read the setup, type your guess, then reveal the answer when you are ready.'}
			</Card.Description>
		</div>
	</Card.Header>

	<Card.Content class="space-y-4">
		<div
			class="space-y-6 overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border border-border bg-background/80 p-4 sm:p-6"
		>
			<section
				class="space-y-4 rounded-[calc(var(--radius)+0.35rem)] border border-border bg-card p-5 shadow-sm sm:p-6"
			>
				<div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<Eye class="size-4" />
					<span>{riddle?.promptLabel ?? 'Waiting for the first round'}</span>
				</div>

				{#if loading && !riddle?.prompt}
					<div class="space-y-4">
						<Skeleton class="h-5 w-32" />
						<Skeleton class="h-24 w-full rounded-2xl" />
						<Skeleton class="h-4 w-5/6" />
					</div>
				{:else}
					<p
						class="max-w-2xl text-2xl leading-10 font-medium text-balance text-foreground sm:text-[2rem]"
					>
						{riddle?.prompt ?? 'Click start and the AI will write the first riddle.'}
					</p>
					<p class="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
						{riddle?.clue ?? 'No prompt box, no presets, just one suspicious setup at a time.'}
					</p>
				{/if}
			</section>

			<section
				class="relative space-y-4 rounded-[calc(var(--radius)+0.35rem)] border border-primary/20 bg-primary/8 p-5 shadow-sm sm:p-6"
			>
				<div class="flex items-center gap-2 text-sm font-medium text-primary">
					<ArrowRight class="size-4" />
					<span>The answer</span>
				</div>

				<div
					class={`space-y-3 transition duration-200 ${revealed ? 'blur-0 opacity-100' : 'pointer-events-none opacity-70 blur-sm select-none'}`}
				>
					<p class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
						{riddle?.answer ?? 'Waiting for DeepSeek'}
					</p>
					{#if hasGuess}
						<div
							class="rounded-2xl border border-primary/20 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
						>
							Your guess: <span class="font-medium text-foreground">{playerGuess}</span>
						</div>
					{/if}
					<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
						{riddle?.explanation ?? 'The remote function will populate this round.'}
					</p>
				</div>

				{#if !revealed}
					<div
						class="absolute inset-0 grid place-items-center rounded-[calc(var(--radius)+0.35rem)] bg-background/40 backdrop-blur-[2px]"
					>
						<div
							class="rounded-xl border border-border/80 bg-card/90 px-4 py-3 text-center text-sm text-muted-foreground"
						>
							Answer stays hidden until you tap show answer.
						</div>
					</div>
				{/if}
			</section>

			<div class="space-y-3">
				<Separator />
				<div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
					<RefreshCw class="size-4" />
					<span>{riddle?.statusLine ?? 'The room is waiting for the opening click.'}</span>
				</div>
			</div>
		</div>
	</Card.Content>

	<Card.Footer class="flex flex-col gap-3 pt-0 sm:flex-row">
		<Button class="w-full sm:w-auto" onclick={handlePrimaryAction} disabled={!canReveal}>
			{#if revealed}
				<RefreshCw class="size-4" />
				Next round
			{:else}
				<Eye class="size-4" />
				Show answer
			{/if}
		</Button>
		<Button variant="secondary" class="w-full sm:w-auto" onclick={onShuffle} disabled={!canShuffle}>
			<Shuffle class="size-4" />
			New riddle
		</Button>
	</Card.Footer>
</Card.Root>
