<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { EMPTY_PROFILE, normalizeProfile, type PersonalizationProfile } from '$lib/data/riddles';
	import { NotebookPen, Sparkles, User, UserPen } from '@lucide/svelte';

	type Props = {
		open?: boolean;
		profile?: PersonalizationProfile;
		title?: string;
		description?: string;
		onSave?: (profile: PersonalizationProfile) => Promise<void> | void;
	};

	let {
		open = $bindable(false),
		profile = EMPTY_PROFILE,
		title = 'Quiet profile, sharper riddles',
		description = 'Saved only on this device and used to tailor the AI tone, vibe, and favorite topics.',
		onSave
	}: Props = $props();

	let draft = $state(normalizeProfile());
	let saving = $state(false);
	let errorMessage = $state('');

	$effect(() => {
		if (!open) {
			return;
		}

		draft = normalizeProfile(profile);
		errorMessage = '';
	});

	const previewName = $derived(draft.name || 'Mystery player');
	const previewVibe = $derived(draft.vibe || 'playful, cheeky, and suggestive');
	const previewTopics = $derived(
		draft.favoriteTopics || 'everyday objects, sly innuendo, and clever misdirection'
	);

	function closeSheet() {
		open = false;
		errorMessage = '';
		draft = normalizeProfile(profile);
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!onSave || saving) {
			return;
		}

		saving = true;
		errorMessage = '';

		try {
			await onSave(normalizeProfile(draft));
			open = false;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to save your profile.';
		} finally {
			saving = false;
		}
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="w-full border-border/80 bg-card/95 sm:max-w-xl">
		<form class="flex h-full flex-col gap-6" onsubmit={handleSubmit}>
			<Sheet.Header class="space-y-3 border-b border-border/70 px-6 pb-5">
				<div class="flex flex-wrap items-center gap-2">
					<Badge variant="secondary" class="gap-1.5 bg-secondary/75">
						<UserPen class="size-3.5" />
						<span>Personalization</span>
					</Badge>
					<Badge variant="outline" class="bg-background/70">Stored locally with IndexedDB</Badge>
				</div>
				<Sheet.Title class="text-left text-2xl font-semibold tracking-tight">{title}</Sheet.Title>
				<Sheet.Description class="text-left">{description}</Sheet.Description>
			</Sheet.Header>

			<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-1">
				<div class="space-y-2">
					<p class="text-xs font-medium tracking-[0.32em] text-muted-foreground uppercase">
						About you
					</p>
					<p class="text-sm leading-6 text-muted-foreground">
						Give the AI a name, a vibe, and a few favorite topics so the riddles feel less generic.
					</p>
				</div>

				<div class="space-y-3">
					<div class="grid gap-2">
						<label for="profile-name" class="text-sm font-medium text-foreground">Name</label>
						<Input
							id="profile-name"
							bind:value={draft.name}
							placeholder="Alex, Sam, The Riddle Menace..."
							autocomplete="name"
						/>
					</div>

					<div class="grid gap-2">
						<label for="profile-vibe" class="text-sm font-medium text-foreground">Vibe</label>
						<Input
							id="profile-vibe"
							bind:value={draft.vibe}
							placeholder="Bold, teasing, chaotic, smooth..."
						/>
					</div>

					<div class="grid gap-2">
						<label for="profile-topics" class="text-sm font-medium text-foreground">
							Favorite topics
						</label>
						<Textarea
							id="profile-topics"
							bind:value={draft.favoriteTopics}
							rows={5}
							placeholder="Kitchen gadgets, travel mishaps, office chaos, garden tools..."
						/>
					</div>

					{#if errorMessage}
						<p
							class="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive"
						>
							{errorMessage}
						</p>
					{/if}
				</div>

				<div class="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-4">
					<div class="flex items-center gap-2">
						<Badge variant="outline" class="bg-background/80">Live prompt preview</Badge>
					</div>
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<User class="size-4 text-primary" />
							<span>{previewName}</span>
						</div>
						<p class="text-sm leading-6 text-muted-foreground">
							The AI can address you more naturally instead of defaulting to a generic guest voice.
						</p>
					</div>

					<div class="space-y-2 border-t border-border/60 pt-3">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<Sparkles class="size-4 text-primary" />
							<span>{previewVibe}</span>
						</div>
						<p class="text-sm leading-6 text-muted-foreground">
							This nudges the rhythm, confidence, and wording style of future riddles.
						</p>
					</div>

					<div class="space-y-2 border-t border-border/60 pt-3">
						<div class="flex items-center gap-2 text-sm font-medium text-foreground">
							<NotebookPen class="size-4 text-primary" />
							<span>Favorite topics</span>
						</div>
						<p class="text-sm leading-6 text-muted-foreground">{previewTopics}</p>
					</div>
				</div>
			</div>

			<Sheet.Footer class="border-t border-border/70 px-6 pt-5 sm:justify-between">
				<Button type="button" variant="outline" class="rounded-full" onclick={closeSheet}>
					Maybe later
				</Button>
				<Button type="submit" class="gap-2 rounded-full px-5" disabled={saving}>
					{#if saving}
						Saving...
					{:else}
						Save profile
					{/if}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
