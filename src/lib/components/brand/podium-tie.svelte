<script lang="ts">
	import { formatCount, formatScore } from '#lib/format.js';
	import LogoTile from './logo-tile.svelte';
	import PodiumRank from './podium-rank.svelte';
	import type { RankedBrand } from './types.js';

	// Empate técnico: la diferencia es menor que el margen de error, nadie lleva amarillo.
	let { entries, from = 1 }: { entries: RankedBrand[]; from?: number } = $props();
	const range = $derived(`${from}–${from + entries.length - 1}`);
</script>

<div class="flex flex-col gap-3 rounded-card p-4 shadow-[inset_0_0_0_1.5px_var(--podium-line)]">
	<div class="flex items-center gap-2.5">
		<PodiumRank rank={range} tied size={32} class="text-[15px]" />
		<span class="text-lg font-extrabold">Empate técnico</span>
	</div>
	<div class="grid grid-cols-2 gap-2.5 text-[15px]">
		{#each entries as entry (entry.name)}
			<div class="flex items-center gap-2.5">
				<LogoTile src={entry.logo} alt={entry.name} size={36} />
				<span>
					<b>{entry.name}</b><br />
					<span class="text-muted-foreground">{formatScore(entry.rating)} · {formatCount(entry.reviews)}</span>
				</span>
			</div>
		{/each}
	</div>
	<span class="text-muted-foreground text-sm text-pretty">
		La diferencia es menor que el margen de error, así que no elegimos ganador.
	</span>
</div>
