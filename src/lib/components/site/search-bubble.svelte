<script lang="ts">
	import SearchIcon from '@lucide/svelte/icons/search';
	import { ui } from '#lib/fake-session.svelte.js';
	import type { Category } from '#lib/fake-data.js';

	// Globo de búsqueda fijo abajo, solo en móvil. Muestra la pregunta de la página actual.
	let { category }: { category?: Category } = $props();
</script>

<button
	type="button"
	onclick={() => (ui.searchOpen = true)}
	class="bg-primary fixed right-3 bottom-4 left-3 z-20 flex h-[60px] cursor-pointer items-center gap-1.5 rounded-[30px_30px_30px_10px] pr-1.5 pl-5 text-left text-white shadow-[0_10px_30px_rgb(20_22_74/.35)] lg:hidden dark:bg-card"
>
	<span class="text-base font-extrabold whitespace-nowrap">
		¿Cuál es {category?.gender === 'm' ? 'el mejor' : 'la mejor'}
	</span>
	<span class="min-w-0 flex-1 overflow-hidden text-base text-ellipsis whitespace-nowrap {category ? '' : 'text-[#A9ABD0]'}">
		{category ? `${category.name}?` : '…?'}
	</span>
	<span class="bg-highlight text-on-highlight flex size-12 shrink-0 items-center justify-center rounded-full"><SearchIcon class="size-5" strokeWidth={2.5} /></span>
</button>
