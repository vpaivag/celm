<script lang="ts">
	import type { Confidence } from './types.js';

	let { level }: { level: Confidence } = $props();
	const bars = $derived(level === 'alta' ? 3 : level === 'media' ? 2 : 1);
</script>

<span class="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase">
	<span class="inline-flex items-end gap-0.5" aria-hidden="true">
		{#each [6, 9, 12] as h, i (h)}
			<span
				class="w-1 rounded-[1px] {i < bars ? 'bg-foreground' : 'bg-rating-empty'}"
				style:height="{h}px"
			></span>
		{/each}
	</span>
	Confianza {level}
</span>
