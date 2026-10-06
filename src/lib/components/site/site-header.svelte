<script lang="ts">
	import SearchIcon from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import { Wordmark } from '#lib/components/brand/index.js';
	import * as DropdownMenu from '#lib/components/ui/dropdown-menu/index.js';
	import { session, ui } from '#lib/fake-session.svelte.js';

	// Escritorio: en el inicio solo enlaces (el buscador grande ya está en la página);
	// en el resto, un disparador discreto que abre el buscador (tecla "/").
	let { home = false }: { home?: boolean } = $props();

	const loginHref = $derived(`/entrar?volver=${encodeURIComponent(page.url.pathname)}`);
	const link = 'no-underline! hover:text-highlight-ink';
	const avatar = 'bg-secondary flex size-9 cursor-pointer items-center justify-center rounded-full text-[13px] font-extrabold';
</script>

<header class="relative z-30">
	<div class="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 lg:h-20 lg:px-12">
		<a href="/" class="no-underline!" aria-label="Inicio">
			<Wordmark height={23} class="lg:hidden" />
			<Wordmark height={29} class="max-lg:hidden" />
		</a>

		<nav class="flex items-center gap-[26px] text-[15px] font-semibold max-lg:hidden">
			{#if home}
				<button type="button" class="cursor-pointer hover:text-highlight-ink" onclick={() => (ui.searchOpen = true)}>
					Categorías
				</button>
			{:else}
				<button
					type="button"
					onclick={() => (ui.searchOpen = true)}
					class="bg-primary text-primary-foreground hover:bg-primary-hover flex h-10 cursor-pointer items-center gap-2.5 rounded-[20px_20px_20px_7px] pr-1.5 pl-4 text-sm font-semibold dark:bg-card dark:text-foreground"
				>
					¿Cuál es la mejor…?
					<kbd class="rounded-[5px] bg-primary-hover px-[7px] py-[3px] font-mono text-[11px] font-medium text-[#C9CBE8]">/</kbd>
					<span class="bg-highlight text-on-highlight flex size-[30px] items-center justify-center rounded-full"><SearchIcon class="size-4" strokeWidth={2.5} /></span>
				</button>
			{/if}
			<a href="#" class={link}>Cómo calculamos</a>
			{#if session.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={avatar} aria-label="Tu cuenta">{session.user.initials}</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">{@render items(false)}</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a href={loginHref} class={link}>Entrar</a>
			{/if}
		</nav>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex size-11 cursor-pointer items-center justify-center text-lg lg:hidden" aria-label="Menú">
				{#if session.user}<span class={avatar}>{session.user.initials}</span>{:else}☰{/if}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">{@render items(true)}</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>

{#snippet items(mobile: boolean)}
	{#if mobile}
		<DropdownMenu.Item onSelect={() => (ui.searchOpen = true)}>Categorías</DropdownMenu.Item>
		<DropdownMenu.Item>
			{#snippet child({ props })}<a {...props} href="#" class="{props.class} no-underline!">Cómo calculamos</a>{/snippet}
		</DropdownMenu.Item>
	{/if}
	{#if session.user}
		{#if mobile}<DropdownMenu.Separator />{/if}
		<DropdownMenu.Label>{session.user.email}</DropdownMenu.Label>
		<DropdownMenu.Item onSelect={() => session.logout()}>Salir</DropdownMenu.Item>
	{:else}
		<DropdownMenu.Item>
			{#snippet child({ props })}<a {...props} href={loginHref} class="{props.class} no-underline!">Entrar</a>{/snippet}
		</DropdownMenu.Item>
	{/if}
{/snippet}
