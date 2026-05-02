<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { ArrowRight, Eye, RefreshCw, Shield, Shuffle, Sparkles } from '@lucide/svelte';
	import type { Riddle } from '$lib/data/riddles';

	type Props = {
		riddle: Riddle;
		revealed?: boolean;
		loading?: boolean;
		promptLabel?: string;
		safetyLabel?: string;
		onReveal?: () => void;
		onShuffle?: () => void;
	};

	let {
		riddle,
		revealed = false,
		loading = false,
		promptLabel = 'Safe prompt',
		safetyLabel = 'Family-friendly only',
		onReveal,
		onShuffle
	}: Props = $props();

	const handlePrimaryAction = () => {
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
				<Sparkles class="size-3.5" />
				<span>{riddle.topic}</span>
			</Badge>
			<Badge variant="outline" class="gap-1.5">
				<Shield class="size-3.5" />
				<span>{safetyLabel}</span>
			</Badge>
			<Badge variant="outline" class="gap-1.5">
				<span class="tracking-[0.24em] uppercase">{riddle.difficulty}</span>
			</Badge>
		</div>

		<div class="space-y-1.5">
			<Card.Title class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
				{revealed ? riddle.answer : 'Can you guess the innocent answer?'}
			</Card.Title>
			<Card.Description class="max-w-prose text-sm leading-6 sm:text-base">
				{revealed
					? 'The punch line is simple, clean, and still a little suspicious.'
					: 'The setup sounds dramatic, but the answer stays harmless.'}
			</Card.Description>
		</div>
	</Card.Header>

	<Card.Content class="space-y-4">
		<div
			class="relative min-h-[22rem] overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border border-border bg-background/80 p-4 sm:p-6"
			style="perspective: 1400px;"
		>
			<div
				class="relative min-h-[20rem] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
				style={`transform: rotateY(${revealed ? 180 : 0}deg);`}
			>
				<section
					class="absolute inset-0 flex h-full w-full flex-col justify-between gap-6 rounded-[calc(var(--radius)+0.35rem)] border border-border bg-card p-5 shadow-sm sm:p-6"
					style="backface-visibility: hidden;"
				>
					<div class="space-y-4">
						<div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
							<Eye class="size-4" />
							<span>{promptLabel}</span>
						</div>

						{#if loading}
							<div class="space-y-4">
								<Skeleton class="h-5 w-32" />
								<Skeleton class="h-24 w-full rounded-2xl" />
								<Skeleton class="h-4 w-5/6" />
							</div>
						{:else}
							<p
								class="max-w-2xl text-2xl leading-10 font-medium text-balance text-foreground sm:text-[2rem]"
							>
								{riddle.prompt}
							</p>
							<p class="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
								{riddle.clue}
							</p>
						{/if}
					</div>

					<div class="space-y-3">
						<Separator />
						<p class="text-sm leading-6 text-muted-foreground">
							Tap the reveal button when you are ready to see the harmless answer.
						</p>
					</div>
				</section>

				<section
					class="absolute inset-0 flex h-full w-full flex-col justify-between gap-6 rounded-[calc(var(--radius)+0.35rem)] border border-primary/20 bg-primary/8 p-5 shadow-sm sm:p-6"
					style="backface-visibility: hidden; transform: rotateY(180deg);"
				>
					<div class="space-y-4">
						<div class="flex items-center gap-2 text-sm font-medium text-primary">
							<ArrowRight class="size-4" />
							<span>The answer</span>
						</div>

						<div class="space-y-3">
							<p class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
								{riddle.answer}
							</p>
							<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								{riddle.explanation}
							</p>
						</div>
					</div>

					<div class="space-y-3">
						<Separator />
						<div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
							<RefreshCw class="size-4" />
							<span>Ready for another clean round</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	</Card.Content>

	<Card.Footer class="flex flex-col gap-3 pt-0 sm:flex-row">
		<Button class="w-full sm:w-auto" onclick={handlePrimaryAction} disabled={loading}>
			{#if revealed}
				<RefreshCw class="size-4" />
				Next round
			{:else}
				<Eye class="size-4" />
				Reveal answer
			{/if}
		</Button>
		<Button variant="secondary" class="w-full sm:w-auto" onclick={onShuffle} disabled={loading}>
			<Shuffle class="size-4" />
			Shuffle prompt
		</Button>
	</Card.Footer>
</Card.Root>
