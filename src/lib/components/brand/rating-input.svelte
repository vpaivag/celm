<script lang="ts">
	// Entrada de nota: cada estrella tiene 48px de área táctil y la frase cambia según la nota.
	const labels = ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];

	let { value = $bindable(0), name }: { value?: number; name?: string } = $props();
	let hover = $state(0);
	const active = $derived(hover || value);
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-1" role="group" aria-label="Tu nota" onmouseleave={() => (hover = 0)}>
		{#each labels as label, i (label)}
			<button
				type="button"
				aria-pressed={value === i + 1}
				aria-label="{i + 1} de 5: {label}"
				class="focus-visible:focus-halo size-12 cursor-pointer rounded-tile text-[38px] leading-none outline-none {i <
				active
					? 'text-rating'
					: 'text-rating-empty'}"
				onclick={() => (value = i + 1)}
				onmouseenter={() => (hover = i + 1)}>★</button
			>
		{/each}
	</div>
	<span class="min-h-5 text-[15px] font-semibold" aria-live="polite">
		{active ? `${active} de 5 · ${labels[active - 1]}` : 'Toca una estrella'}
	</span>
	{#if name}<input type="hidden" {name} {value} />{/if}
</div>
