<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="fixed top-4 right-4 z-50 sm:top-6 sm:right-6">
	<ThemeSwitcher />
</div>

{@render children()}
