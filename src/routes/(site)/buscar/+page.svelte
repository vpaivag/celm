<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '#lib/components/ui/button/index.js';
	import { capitalize, categoryBySlug, categoryPath, didYouMean, fakeCount, popular, searchCategories } from '#lib/fake-data.js';
	import { ui } from '#lib/fake-session.svelte.js';

	let { data } = $props();
	let query = $derived(data.q);
	let proposed = $state(false);
	let notify = $state(false);

	const hits = $derived(searchCategories(data.q));
	const others = $derived(fakeCount(data.q));
	// Si no se nos ocurre nada parecido, mostramos lo popular.
	const suggestions = $derived(didYouMean(data.q));
	const fallback = popular.map(categoryBySlug).filter((c) => c != null);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		proposed = notify = false;
		goto(`/buscar?q=${encodeURIComponent(query.trim())}`);
	}

	const chip = 'bg-card rounded-full px-3.5 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--border)] no-underline! lg:px-4 lg:py-[9px] lg:text-[15px]';
</script>

<svelte:head><title>¿Cuál es la mejor {data.q}? · cualeslamejor.cl</title></svelte:head>

<div class="mx-auto flex max-w-[1280px] flex-col gap-8 p-5 lg:items-center lg:gap-[22px] lg:px-12 lg:pt-14 lg:pb-[72px] lg:text-center">
	<form
		role="search"
		onsubmit={submit}
		class="bg-card flex h-[52px] items-center gap-1.5 rounded-full px-4 text-left shadow-[0_0_0_2px_var(--foreground)] has-focus-visible:shadow-[0_0_0_2px_var(--foreground),0_0_0_6px_rgb(246_196_52/.45)] lg:h-16 lg:w-[640px] lg:gap-2 lg:rounded-[32px_32px_32px_10px] lg:px-[22px]"
	>
		<label for="buscar-q" class="text-[15px] font-extrabold whitespace-nowrap lg:text-xl">¿Cuál es la mejor</label>
		<input
			id="buscar-q"
			bind:value={query}
			autocomplete="off"
			placeholder="…?"
			class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] outline-none focus:ring-0 lg:text-xl"
		/>
		{#if query}
			<button type="button" class="text-muted-foreground cursor-pointer" aria-label="Borrar" onclick={() => (query = '')}>✕</button>
		{/if}
	</form>

	{#if hits.length}
		<!-- calza a medias: mostramos lo que hay -->
		<div class="flex flex-col gap-2 lg:w-[640px] lg:text-left">
			<span class="text-muted-foreground font-mono text-xs font-medium tracking-[.04em]">¿BUSCABAS ALGUNA DE ESTAS?</span>
			{#each hits as hit (hit.category.slug)}
				<a href={categoryPath(hit.category)} class="bg-card flex justify-between rounded-tile p-4 font-semibold no-underline! shadow-[inset_0_0_0_1px_var(--border)]">
					<span>¿Cuál es {hit.category.gender === 'm' ? 'el mejor' : 'la mejor'} {hit.before}<b class="font-extrabold">{hit.match}</b>{hit.after}?</span>
					<span>→</span>
				</a>
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-3.5 pt-6 lg:items-center lg:gap-[22px] lg:pt-8">
		<div
			class="flex h-14 w-16 items-center justify-center rounded-[26px_26px_26px_7px] text-[28px] font-extrabold shadow-[inset_0_0_0_2.5px_var(--foreground)] lg:h-[70px] lg:w-20 lg:rounded-[32px_32px_32px_9px] lg:text-[34px] lg:shadow-[inset_0_0_0_3px_var(--foreground)]"
		>
			¿?
		</div>
		<h1 class="text-[30px] leading-[1.08] font-extrabold tracking-[-.03em] lg:text-5xl lg:leading-[1.05]">
			Nadie ha preguntado esto todavía
		</h1>
		<p class="text-muted-foreground leading-normal text-pretty lg:max-w-[520px] lg:text-lg">
			Si nos ayudas a crear la categoría, la armamos con las opiniones de la gente.
		</p>
		<div class="flex flex-col gap-3.5 lg:flex-row lg:gap-2.5">
			<Button class="h-[52px] lg:px-[26px]" disabled={proposed} onclick={() => (proposed = true)}>
				{proposed ? '¡Gracias! La revisamos' : 'Proponer categoría'}
			</Button>
			<Button variant="outline" class="h-[52px] lg:px-[26px]" aria-pressed={notify} onclick={() => (notify = !notify)}>
				{notify ? '✓ Te avisaremos' : 'Avísame cuando exista'}
			</Button>
		</div>
		<span class="text-muted-foreground text-center font-mono text-xs font-medium">
			{others + (notify || proposed ? 1 : 0)} personas más buscaron esto
		</span>
	</div>

	<div class="flex flex-col gap-2.5 lg:mt-6 lg:items-center">
		<span class="text-muted-foreground font-mono text-xs font-medium tracking-[.04em]">
			{suggestions.length ? 'QUIZÁS BUSCABAS' : 'LO MÁS CONSULTADO'}
		</span>
		<div class="flex flex-wrap gap-2">
			{#if suggestions.length}
				{#each suggestions as s (s)}
					<a href="/buscar?q={encodeURIComponent(s.toLowerCase())}" class={chip}>{s}</a>
				{/each}
			{:else}
				{#each fallback as c (c.slug)}
					<a href={categoryPath(c)} class={chip} onclick={() => ui.remember(c.slug)}>{capitalize(c.name)}</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
