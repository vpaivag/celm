<script lang="ts">
	import { untrack } from 'svelte';
	import { LogoTile, Podium, PodiumRank, Rating } from '#lib/components/brand/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import OfficialIndicators from '#lib/components/site/official-indicators.svelte';
	import { formatCount, formatScore } from '#lib/format.js';
	import {
		alphabetical,
		isBuilding,
		question,
		ranked,
		totalReviews,
		unranked,
		MIN_REVIEWS_PER_BRAND,
		MIN_REVIEWS_TO_PUBLISH,
		type RankedEntry
	} from '#lib/fake-data.js';
	import { ui } from '#lib/fake-session.svelte.js';

	let { data } = $props();
	const c = $derived(data.category);

	const building = $derived(isBuilding(c));
	const total = $derived(totalReviews(c));
	const list = $derived(ranked(c));
	const few = $derived(unranked(c));
	const missing = $derived(MIN_REVIEWS_TO_PUBLISH - total);
	const percent = $derived(Math.round((total / MIN_REVIEWS_TO_PUBLISH) * 100));
	const podium = $derived(list.slice(0, 3) as [RankedEntry, ...RankedEntry[]]);
	const cta = $derived(building ? '¿Lo has usado?' : c.cta);
	const inlineFew = $derived(few.length === 1 ? few[0] : null);

	$effect(() => {
		const slug = c.slug;
		untrack(() => ui.remember(slug));
	});

	const rateAny = () => {
		ui.rate = c.entries.map((e) => ({ brand: e.brand, category: c.slug }));
	};
	const rateOne = (brand: string) => {
		ui.rate = [{ brand, category: c.slug }];
	};

	const mono = 'text-muted-foreground font-mono text-xs font-medium tracking-[.04em]';
	const row =
		'flex items-center gap-3 border-b border-border py-3 no-underline! last:border-b-0 lg:grid lg:grid-cols-[40px_48px_minmax(0,1fr)_140px_90px] lg:gap-4 lg:border-secondary lg:py-3.5 dark:lg:border-border';
	const tileLg = 'lg:bg-card lg:rounded-card lg:shadow-[inset_0_0_0_1px_var(--border)]';
</script>

<svelte:head><title>{question(c)} · cualeslamejor.cl</title></svelte:head>

