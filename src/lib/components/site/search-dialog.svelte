<script lang="ts">
	import { goto } from '$app/navigation';
	import { Badge, badgeVariants } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Command from '#lib/components/ui/command/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { formatCount } from '#lib/format.js';
	import {
		capitalize,
		categoryBySlug,
		categoryPath,
		isBuilding,
		popular,
		question,
		searchCategories,
		totalReviews,
		MIN_REVIEWS_TO_PUBLISH,
		type Category
	} from '#lib/fake-data.js';
	import { ui } from '#lib/fake-session.svelte.js';
	import { cn } from '#lib/utils.js';

	// Buscador grande. Móvil: pantalla completa. Escritorio: modal arriba (01b).
	// Command se encarga de ↑↓ y ↵; el filtrado es nuestro (searchCategories).
	let query = $state('');
	let input = $state<HTMLInputElement | null>(null);

	const hits = $derived(searchCategories(query).slice(0, 5));
	const recent = $derived(ui.recent.map(categoryBySlug).filter((c) => c != null));
	const chips = $derived(popular.map(categoryBySlug).filter((c) => c != null));

	$effect(() => {
		if (!ui.searchOpen) query = '';
	});

	function close() {
		ui.searchOpen = false;
	}

	function openCategory(c: Category) {
		ui.remember(c.slug);
		close();
		goto(categoryPath(c));
	}

	function propose() {
		const q = query.trim().replace(/\?$/, '');
		close();
		goto(`/buscar?q=${encodeURIComponent(q)}`);
	}

	// "/" abre el buscador en cualquier página, salvo mientras se escribe en un campo.
	function onwindowkey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		if (e.key !== '/' || ui.searchOpen || t.closest('input, textarea, [contenteditable]')) return;
		e.preventDefault();
		ui.searchOpen = true;
	}

	const kbd = 'rounded-[5px] px-[7px] py-[3px] font-mono text-[11px] font-medium shadow-[inset_0_0_0_1px_var(--input)]';
	const enterHint = `${kbd} text-muted-foreground hidden lg:group-data-selected/command-item:inline`;
</script>

<svelte:window onkeydown={onwindowkey} />

{#snippet buildingBadge(c: Category)}
	<Badge variant="building" size="sm">En construcción · {totalReviews(c)} de {MIN_REVIEWS_TO_PUBLISH}</Badge>
{/snippet}

<Dialog.Root bind:open={ui.searchOpen}>
	<Dialog.Content
		showCloseButton={false}
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			input?.focus();
		}}
		class="flex flex-col gap-0 p-0 max-lg:inset-0 max-lg:max-w-none max-lg:translate-x-0 max-lg:translate-y-0 max-lg:rounded-none max-lg:shadow-none lg:top-24 lg:max-w-[760px] lg:translate-y-0 lg:gap-2 lg:p-3"
	>
		<Dialog.Title class="sr-only">Buscar una categoría</Dialog.Title>
		<Dialog.Description class="sr-only">Escribe qué quieres comparar.</Dialog.Description>

		<Command.Root shouldFilter={false} loop class="bg-transparent">
			<div class="flex items-center gap-2 px-3 pt-3.5 pb-2.5 lg:p-0">
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" class="size-11 shrink-0 lg:hidden" aria-label="Volver">←</Button>
					{/snippet}
				</Dialog.Close>
				<Command.Input bind:ref={input} bind:value={query} placeholder="…?" wrapperClass="min-w-0 flex-1 p-0">
					{#snippet leading()}
						<span class="text-base font-extrabold whitespace-nowrap lg:text-[22px]">¿Cuál es la mejor</span>
					{/snippet}
					{#snippet trailing()}
						{#if query}
							<button type="button" class="cursor-pointer px-1 text-[15px] lg:hidden" aria-label="Borrar" onclick={() => (query = '')}
								>✕</button
							>
						{/if}
						<kbd class={kbd + ' max-lg:hidden'}>esc</kbd>
					{/snippet}
				</Command.Input>
			</div>

			<Command.List class="px-2 py-1">
				{#if query.trim()}
					{#each hits as hit (hit.category.slug)}
						{@const c = hit.category}
						<Command.Item value={c.slug} onSelect={() => openCategory(c)} class="justify-between lg:px-4">
							<span class="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
								<span class="font-semibold lg:text-[17px]">
									¿Cuál es {c.gender === 'm' ? 'el mejor' : 'la mejor'}
									{hit.before}<b class="font-extrabold">{hit.match}</b>{hit.after}?
								</span>
								<span class="lg:hidden">
									{#if isBuilding(c)}{@render buildingBadge(c)}{:else}<span class="text-muted-foreground text-[13px]"
											>{formatCount(totalReviews(c))} opiniones</span
										>{/if}
								</span>
							</span>
							<span class="lg:hidden">→</span>
							<span class="text-muted-foreground flex items-center gap-3 text-[13px] max-lg:hidden">
								{#if isBuilding(c)}{@render buildingBadge(c)}{:else}{formatCount(totalReviews(c))} opiniones{/if}
								<kbd class={enterHint}>↵</kbd>
							</span>
						</Command.Item>
					{/each}
					<Command.Item
						value="__proponer"
						onSelect={propose}
						class="justify-between lg:px-4 {hits.length ? 'border-secondary rounded-t-none border-t' : ''}"
					>
						<span class="text-muted-foreground text-[15px] font-semibold lg:text-base">Proponer "{query.trim()}…" como categoría nueva</span>
						<span>→</span>
					</Command.Item>
				{/if}

				<div
					class="flex flex-col gap-2.5 py-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:pt-3.5 lg:pb-2 {query.trim()
						? 'lg:border-secondary lg:border-t'
						: ''}"
				>
					{#if recent.length}
						<Command.Group heading="BUSCASTE HACE POCO" class="p-0">
							{#each recent as c (c.slug)}
								<Command.Item value="reciente-{c.slug}" onSelect={() => openCategory(c)} class="justify-between py-2 text-[15px]">
									{question(c)} <span class="text-disabled-foreground lg:hidden">↖</span>
								</Command.Item>
							{/each}
						</Command.Group>
					{/if}
					<div class="flex flex-col gap-2.5 px-3 max-lg:mt-2 lg:gap-2">
						<span class="text-muted-foreground py-1.5 font-mono text-[11px] font-medium tracking-[.04em]">POPULARES</span>
						<div class="flex flex-wrap gap-2">
							{#each chips as c (c.slug)}
								<button
									type="button"
									class={cn(badgeVariants({ variant: 'chip' }), 'hover:bg-accent cursor-pointer lg:px-3 lg:py-1.5 lg:text-[13px]')}
									onclick={() => openCategory(c)}>{capitalize(c.name)}</button
								>
							{/each}
						</div>
					</div>
				</div>
			</Command.List>
		</Command.Root>

		<div class="text-disabled-foreground px-4 pt-1 pb-1.5 font-mono text-[11px] font-medium max-lg:hidden">
			↑↓ para moverte · ↵ para abrir · esc para cerrar
		</div>
	</Dialog.Content>
</Dialog.Root>
