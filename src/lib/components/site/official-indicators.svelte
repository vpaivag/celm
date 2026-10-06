<script lang="ts">
	import type { OfficialIndicator } from '#lib/fake-data.js';

	// Datos oficiales por indicador: gris frío, esquinas rectas, cifras en mono.
	// Aparte del ranking. Con `collapsed` se muestra solo el primero (móvil).
	let { indicators, collapsed = false }: { indicators: OfficialIndicator[]; collapsed?: boolean } = $props();
	let expanded = $state(false);

	const shown = $derived(collapsed && !expanded ? indicators.slice(0, 1) : indicators);
	const hidden = $derived(indicators.length - shown.length);
</script>

<section
	class="bg-official text-foreground flex flex-col gap-2.5 rounded-official p-4 shadow-[inset_0_0_0_1px_var(--official-line)] lg:p-5"
>
	<h3 class="text-official-ink font-mono text-[11px] font-medium tracking-[.06em]">LO QUE DICEN LOS DATOS OFICIALES</h3>
	{#if !indicators.length}
		<span class="text-official-ink -mt-1 text-[15px]">No existen datos oficiales para esta categoría.</span>
	{:else}
		{#if !collapsed}
			<span class="text-official-ink text-[13px] leading-snug">Aparte del ranking. No se mezclan con las opiniones.</span>
		{/if}
		{#each shown as ind, i (ind.title)}
			<div class="flex flex-col gap-2.5 {i > 0 || !collapsed ? 'mt-1.5' : ''}">
				{#if collapsed && i === 0}
					<span class="text-official-ink text-[13px]">
						{ind.title} ·{ind.period} · Fuente: <a href="#" class="text-official-ink">{ind.source} ↗</a>
					</span>
				{:else}
					<span class="flex flex-wrap items-center gap-1.5 text-[15px] font-semibold">
						{ind.title}
						{#if ind.tag}
							<span
								class="text-official-ink rounded-[3px] px-[5px] py-px font-mono text-[10px] font-medium shadow-[inset_0_0_0_1px_var(--official-tag)]"
								>{ind.tag}</span
							>
						{/if}
					</span>
				{/if}
				<dl class="flex flex-col text-[15px]">
					{#each ind.rows as [brand, value] (brand)}
						<div class="border-official-line flex justify-between border-t py-[7px]">
							<dt>{brand}</dt>
							<dd class="font-mono font-medium">{value}</dd>
						</div>
					{/each}
				</dl>
				{#if !(collapsed && i === 0)}
					<span class="text-official-ink font-mono text-[11px]">{ind.period} · Fuente: <a href="#" class="text-official-ink">{ind.source} ↗</a></span>
				{/if}
			</div>
		{/each}
		{#if hidden > 0}
			<button
				type="button"
				class="text-official-ink cursor-pointer self-start text-sm font-semibold underline underline-offset-3"
				onclick={() => (expanded = true)}
			>
				Ver {hidden} {hidden === 1 ? 'indicador más' : 'indicadores más'}
			</button>
		{/if}
	{/if}
</section>
