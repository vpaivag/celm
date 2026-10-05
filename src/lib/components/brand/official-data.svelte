<script lang="ts">
	import type { OfficialMetric } from './types.js';

	// Datos oficiales: gris frío, esquinas rectas y números en mono.
	// Aparte del ranking; nunca se mezclan con las opiniones en una misma tarjeta.
	let { metrics = [] }: { metrics?: OfficialMetric[] } = $props();
</script>

<section
	class="bg-official text-foreground flex flex-col gap-3.5 rounded-official p-[18px] shadow-[inset_0_0_0_1px_var(--official-line)]"
>
	<div class="flex flex-col gap-1">
		<h3 class="text-official-ink font-mono text-[11px] font-medium tracking-[.06em]">
			LO QUE DICEN LOS DATOS OFICIALES
		</h3>
		{#if metrics.length}
			<span class="text-official-ink text-[13px] leading-snug">
				Aparte del ranking. No se mezclan con las opiniones.
			</span>
		{/if}
	</div>
	{#if metrics.length}
		<dl class="flex flex-col">
			{#each metrics as m (m.label)}
				<div class="border-official-line flex items-baseline justify-between gap-3 border-t py-2.5">
					<dt class="flex flex-col gap-0.5">
						<span class="flex flex-wrap items-center gap-1.5 text-[15px]">
							{m.label}
							{#if m.tag}
								<span
									class="text-official-ink rounded-[3px] px-1.5 py-px font-mono text-[10px] font-medium shadow-[inset_0_0_0_1px_var(--official-tag)]"
									>{m.tag}</span
								>
							{/if}
						</span>
						<span class="text-official-ink font-mono text-[11px]">
							{m.period} · Fuente:
							{#if m.sourceHref}
								<a href={m.sourceHref} target="_blank" rel="noopener" class="text-official-ink">{m.source} ↗</a>
							{:else}{m.source}{/if}
						</span>
					</dt>
					<dd class="font-mono text-lg font-medium">{m.value}</dd>
				</div>
			{/each}
		</dl>
	{:else}
		<span class="text-official-ink -mt-2 text-[15px]">No existen datos oficiales para esta categoría.</span>
	{/if}
</section>
