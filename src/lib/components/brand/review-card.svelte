<script lang="ts">
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { cn } from '#lib/utils.js';
	import Rating from './rating.svelte';
	import VerifiedMark from './verified-mark.svelte';

	// Reseña con forma de globo. Si `pending`, es la propia opinión del usuario en revisión.
	let {
		text,
		rating,
		author,
		time,
		pending = false,
		onreport,
		onedit,
		class: className
	}: {
		text: string;
		rating?: number;
		/** Nombre visible; sin él se muestra "Usuario verificado". */
		author?: string;
		time?: string;
		pending?: boolean;
		onreport?: () => void;
		onedit?: () => void;
		class?: string;
	} = $props();
</script>

{#if pending}
	<article
		class="bg-card flex flex-col gap-2.5 rounded-bubble p-4 shadow-[inset_0_0_0_1.5px_var(--state-review-line)]"
	>
		<div class="flex flex-wrap items-center justify-between gap-2">
			<span class="text-sm font-semibold">Tu opinión</span>
			<Badge variant="review" size="sm">En revisión</Badge>
		</div>
		<p class="text-muted-foreground text-[15px] leading-normal text-pretty">{text}</p>
		<span class="text-muted-foreground text-[13px] leading-snug text-pretty">
			Solo tú la ves por ahora. Tu nota ya cuenta en el ranking; el texto se publica cuando lo revisemos.
		</span>
		{#if onedit}
			<button
				type="button"
				onclick={onedit}
				class="cursor-pointer self-start py-2 text-[13px] font-semibold underline underline-offset-3">Editar</button
			>
		{/if}
	</article>
{:else}
	<article class={cn('bg-background dark:bg-card flex flex-col gap-2.5 rounded-bubble p-4', className)}>
		<div class="flex flex-wrap items-center justify-between gap-2">
			<span class="inline-flex items-center gap-1.5 text-sm font-semibold">
				<VerifiedMark />{author ?? 'Usuario verificado'}
			</span>
			{#if rating != null}<Rating value={rating} size={14} />{/if}
		</div>
		<p class="text-[15px] leading-normal text-pretty">{text}</p>
		{#if time || onreport}
			<div class="text-muted-foreground flex items-center justify-between text-[13px]">
				<span>{time}</span>
				{#if onreport}
					<button
						type="button"
						onclick={onreport}
						class="cursor-pointer py-2 font-semibold underline underline-offset-3">Reportar</button
					>
				{/if}
			</div>
		{/if}
	</article>
{/if}