{#snippet opinar(slug: string)}
	<Button variant="outline" size="sm" class="h-9 px-3.5" onclick={() => rateOne(slug)}>Opinar</Button>
{/snippet}

<div
	class="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:px-12 lg:pt-10 lg:pb-16"
>
	<div class="flex flex-col lg:gap-6">
		<!-- encabezado -->
		<div class="flex flex-col gap-2 px-5 pt-6 pb-5 lg:p-0">
			<span class="text-muted-foreground font-mono text-xs font-medium">
				<a href="/" class="text-muted-foreground no-underline! hover:underline!">Inicio</a> / {c.plural}
			</span>
			<h1 class="text-[32px] leading-[1.05] font-extrabold tracking-[-.03em] lg:text-[52px] lg:leading-[1.02]">
				{question(c)}
			</h1>
			{#if !building}
				<span class="text-muted-foreground text-sm lg:text-base">{formatCount(total)} opiniones verificadas · actualizado hoy</span>
			{/if}
		</div>

		{#if building}
			<!-- en construcción -->
			<section
				class="border-state-building bg-card mx-5 flex flex-col gap-3.5 rounded-card border-[1.5px] border-dashed p-5 lg:mx-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-10 lg:gap-y-6 lg:p-7"
			>
				<div class="flex flex-col gap-3.5">
					<Badge variant="building" class="self-start text-[13px]">Ranking en construcción</Badge>
					<span class="text-[22px] leading-[1.2] font-extrabold text-pretty lg:text-[28px] lg:leading-[1.15]">
						Faltan {missing} opiniones para publicar el ranking
					</span>
					<span class="text-muted-foreground text-sm leading-normal text-pretty max-lg:hidden lg:max-w-[520px] lg:text-[15px]">
						Hasta entonces mostramos las marcas en orden alfabético, sin notas. Así nadie gana con pocos votos.
					</span>
				</div>
				<div class="flex flex-col gap-1.5 lg:order-last lg:col-span-2">
					<Progress value={percent} class="h-3" aria-label="{total} de {MIN_REVIEWS_TO_PUBLISH} opiniones" />
					<div class="text-muted-foreground flex justify-between font-mono text-[13px] font-medium">
						<span>{total} de {MIN_REVIEWS_TO_PUBLISH} opiniones</span><span>{percent}%</span>
					</div>
				</div>
				<span class="text-muted-foreground text-sm leading-normal text-pretty lg:hidden">
					Hasta entonces mostramos las marcas en orden alfabético, sin notas. Así nadie gana con pocos votos.
				</span>
				<Button class="h-[52px] max-lg:order-last max-lg:w-full" onclick={rateAny}>{cta} Cuéntanos</Button>
			</section>

			<section class="flex flex-col px-5 pt-6 pb-2 lg:gap-2.5 lg:p-0">
				<h2 class="{mono} pb-1">MARCAS · A–Z</h2>
				<div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-2.5">
					{#each alphabetical(c) as b (b.slug)}
						<div
							class="border-border flex items-center gap-3 border-b py-3 last:border-b-0 lg:gap-3.5 lg:border-b-0 lg:px-4 lg:py-3.5 {tileLg}"
						>
							<LogoTile size={44} />
							<a href="/marca/{b.slug}" class="flex-1 font-bold no-underline! hover:underline! lg:text-[17px]">{b.name}</a>
							{@render opinar(b.slug)}
						</div>
					{/each}
				</div>
				<a href="#" class="py-3 text-sm font-semibold lg:pt-1.5 lg:text-[15px]">¿Falta una marca? Sugiérela</a>
			</section>
		{:else}
			<!-- podio -->
			<div class="flex flex-col gap-2.5 px-5 lg:hidden">
				<Podium entries={podium} />
				<Button class="mt-1 h-[52px]" onclick={rateAny}>{cta} Cuéntanos</Button>
			</div>

			<div class="grid grid-cols-[1.4fr_1fr_1fr] gap-3 max-lg:hidden">
				{#each podium as b, i (b.slug)}
					<Card.Root
						class="relative p-[22px] text-base has-[a:hover]:ring-[1.5px] has-[a:hover]:ring-foreground {i === 0
							? 'gap-4'
							: 'gap-3.5 self-end'}"
					>
						<div class="flex items-center {i === 0 ? 'gap-3' : 'gap-2.5'}">
							<PodiumRank rank={i + 1} size={i === 0 ? 52 : 40} />
							<LogoTile size={i === 0 ? 56 : 44} />
						</div>
						<a href="/marca/{b.slug}" class="font-extrabold no-underline! after:absolute after:inset-0 {i === 0 ? 'text-[26px]' : 'text-xl'}"
							>{b.name}</a
						>
						<span class="flex items-baseline gap-2.5">
							<span class="leading-none font-extrabold {i === 0 ? 'text-[44px]' : 'text-[30px]'}">{formatScore(b.rating)}</span>
							<Rating value={b.rating} size={i === 0 ? 20 : 15} />
						</span>
						<span class="text-muted-foreground text-sm">{formatCount(b.reviews)} opiniones · confianza {b.confidence}</span>
					</Card.Root>
				{/each}
			</div>

			<!-- resto del ranking -->
			{#if list.length > 3 || inlineFew}
				<section class="flex flex-col px-5 pt-6 pb-2 {tileLg} lg:px-[22px] lg:py-2">
					<h2 class="{mono} pb-1 lg:hidden">RANKING COMPLETO</h2>
					{#each list.slice(3) as b, i (b.slug)}
						<a href="/marca/{b.slug}" class={row}>
							<span class="w-6 text-center text-[17px] font-extrabold text-muted-foreground lg:w-auto lg:text-lg">{i + 4}</span>
							<LogoTile size={40} class="lg:hidden" /><LogoTile size={44} class="max-lg:hidden" />
							<span class="flex min-w-0 flex-1 flex-col lg:contents">
								<span class="font-bold lg:text-[17px]">{b.name}</span>
								<span class="text-muted-foreground text-[13px] lg:text-sm">
									<span class="lg:hidden">{formatCount(b.reviews)} opiniones · confianza {b.confidence}</span>
									<span class="max-lg:hidden">{formatCount(b.reviews)} · conf. {b.confidence}</span>
								</span>
							</span>
							<span class="text-[17px] font-extrabold lg:text-right lg:text-lg">
								{formatScore(b.rating)} <span class="text-rating text-sm max-lg:hidden">★</span>
							</span>
						</a>
					{/each}
					{#if inlineFew}
						<a href="/marca/{inlineFew.slug}" class={row}>
							<span class="text-input w-6 text-center lg:w-auto">–</span>
							<LogoTile size={40} class="lg:hidden" /><LogoTile size={44} class="max-lg:hidden" />
							<span class="flex min-w-0 flex-1 flex-col lg:contents">
								<span class="text-muted-foreground font-bold lg:text-[17px]">{inlineFew.name}</span>
								<span class="text-muted-foreground text-[13px] lg:text-sm">{inlineFew.reviews} opiniones</span>
							</span>
							<Badge variant="nodata" size="sm" class="lg:justify-self-end">
								<span class="lg:hidden">Sin datos suficientes</span><span class="max-lg:hidden">Sin datos</span>
							</Badge>
						</a>
					{/if}
				</section>
			{/if}

			{#if few.length > 1}
				<section class="flex flex-col gap-1 px-5 pt-2 lg:p-0">
					<div class="bg-secondary flex flex-col gap-1 rounded-card p-[18px]">
						<span class="text-lg font-extrabold">Aún sin datos suficientes</span>
						<span class="text-muted-foreground text-sm leading-normal text-pretty">
							{few.length === 1 ? 'Esta marca tiene' : 'Estas marcas tienen'} menos de {MIN_REVIEWS_PER_BRAND} opiniones. Las
							mostramos, pero sin posición ni nota hasta que haya más.
						</span>
					</div>
					<div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-2.5 lg:pt-2">
						{#each few as b (b.slug)}
							<div
								class="border-border flex items-center gap-3 border-b py-3 last:border-b-0 lg:border-b-0 lg:px-4 lg:py-3.5 {tileLg}"
							>
								<LogoTile size={44} class="opacity-70" />
								<span class="flex flex-1 flex-col">
									<a href="/marca/{b.slug}" class="text-muted-foreground font-bold no-underline! hover:underline!">{b.name}</a>
									<span class="text-muted-foreground font-mono text-xs font-medium">{b.reviews} de {MIN_REVIEWS_PER_BRAND}</span>
								</span>
								{@render opinar(b.slug)}
							</div>
						{/each}
					</div>
					<a href="#" class="text-muted-foreground py-2 text-sm">¿Por qué {MIN_REVIEWS_PER_BRAND} opiniones?</a>
				</section>
			{/if}
		{/if}
	</div>

	<!-- costado (escritorio) / final (móvil) -->
	<aside class="flex flex-col gap-4 px-5 pb-8 lg:p-0">
		{#if !building}
			<Card.Root class="bg-primary gap-3 p-[22px] text-base text-white ring-0 max-lg:hidden dark:bg-card">
				<span class="text-[21px] leading-[1.2] font-extrabold">{cta}</span>
				<span class="text-[15px] leading-normal text-[#C9CBE8]">Tu nota cuenta desde el primer minuto. Toma menos de un minuto.</span>
				<Button class="bg-white text-primary h-12 hover:bg-[#E4E5F5]" onclick={rateAny}>Cuéntanos</Button>
			</Card.Root>
		{/if}
		<div class="lg:hidden"><OfficialIndicators indicators={c.official} collapsed /></div>
		<div class="max-lg:hidden"><OfficialIndicators indicators={c.official} /></div>
		{#if building}
			<div
				class="text-muted-foreground rounded-tile p-[18px] text-sm leading-normal text-pretty shadow-[inset_0_0_0_1px_var(--border)] max-lg:hidden"
			>
				¿Por qué {MIN_REVIEWS_TO_PUBLISH} opiniones? Con menos, una sola persona puede mover demasiado el resultado.
				<a href="#">Cómo calculamos</a>
			</div>
		{:else}
			<div class="text-muted-foreground text-sm lg:hidden"><a href="#">Cómo calculamos este ranking</a></div>
		{/if}
	</aside>
</div>
