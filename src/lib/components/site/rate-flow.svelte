<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { LogoTile, RatingInput } from '#lib/components/brand/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { brandBySlug, capitalize, categoryBySlug, categoryPath, question } from '#lib/fake-data.js';
	import { session, ui, type RateOption } from '#lib/fake-session.svelte.js';
	import GoogleButton from './google-button.svelte';
	import PhoneVerify from './phone-verify.svelte';

	// Flujo para opinar: (elegir marca) → Google → WhatsApp → opinión → listo.
	// Móvil: Google en hoja inferior, el resto a pantalla completa. Escritorio: modal centrado.
	type Step = 'pick' | 'google' | 'phone' | 'rate' | 'done';

	let step = $state<Step>('pick');
	let choice = $state<RateOption | null>(null);
	/** Si el flujo pasó por el login, se muestran "PASO n DE 3". */
	let withAuth = $state(false);
	let rating = $state(0);
	let text = $state('');

	const open = $derived(ui.rate != null);
	const brand = $derived(choice && brandBySlug(choice.brand));
	const category = $derived(choice && categoryBySlug(choice.category));
	const stepNumber = $derived(step === 'google' ? 1 : step === 'phone' ? 2 : 3);

	$effect(() => {
		const options = ui.rate;
		if (options) untrack(() => start(options));
	});

	function start(options: RateOption[]) {
		withAuth = !session.user || !session.phoneVerified;
		rating = 0;
		text = '';
		if (options.length === 1) {
			choice = options[0];
			advance();
		} else {
			choice = null;
			step = 'pick';
		}
	}

	function advance() {
		step = !session.user ? 'google' : !session.phoneVerified ? 'phone' : 'rate';
	}

	function close() {
		ui.rate = null;
	}

	function rateAnother() {
		const c = category!;
		const done = choice!.brand;
		ui.rate = c.entries.filter((e) => e.brand !== done).map((e) => ({ brand: e.brand, category: c.slug }));
	}

	const mono = 'text-muted-foreground font-mono text-xs font-medium';
	const sheet = $derived(step === 'google');
	const navy = $derived(step === 'done');
	const other = $derived(category?.gender === 'm' ? 'otro' : 'otra');
</script>

