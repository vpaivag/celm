<script lang="ts" module>
	import { formatCount, formatScore } from '#lib/format.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import LogoTile from './logo-tile.svelte';
	import PodiumRank from './podium-rank.svelte';
	import Rating from './rating.svelte';
	import type { RankedBrand } from './types.js';

	/** Bajo este número de opiniones la marca aparece sin posición ni nota. */
	export const MIN_REVIEWS_TO_RANK = 10;
</script>

<script lang="ts">
	let { rank, brand }: { rank: number; brand: RankedBrand } = $props();
	const ranked = $derived(brand.reviews >= MIN_REVIEWS_TO_RANK);
</script>

<div class="flex items-center gap-3 border-b border-secondary py-3 last:border-b-0 dark:border-border">
	{#if rank === 1 && ranked}
		<PodiumRank rank={1} />
	{:else}
		<span
			class="w-7 shrink-0 text-center text-lg {ranked
				? 'text-muted-foreground font-extrabold'
				: 'text-input font-normal'}">{ranked ? rank : '–'}</span
		>
	{/if}
	<LogoTile src={brand.logo} alt={brand.name} size={44} class={ranked ? '' : 'opacity-70'} />
	<div class="flex min-w-0 flex-1 flex-col gap-0.5">
		<span class="font-bold {ranked ? '' : 'text-muted-foreground'}">{brand.name}</span>
		<span class="text-muted-foreground text-[13px]">
			{formatCount(brand.reviews)} opiniones{#if ranked && brand.confidence}&nbsp;· confianza {brand.confidence}{/if}
		</span>
	</div>
	{#if ranked}
		<div class="flex flex-col items-end gap-0.5">
			<span class="text-lg font-extrabold">{formatScore(brand.rating)}</span>
			<Rating value={brand.rating} size={12} />
		</div>
	{:else}
		<Badge variant="nodata" size="sm">Sin datos suficientes</Badge>
	{/if}
</div>
