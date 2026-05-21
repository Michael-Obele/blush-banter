<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { hasProfileDetails, type PersonalizationProfile } from '$lib/data/riddles';
	import { NotebookPen, Sparkles, User, UserPen } from '@lucide/svelte';

	type Props = {
		profile: PersonalizationProfile;
		onEdit?: () => void;
		title?: string;
		description?: string;
	};

	let {
		profile,
		onEdit,
		title = 'Quiet player profile',
		description = 'Stored only on this device and used to personalize future AI rounds.'
	}: Props = $props();

	const hasProfile = $derived(hasProfileDetails(profile));
	const profileRows = $derived([
		{
			label: 'Name',
			value: profile.name || 'Not saved yet',
			icon: User
		},
		{
			label: 'Vibe',
			value: profile.vibe || 'Not set',
			icon: Sparkles
		},
		{
			label: 'Favorite topics',
			value: profile.favoriteTopics || 'Not set',
			icon: NotebookPen
		}
	]);
</script>

<Card.Root class="border-border/80 bg-card/80 shadow-sm backdrop-blur">
	<Card.Header class="space-y-3 pb-4">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
				<User class="size-3.5" />
				<span>Profile</span>
			</Badge>
			<Badge variant="outline" class="bg-background/70">
				{hasProfile ? 'Saved locally' : 'Optional'}
			</Badge>
		</div>
		<Card.Title class="text-xl font-semibold tracking-tight">{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-3">
		{#if hasProfile}
			{#each profileRows as row (row.label)}
				<div class="rounded-2xl border border-border/70 bg-background/65 px-4 py-3">
					<div class="flex items-center gap-2 text-sm font-medium text-foreground">
						<row.icon class="size-4 text-primary" />
						<span>{row.label}</span>
					</div>
					<p class="mt-2 text-sm leading-6 text-muted-foreground">{row.value}</p>
				</div>
			{/each}
		{:else}
			<div class="rounded-2xl border border-dashed border-border/80 bg-background/65 px-4 py-4">
				<p class="text-sm font-medium text-foreground">No profile saved yet.</p>
				<p class="mt-2 text-sm leading-6 text-muted-foreground">
					Add a name, a vibe, or favorite topics so the AI can steer the riddles toward your taste.
				</p>
			</div>
		{/if}
	</Card.Content>

	<Card.Footer class="pt-0">
		<Button variant="outline" class="gap-2 rounded-full" onclick={onEdit}>
			<UserPen class="size-4" />
			{hasProfile ? 'Edit profile' : 'Add profile'}
		</Button>
	</Card.Footer>
</Card.Root>
