<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeSwitcher from '$lib/components/theme-switcher.svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { Gamepad, House, Sparkles } from '@lucide/svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	const navLinkClass =
		'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="relative min-h-screen overflow-hidden bg-background text-foreground">
	<div class="absolute inset-0 bg-background"></div>
	<div
		class="absolute inset-0 opacity-40"
		style="background-image: linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px); background-size: 4.5rem 4.5rem;"
	></div>
	<div
		class="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
	></div>
	<div class="absolute top-32 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>

	<div class="relative z-10 flex min-h-screen flex-col">
		<header class="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
			<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<a href="/" class="group flex items-center gap-3">
						<span
							class="grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-transform group-hover:-translate-y-0.5"
						>
							<Sparkles class="size-5" />
						</span>
						<span class="space-y-0.5">
							<span
								class="block text-xs font-medium tracking-[0.4em] text-muted-foreground uppercase"
							>
								Blush Banter
							</span>
							<span class="block text-lg font-semibold tracking-tight">Riddle room</span>
						</span>
					</a>

					<div class="flex items-center gap-3">
						<a
							href="/guess"
							class="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Play now
						</a>
						<ThemeSwitcher />
					</div>
				</div>

				<NavigationMenu.Root class="w-full">
					<NavigationMenu.List class="flex flex-wrap gap-2">
						<NavigationMenu.Item>
							<NavigationMenu.Link
								href="/"
								aria-current={page.url.pathname === '/' ? 'page' : undefined}
								class={cn(
									navLinkClass,
									page.url.pathname === '/'
										? 'border-primary/20 bg-primary/10 text-primary'
										: 'border-border/80 bg-card/80 text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground'
								)}
							>
								<House class="size-4" />
								<span>Home</span>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
						<NavigationMenu.Item>
							<NavigationMenu.Link
								href="/guess"
								aria-current={page.url.pathname.startsWith('/guess') ? 'page' : undefined}
								class={cn(
									navLinkClass,
									page.url.pathname.startsWith('/guess')
										? 'border-primary/20 bg-primary/10 text-primary'
										: 'border-border/80 bg-card/80 text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground'
								)}
							>
								<Gamepad class="size-4" />
								<span>Guess before the reveal</span>
							</NavigationMenu.Link>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Root>
			</div>
		</header>

		<main class="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
			{@render children()}
		</main>
	</div>
</div>