<Dialog.Root open={open} onOpenChange={(v) => !v && close()}>
	<!-- Escritorio: el modal de marca tal cual. Móvil: hoja inferior (Google), pantalla completa (resto)
	     y pantalla navy al terminar. -->
	<Dialog.Content
		showCloseButton={false}
		class="flex flex-col max-lg:max-w-none max-lg:translate-x-0 max-lg:translate-y-0 max-lg:gap-0 max-lg:p-0 max-lg:shadow-none lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto
			{sheet
			? 'max-lg:top-auto max-lg:bottom-0 max-lg:left-0 max-lg:rounded-b-none'
			: 'max-lg:inset-0 max-lg:overflow-y-auto max-lg:rounded-none'}
			{navy ? 'max-lg:bg-primary max-lg:text-white dark:max-lg:bg-background' : ''}"
	>
			<!-- barra superior móvil -->
			{#if step === 'phone' || step === 'rate' || step === 'pick'}
				<div class="border-border flex h-[60px] shrink-0 items-center gap-2 border-b px-3 lg:hidden">
					<Button variant="ghost" size="icon" class="size-11" aria-label={step === 'phone' ? 'Volver' : 'Cerrar'} onclick={close}
						>{step === 'phone' ? '←' : '✕'}</Button
					>
					<span class="font-semibold">{step === 'phone' ? 'Verificar teléfono' : 'Tu opinión'}</span>
				</div>
			{/if}
			{#if sheet}<div class="bg-rating-empty mt-3 h-1 w-10 self-center rounded-sm lg:hidden"></div>{/if}

			<!-- cabecera escritorio -->
			{#if step !== 'done'}
				<div class="flex items-center justify-between max-lg:hidden">
					<span class={mono}>{withAuth && step !== 'pick' ? `PASO ${stepNumber} DE 3` : ''}</span>
					<Dialog.Close>
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon-sm" class="text-muted-foreground" aria-label="Cerrar">✕</Button>
						{/snippet}
					</Dialog.Close>
				</div>
				{#if withAuth && step !== 'pick'}
					<div class="grid grid-cols-3 gap-1.5 max-lg:hidden">
						{#each [1, 2, 3] as n (n)}
							<span class="h-1 rounded-sm {n <= stepNumber ? 'bg-primary' : 'bg-border'}"></span>
						{/each}
					</div>
				{/if}
			{/if}

			<div class="flex flex-1 flex-col gap-4 px-5 lg:contents {sheet ? 'pt-4 pb-9' : navy ? 'pt-7 pb-9' : 'py-6'}">
				{#if step === 'pick'}
					<Dialog.Title class="text-[26px] leading-[1.1] font-extrabold tracking-[-.02em] lg:text-[30px]"
						>¿Sobre cuál quieres opinar?</Dialog.Title
					>
					<div class="flex flex-col">
						{#each ui.rate ?? [] as option (option.brand + option.category)}
							{@const c = categoryBySlug(option.category)!}
							<button
								type="button"
								class="border-border hover:bg-background flex cursor-pointer items-center gap-3 border-b px-1 py-3 text-left last:border-b-0"
								onclick={() => ((choice = option), advance())}
							>
								<LogoTile size={40} />
								<span class="flex flex-1 flex-col">
									<span class="font-bold">{brandBySlug(option.brand)?.name}</span>
									<span class="text-muted-foreground text-[13px]">{capitalize(c.name)}</span>
								</span>
								<span>→</span>
							</button>
						{/each}
					</div>
				{:else if step === 'google'}
					<span class={mono + ' lg:hidden'}>PASO 1 DE 3</span>
					<Dialog.Title class="text-[26px] leading-[1.1] font-extrabold tracking-[-.02em] lg:text-[30px]"
						>Para opinar, entra con tu cuenta</Dialog.Title
					>
					<p class="text-muted-foreground text-[15px] leading-normal text-pretty lg:text-base">
						Así sabemos que eres una persona y no un bot. Tu nombre no se publica, a menos que tú quieras.
					</p>
					<GoogleButton onclick={() => (session.login(), advance())} />
				{:else if step === 'phone'}
					<Dialog.Title class="sr-only">Verificar teléfono</Dialog.Title>
					<PhoneVerify
						step="PASO 2 DE 3"
						title="Te mandamos un código por WhatsApp"
						description="Un teléfono, una opinión por marca. Así nadie infla el ranking. No te vamos a escribir para nada más."
						onverified={() => ((session.phoneVerified = true), advance())}
					/>
				{:else if step === 'rate' && brand && category}
					{#if withAuth}<span class={mono + ' lg:hidden'}>PASO 3 DE 3</span>{/if}
					<div class="flex items-center gap-3">
						<LogoTile size={48} />
						<span class="flex flex-col">
							<Dialog.Title class="text-xl font-extrabold">{brand.name}</Dialog.Title>
							<span class="text-muted-foreground text-sm">{capitalize(category.name)}</span>
						</span>
					</div>
					<div class="flex flex-col gap-1.5">
						<span class="font-semibold">¿Cómo te fue?</span>
						<RatingInput bind:value={rating} />
					</div>
					<div class="flex flex-col gap-1.5">
						<Label for="rate-text" class="text-sm font-semibold">
							Cuéntanos más <span class="text-muted-foreground font-normal">(opcional)</span>
						</Label>
						<Textarea
							id="rate-text"
							rows={3}
							maxlength={500}
							bind:value={text}
							class="min-h-24"
							placeholder="¿Qué le dirías a un amigo que lo está pensando?"
						/>
						<span class="text-muted-foreground self-end font-mono text-xs">{text.length} / 500</span>
					</div>
					<div class="border-secondary flex items-center justify-between gap-4 border-t py-3 lg:py-2">
						<span class="flex flex-col gap-0.5">
							<Label for="rate-show-name" class="text-[15px] font-semibold">Mostrar mi nombre ({session.user?.short})</Label>
							<span class="text-muted-foreground text-[13px]">
								Tu reseña dirá "{session.showName ? session.user?.short : 'Usuario verificado'}"
							</span>
						</span>
						<Switch id="rate-show-name" bind:checked={session.showName} />
					</div>
					<div class="flex-1"></div>
					<Button class="h-[52px] w-full" disabled={!rating} onclick={() => (step = 'done')}>Publicar opinión</Button>
				{:else if step === 'done' && category}
					<div class="flex-1 lg:hidden"></div>
					<div
						class="bg-highlight text-on-highlight flex h-[84px] w-24 items-center justify-center rounded-[40px_40px_40px_10px] text-[44px] font-extrabold lg:h-[76px] lg:w-[88px] lg:rounded-[36px_36px_36px_9px] lg:text-[40px]"
					>
						✓
					</div>
					<Dialog.Title class="text-[34px] leading-[1.05] font-extrabold tracking-[-.03em]">¡Listo! Tu nota ya cuenta.</Dialog.Title>
					<p class="text-base leading-normal text-pretty text-[#C9CBE8] lg:text-muted-foreground">
						{text.trim() ? 'Revisamos tu comentario antes de publicarlo.' : 'Si escribiste un comentario, lo revisamos antes de publicarlo.'}
						Puedes cambiar tu opinión cuando quieras desde "Mis opiniones".
					</p>
					<div class="flex-1 lg:hidden"></div>
					<div class="flex flex-col gap-2.5 lg:grid lg:grid-cols-2">
						<Button
							class="h-[52px] bg-white text-primary hover:bg-[#E4E5F5] lg:bg-primary lg:text-primary-foreground lg:hover:bg-primary-hover"
							onclick={() => (close(), goto(categoryPath(category)))}>Ver el ranking</Button
						>
						<Button
							variant="outline"
							class="h-[52px] bg-transparent text-white shadow-[inset_0_0_0_1.5px_#fff] hover:bg-white/10 lg:bg-card lg:hover:bg-secondary lg:text-foreground lg:shadow-[inset_0_0_0_1.5px_var(--input)]"
							onclick={rateAnother}
							><span class="lg:hidden">Opinar sobre {other} {category.name}</span><span class="max-lg:hidden">Opinar sobre {other}</span></Button
						>
					</div>
				{/if}
			</div>
			<Dialog.Description class="sr-only">{category ? question(category) : 'Opinar'}</Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
