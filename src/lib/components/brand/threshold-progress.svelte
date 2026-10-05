<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';

	// Barra en navy, no en amarillo: todavía no hay "nota de la gente" que mostrar.
	let {
		count,
		threshold = 30,
		action
	}: { count: number; threshold?: number; action?: Snippet } = $props();

	const missing = $derived(Math.max(threshold - count, 0));
	const percent = $derived(Math.min(Math.round((count / threshold) * 100), 100));
</script>

<div class="border-state-building flex flex-col gap-3.5 rounded-card border-[1.5px] border-dashed p-5">
	<Badge variant="building" class="self-start text-[13px]">Ranking en construcción</Badge>
	<span class="text-[22px] leading-tight font-extrabold text-pretty">
		Faltan {missing} opiniones para publicar el ranking
	</span>
	<div class="flex flex-col gap-1.5">
		<Progress value={percent} class="h-3" aria-label="{count} de {threshold} opiniones" />
		<div class="text-muted-foreground flex justify-between font-mono text-[13px] font-medium">
			<span>{count} de {threshold} opiniones</span><span>{percent}%</span>
		</div>
	</div>
	{#if action}<div class="self-start">{@render action()}</div>{/if}
</div>
