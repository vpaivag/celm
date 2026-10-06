<script lang="ts">
	import { goto } from '$app/navigation';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { formatCount } from '#lib/format.js';
	import {
		capitalize,
		categoryBySlug,
		categoryPath,
		homeChips,
		isBuilding,
		popular,
		question,
		searchCategories,
		totalReviews,
		MIN_REVIEWS_TO_PUBLISH
	} from '#lib/fake-data.js';
	import { ui } from '#lib/fake-session.svelte.js';

	// En escritorio el buscador "escribe solo" ejemplos hasta que alguien lo toca.
	const examples = [
		{ word: 'AFP', slug: 'afp' },
		{ word: 'aerolínea', slug: 'aerolinea' },
		{ word: 'compañía de internet', slug: 'internet-hogar' },
		{ word: 'app de delivery', slug: 'app-de-delivery' }
	];

	let index = $state(0);
	let chars = $state(0);
	let query = $state('');
	let focused = $state(false);

	const typed = $derived((examples[index].word + '?').slice(0, chars));
	const demo = $derived(!query && !focused);

	$effect(() => {
		let hold: ReturnType<typeof setTimeout> | undefined;
		const tick = setInterval(() => {
			const word = examples[index].word;
			if (chars < word.length + 1) chars++;
			else
				hold ??= setTimeout(() => {
					hold = undefined;
					index = (index + 1) % examples.length;
					chars = 0;
				}, 2600);
		}, 70);
		return () => (clearInterval(tick), clearTimeout(hold));
	});

	function pick(i: number) {
		index = i;
		chars = examples[i].word.length + 1;
	}

	function go(slug: string) {
		ui.remember(slug);
		goto(categoryPath(categoryBySlug(slug)!));
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!query.trim()) return go(examples[index].slug);
		const [hit] = searchCategories(query);
		if (hit) go(hit.category.slug);
		else goto(`/buscar?q=${encodeURIComponent(query.trim())}`);
	}

	const chips = homeChips.map(categoryBySlug).filter((c) => c != null);
	const top = popular.map(categoryBySlug).filter((c) => c != null);
	const chip = 'bg-card rounded-full px-3.5 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--border)] no-underline!';
</script>

<svelte:head><title>cualeslamejor.cl · La respuesta la da la gente</title></svelte:head>

