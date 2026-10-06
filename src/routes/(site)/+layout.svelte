<script lang="ts">
	import { page } from '$app/state';
	import SiteHeader from '#lib/components/site/site-header.svelte';
	import SearchBubble from '#lib/components/site/search-bubble.svelte';
	import SearchDialog from '#lib/components/site/search-dialog.svelte';
	import RateFlow from '#lib/components/site/rate-flow.svelte';
	import type { Category } from '#lib/fake-data.js';
	import { session, ui } from '#lib/fake-session.svelte.js';

	let { children } = $props();

	const route = $derived(page.route.id ?? '');
	// El globo de búsqueda móvil va en categoría y marca; inicio y búsqueda ya tienen su buscador.
	const bubble = $derived(route.startsWith('/(site)/[pregunta=pregunta]') || route.startsWith('/(site)/marca/'));
</script>

<SiteHeader home={route === '/(site)'} />

{#if ui.welcomeBack && session.user}
	<div class="mx-auto max-w-[1280px] px-4 pt-2 lg:px-12">
		<div
			role="status"
			class="bg-primary flex items-center gap-3 rounded-[16px_16px_16px_5px] px-4 py-3.5 text-white dark:bg-card"
		>
			<span
				class="bg-highlight text-on-highlight flex h-6 w-7 shrink-0 items-center justify-center rounded-[12px_12px_12px_3px] text-[13px] font-extrabold"
				>✓</span
			>
			<span class="flex-1 text-[15px] font-semibold">Hola de nuevo, {session.user.first}.</span>
			<button type="button" class="cursor-pointer px-1 text-[#A9ABD0]" aria-label="Cerrar" onclick={() => (ui.welcomeBack = false)}
				>✕</button
			>
		</div>
	</div>
{/if}

<main class={bubble ? 'pb-[92px] lg:pb-0' : ''}>
	{@render children()}
</main>

{#if bubble}<SearchBubble category={page.data.category as Category | undefined} />{/if}
<SearchDialog />
<RateFlow />
