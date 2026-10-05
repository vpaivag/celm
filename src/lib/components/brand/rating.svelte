<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { formatScore } from '#lib/format.js';

	// Lectura de nota. La cifra siempre acompaña a las estrellas y va primero.
	let {
		value,
		size = 16,
		showValue = false,
		class: className
	}: { value: number | null; size?: number; showValue?: boolean; class?: string } = $props();

	const filled = $derived(value == null ? 0 : Math.round(value));
</script>

<span class={cn('inline-flex items-center gap-2', className)}>
	{#if showValue && value != null}
		<span class="font-extrabold" style:font-size="{size}px">{formatScore(value)}</span>
	{/if}
	<span
		role="img"
		aria-label={value == null ? 'Aún sin nota' : `${formatScore(value)} de 5`}
		class="leading-none"
		style:font-size="{size}px"
		style:letter-spacing={size >= 20 ? '2px' : '1px'}
		><span class="text-rating">{'★'.repeat(filled)}</span><span class="text-rating-empty"
			>{'★'.repeat(5 - filled)}</span
		></span
	>
</span>