<!-- móvil -->
<div class="lg:hidden">
	<section class="flex flex-col gap-5 px-5 pt-10 pb-7">
		<h1 class="text-[36px] leading-[1.02] font-extrabold tracking-[-.03em]">La respuesta la da la gente.</h1>
		<p class="text-muted-foreground leading-normal text-pretty">
			Rankings de marcas hechos solo con opiniones de usuarios verificados. Nadie paga por aparecer.
		</p>
		<button
			type="button"
			onclick={() => (ui.searchOpen = true)}
			class="bg-card flex h-14 cursor-pointer items-center gap-1.5 rounded-full pr-[5px] pl-[18px] text-left shadow-[0_0_0_2px_var(--foreground),var(--shadow-2)]"
		>
			<span class="font-extrabold whitespace-nowrap">¿Cuál es la mejor</span>
			<span class="text-disabled-foreground flex-1">…?</span>
			<span class="bg-primary text-primary-foreground flex size-[46px] items-center justify-center rounded-full text-xl">→</span>
		</button>
		<div class="flex flex-wrap gap-2">
			{#each chips as c (c.slug)}
				<a href={categoryPath(c)} class={chip} onclick={() => ui.remember(c.slug)}>{capitalize(c.name)}</a>
			{/each}
		</div>
	</section>

	<section class="flex flex-col gap-3 px-5 pb-7">
		<h2 class="text-muted-foreground font-mono text-xs font-medium tracking-[.04em]">LO MÁS CONSULTADO</h2>
		<Card.Root class="gap-0 py-0 text-base">
			{#each top as c (c.slug)}
				<a
					href={categoryPath(c)}
					onclick={() => ui.remember(c.slug)}
					class="border-secondary flex items-center justify-between gap-3 border-b p-4 no-underline! last:border-b-0"
				>
					<span class="flex flex-col gap-1">
						<span class="font-bold">{question(c)}</span>
						{#if isBuilding(c)}
							<Badge variant="building" size="sm" class="self-start">
								En construcción · {totalReviews(c)} de {MIN_REVIEWS_TO_PUBLISH}
							</Badge>
						{:else}
							<span class="text-muted-foreground text-[13px]">{formatCount(totalReviews(c))} opiniones</span>
						{/if}
					</span>
					<span class="text-lg">→</span>
				</a>
			{/each}
		</Card.Root>
	</section>

	<section class="bg-primary mx-5 mb-8 flex flex-col gap-2 rounded-card p-5 text-white dark:bg-card">
		<span class="text-xl leading-[1.2] font-extrabold">Ninguna marca paga por estar aquí. Ni por no estar.</span>
		<a href="#" class="text-highlight! text-[15px] font-semibold">Cómo calculamos el ranking</a>
	</section>
</div>

<!-- escritorio -->
<div class="mx-auto max-w-[1280px] max-lg:hidden">
	<section class="flex flex-col items-center gap-[26px] px-12 pt-24 pb-20 text-center">
		<h1 class="max-w-[820px] text-[64px] leading-none font-extrabold tracking-[-.035em]">La respuesta la da la gente.</h1>
		<p class="text-muted-foreground max-w-[560px] text-[19px] leading-normal text-pretty">
			Rankings de marcas hechos solo con opiniones de usuarios verificados. Nadie paga por aparecer.
		</p>
		<form
			role="search"
			onsubmit={submit}
			class="bg-card flex h-[72px] w-[720px] items-center gap-2 rounded-[36px_36px_36px_12px] pr-2 pl-[26px] text-left shadow-[0_0_0_2px_var(--foreground),var(--shadow-2)] has-focus-visible:shadow-[0_0_0_2px_var(--foreground),0_0_0_6px_rgb(246_196_52/.45)]"
		>
			<label for="home-q" class="text-[22px] font-extrabold whitespace-nowrap">¿Cuál es la mejor</label>
			<span class="relative flex min-w-0 flex-1 items-center">
				<input
					id="home-q"
					bind:value={query}
					onfocus={() => (focused = true)}
					onblur={() => (focused = false)}
					autocomplete="off"
					class="w-full border-0 bg-transparent p-0 text-[22px] outline-none focus:ring-0"
				/>
				{#if demo}
					<span aria-hidden="true" class="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-[22px] whitespace-nowrap"
						>{typed}<span class="bg-foreground ml-0.5 inline-block h-6 w-0.5 align-middle"></span></span
					>
				{/if}
			</span>
			<Button type="submit" class="h-14 px-[26px] text-[17px]">Buscar</Button>
		</form>
		<div class="flex flex-wrap justify-center gap-2">
			{#each examples as ex, i (ex.slug)}
				<button
					type="button"
					onclick={() => pick(i)}
					class="cursor-pointer rounded-full px-4 py-[9px] text-[15px] font-semibold shadow-[inset_0_0_0_1px_var(--border)] {i ===
						index && demo
						? 'bg-primary text-primary-foreground'
						: 'bg-card text-foreground'}">{capitalize(ex.word)}</button
				>
			{/each}
		</div>
	</section>

	<section
		class="bg-primary mx-12 mb-14 flex items-center justify-between gap-10 rounded-[28px_28px_28px_8px] px-11 py-10 text-white dark:bg-card"
	>
		<span class="max-w-[760px] text-4xl leading-[1.1] font-extrabold tracking-[-.025em]">
			<span class="text-highlight">Ninguna marca paga por estar aquí.</span> Ni por no estar.
		</span>
		<Button href="#" class="bg-white text-primary h-[52px] shrink-0 px-6 hover:bg-[#E4E5F5]">Cómo calculamos</Button>
	</section>
</div>
