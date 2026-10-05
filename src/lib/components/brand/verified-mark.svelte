<script lang="ts">
	import { cn } from '#lib/utils.js';

	// Globo de diálogo con check: la opinión, verificada.
	let { class: className }: { class?: string } = $props();
</script>

<span
	aria-hidden="true"
	class={cn(
		'bg-primary text-highlight dark:bg-highlight dark:text-on-highlight inline-flex h-3.5 w-4 shrink-0 items-center justify-center rounded-[7px_7px_7px_2px] text-[9px] leading-none',
		className
	)}>✓</span
>
