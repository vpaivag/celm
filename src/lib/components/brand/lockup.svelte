<script lang="ts">
	import { cn } from '#lib/utils.js';
	import LogoMark from './logo-mark.svelte';
	import Wordmark from './wordmark.svelte';

	// Ícono + wordmark (static/lockup-claro.svg / lockup-oscuro.svg).
	// En oscuro el ícono pasa a la versión amarilla.
	let { height = 40, class: className }: { height?: number; class?: string } = $props();
	// En el SVG original el ícono mide 96 y el texto 110 de alto, separados por 28.
	const mark = $derived(Math.round((height * 96) / 110));
</script>

<span class={cn('inline-flex items-center', className)} style:gap="{Math.round((height * 28) / 110)}px">
	<LogoMark size={mark} decorative class="dark:hidden" />
	<LogoMark size={mark} decorative variant="yellow" class="hidden dark:block" />
	<Wordmark {height} />
</span>
