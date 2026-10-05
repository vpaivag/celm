<script lang="ts">
	import { formatCount, formatScore } from '#lib/format.js';
	import ConfidenceMeter from './confidence-meter.svelte';
	import LogoTile from './logo-tile.svelte';
	import PodiumRank from './podium-rank.svelte';
	import Rating from './rating.svelte';
	import type { RankedBrand } from './types.js';

	// Podio: #1 destacado y #2–#3 en contorno.
	let { entries }: { entries: [RankedBrand, ...RankedBrand[]] } = $props();
	const [leader, ...rest] = $derived(entries);
</script>

<div class="flex flex-col gap-2.5">
	<div class="flex flex-col gap-3.5 rounded-card p-[18px] shadow-[inset_0_0_0_1px_var(--border)]">
		<div class="flex items-center gap-3.5">
			<PodiumRank rank={1} size={52} />
			<LogoTile src={leader.logo} alt={leader.name} />
			<div class="flex min-w-0 flex-col gap-0.5">
				<span class="text-[22px] font-extrabold">{leader.name}</span>
				<span class="text-muted-foreground text-[13px]">{formatCount(leader.reviews)} opiniones</span>
			</div>
		</div>
		<div class="flex flex-wrap items-center justify-between gap-2.5">
			<div class="flex items-baseline gap-2">
				<span class="text-4xl leading-none font-extrabold">{formatScore(leader.rating)}</span>
				<Rating value={leader.rating} size={18} />
			</div>
			{#if leader.confidence}<ConfidenceMeter level={leader.confidence} />{/if}
		</div>
	</div>
	{#if rest.length}
		<div class="grid grid-cols-2 gap-2.5">
			{#each rest.slice(0, 2) as entry, i (entry.name)}
				<div class="flex flex-col gap-2.5 rounded-card p-3.5 shadow-[inset_0_0_0_1px_var(--border)]">
					<div class="flex items-center gap-2.5">
						<PodiumRank rank={i + 2} size={36} />
						<LogoTile src={entry.logo} alt={entry.name} size={36} />
					</div>
					<span class="font-bold">{entry.name}</span>
					<span class="text-sm">
						<b class="font-extrabold">{formatScore(entry.rating)}</b>
						<span class="text-rating">★</span>
						<span class="text-muted-foreground">· {formatCount(entry.reviews)}</span>
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
