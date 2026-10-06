<script lang="ts">
	import { LogoTile, PodiumRank, ReviewCard } from '#lib/components/brand/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { formatCount, formatScore } from '#lib/format.js';
	import { capitalize, categoryBySlug, categoryPath, reviews, standings, MIN_REVIEWS_TO_PUBLISH, totalReviews } from '#lib/fake-data.js';
	import { ui } from '#lib/fake-session.svelte.js';

	let { data } = $props();
	const brand = $derived(data.brand);
	const list = $derived(standings(brand.slug));
	const total = $derived(list.reduce((n, s) => n + s.reviews, 0));
	const recent = $derived(reviews.filter((r) => r.brand === brand.slug).slice(0, 2));

	const rate = () => {
		ui.rate = list.map((s) => ({ brand: brand.slug, category: s.category.slug }));
	};
</script>

<svelte:head><title>{brand.name} · cualeslamejor.cl</title></svelte:head>

<div class="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:px-12 lg:pt-12 lg:pb-16">
	<div class="flex flex-col lg:gap-7">
		<div class="flex flex-col gap-3.5 px-5 pt-7 pb-5 lg:flex-row lg:items-center lg:gap-6 lg:p-0">
			<LogoTile size={72} class="rounded-2xl lg:hidden" />
			<LogoTile size={96} class="rounded-[20px] max-lg:hidden" />
			<div class="flex flex-col gap-1.5">
				<h1 class="text-[34px] leading-[1.05] font-extrabold tracking-[-.03em] lg:text-[52px] lg:leading-none">{brand.name}</h1>
				<span class="text-muted-foreground text-[15px] lg:text-base">
					Aparece en {list.length} {list.length === 1 ? 'categoría' : 'categorías'} · {formatCount(total)} opiniones en total
				</span>
			</div>
		</div>

		<div class="flex flex-col gap-2.5 px-5 lg:grid lg:grid-cols-3 lg:gap-3 lg:p-0">
			{#each list as s (s.category.slug)}
				{@const c = s.category}
				<Card.Root
					class="relative flex-row items-center gap-3.5 p-4 text-base has-[a:hover]:ring-[1.5px] has-[a:hover]:ring-foreground lg:flex-col lg:items-start lg:gap-3 lg:p-5 {s.rank ==
						null && totalReviews(c) < MIN_REVIEWS_TO_PUBLISH
						? 'border-[1.5px] border-dashed border-[#B9BBD3] ring-0 dark:border-border'
						: ''}"
				>
					{#if s.rank === 1}
						<PodiumRank rank={1} />
					{:else if s.rank}
						<PodiumRank
							rank={s.rank}
							class="shadow-[inset_0_0_0_1.5px_var(--border)]! text-muted-foreground font-extrabold"
						/>
					{:else}
						<span class="text-disabled-foreground flex size-11 shrink-0 items-center justify-center text-[21px] font-extrabold">–</span>
					{/if}
					<span class="flex flex-1 flex-col gap-0.5 lg:contents">
						<a href={categoryPath(c)} class="font-bold no-underline! after:absolute after:inset-0 lg:text-lg">{capitalize(c.name)}</a>
						<span class="text-muted-foreground text-[13px] lg:order-last lg:text-sm">
							{#if s.rank}#{s.rank} de {s.of} · {formatCount(s.reviews)} opiniones
							{:else if totalReviews(c) < MIN_REVIEWS_TO_PUBLISH}En construcción · {totalReviews(c)} de {MIN_REVIEWS_TO_PUBLISH}
							{:else}Sin datos suficientes · {s.reviews} opiniones{/if}
						</span>
					</span>
					{#if s.rank}
						<span class="text-lg font-extrabold lg:text-[32px] lg:leading-none">
							{formatScore(s.rating)} <span class="text-rating text-sm lg:text-lg">★</span>
						</span>
					{:else}
						<span class="text-lg lg:hidden">→</span>
						<span class="text-rating-empty text-[32px] leading-none font-extrabold max-lg:hidden">–</span>
					{/if}
				</Card.Root>
			{/each}
		</div>

		{#if recent.length}
			<section class="flex flex-col gap-2.5 px-5 pt-7 pb-2 lg:gap-3 lg:p-0">
				<h2 class="text-muted-foreground font-mono text-xs font-medium tracking-[.04em]">OPINIONES RECIENTES</h2>
				<div class="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-3">
					{#each recent as r, i (i)}
						<ReviewCard
							class="bg-card shadow-[inset_0_0_0_1px_var(--border)] {i > 0 ? 'max-lg:hidden' : ''}"
							rating={r.rating}
							author={r.author}
							text={r.text}
							time="{capitalize(categoryBySlug(r.category)?.name ?? '')} · {r.time}"
						/>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<aside class="flex flex-col gap-4 px-5 pb-8 lg:p-0">
		<Card.Root class="bg-primary gap-3 p-[22px] text-base text-white ring-0 max-lg:hidden dark:bg-card">
			<span class="text-[21px] leading-[1.2] font-extrabold">¿Eres cliente de {brand.name}?</span>
			<Button class="bg-white text-primary h-12 hover:bg-[#E4E5F5]" onclick={rate}>Cuéntanos</Button>
		</Card.Root>
		<div
			class="text-muted-foreground rounded-tile p-4 text-[13px] leading-normal text-pretty shadow-[inset_0_0_0_1px_var(--border)] lg:p-[18px] lg:text-sm"
		>
			{brand.name} no administra esta página ni puede editar sus notas. <a href="#">Cómo calculamos</a>
		</div>
	</aside>
</div>
