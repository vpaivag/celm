<script lang="ts">
	import { cn } from '#lib/utils.js';

	// Sin oro, plata ni bronce. Solo el #1 lleva amarillo.
	// En un empate técnico nadie lo lleva: los empatados comparten el contorno.
	let {
		rank,
		tied = false,
		size = 44,
		class: className
	}: { rank: number | string; tied?: boolean; size?: number; class?: string } = $props();

	const tone = $derived(
		tied || (typeof rank === 'number' && (rank === 2 || rank === 3))
			? 'outline'
			: rank === 1
				? 'leader'
				: 'plain'
	);
</script>

<div
	class={cn(
		'flex shrink-0 items-center justify-center rounded-bubble-sm font-extrabold',
		tone === 'leader' && 'bg-podium-1-bg text-podium-1-fg',
		tone === 'outline' && 'text-foreground shadow-[inset_0_0_0_2px_var(--podium-line)]',
		tone === 'plain' && 'text-muted-foreground font-semibold',
		tied && 'w-auto px-3',
		className
	)}
	style:height="{size}px"
	style:min-width="{size}px"
	style:font-size="{Math.round(size / 2)}px"
	style:border-radius={size >= 52 ? 'var(--radius-bubble)' : undefined}
>
	{rank}
</div>
