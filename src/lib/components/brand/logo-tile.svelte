<script lang="ts">
	import { cn } from '#lib/utils.js';

	// Contenedor neutro para logos de terceros: mismo fondo claro en ambos temas,
	// logo a 70% del alto, sin sombra.
	let {
		src,
		alt = '',
		size = 56,
		class: className
	}: { src?: string; alt?: string; size?: number; class?: string } = $props();
</script>

<div
	class={cn(
		'bg-logo-tile text-logo-tile-ink flex shrink-0 items-center justify-center rounded-tile font-mono text-[10px] font-medium shadow-[inset_0_0_0_1px_var(--border)]',
		className
	)}
	style:width="{size}px"
	style:height="{size}px"
	style:border-radius={size < 44 ? '10px' : undefined}
>
	{#if src}
		<img {src} {alt} class="h-[70%] w-[70%] object-contain" />
	{:else if size >= 64}
		logo
	{/if}
</div>
