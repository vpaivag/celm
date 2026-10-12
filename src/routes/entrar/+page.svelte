<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LogoMark, Wordmark } from '#lib/components/brand/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import GoogleButton from '#lib/components/site/google-button.svelte';
	import PhoneVerify from '#lib/components/site/phone-verify.svelte';
	import { session } from '#lib/fake-session.svelte.js';

	// Entrar y crear cuenta son la misma puerta: Google → (solo la primera vez) WhatsApp → bienvenida.
	let step = $state<'google' | 'phone' | 'welcome'>('google');
	let codeSent = $state(false);

	const back = $derived.by(() => {
		const v = page.url.searchParams.get('volver');
		return v?.startsWith('/') && !v.startsWith('//') ? v : '/';
	});

	// Magic link: POST /auth/email manda el correo; el enlace vuelve por /auth/confirm.
	let email = $state('');
	let sending = $state(false);
	let sentTo = $state<string | null>(null);
	let emailError = $state<string | null>(null);

	const linkError = $derived(
		{ google: 'No pudimos entrar con Google. Intenta de nuevo.', email: 'El enlace ya no sirve. Pide uno nuevo.' }[
			page.url.searchParams.get('error') ?? ''
		] ?? null
	);

	async function sendLink(e: SubmitEvent) {
		e.preventDefault();
		sending = true;
		emailError = null;
		try {
			const res = await fetch('/auth/email', { method: 'POST', body: new FormData(e.currentTarget as HTMLFormElement) });
			if (res.ok) sentTo = email.trim();
			else
				emailError =
					res.status === 400
						? 'Revisa el correo: no parece válido.'
						: res.status === 429
							? 'Espera un momento antes de pedir otro enlace.'
							: 'No pudimos enviar el correo. Intenta de nuevo.';
		} catch {
			emailError = 'No pudimos enviar el correo. Intenta de nuevo.';
		} finally {
			sending = false;
		}
	}

	const checks = [
		'Tu nombre no se publica, a menos que tú quieras.',
		'Tu teléfono solo sirve para verificar que eres una persona.',
		'No te mandamos publicidad.'
	];
	const options = $derived([
		{ value: 'verified', title: 'Usuario verificado', hint: 'Recomendado · nadie ve tu nombre', short: 'Recomendado' },
		{ value: 'name', title: session.user?.short ?? '', hint: 'Nombre e inicial del apellido', short: 'Nombre e inicial' }
	]);
</script>

<svelte:head><title>Entrar · cualeslamejor.cl</title></svelte:head>

<div class="bg-card min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_560px]">
	<!-- panel de marca (escritorio) -->
	<div class="dark flex flex-col bg-[#14164A] text-white max-lg:hidden">
		<div class="flex h-20 items-center px-12">
			<a href="/" class="no-underline!" aria-label="Inicio"><Wordmark height={29} /></a>
		</div>
		<div class="flex flex-1 flex-col justify-end gap-5 px-16 pb-16">
			<span class="max-w-[520px] text-[56px] leading-[1.02] font-extrabold tracking-[-.035em]">La respuesta la da la gente.</span>
			<span class="max-w-[480px] text-xl leading-[1.3] font-semibold text-[#C9CBE8]">
				<span class="text-highlight">Ninguna marca paga por estar aquí.</span> Ni por no estar.
			</span>
		</div>
	</div>

	<div class="flex min-h-dvh flex-col lg:justify-center lg:px-16 lg:py-14">
		{#if step === 'google'}
			<div class="flex h-14 items-center px-3 lg:hidden">
				<a href={back} class="flex size-11 items-center justify-center text-xl no-underline!" aria-label="Cerrar">✕</a>
			</div>
		{:else if step === 'phone'}
			<div class="border-border flex h-[60px] items-center gap-2 border-b px-3 lg:hidden">
				<button type="button" class="flex size-11 cursor-pointer items-center justify-center text-xl" aria-label="Volver" onclick={() => (step = 'google')}
					>←</button
				>
				<span class="font-semibold">Crear cuenta</span>
			</div>
		{/if}

		<div class="flex flex-1 flex-col gap-[18px] px-6 pt-3 pb-8 lg:flex-none lg:p-0 {step === 'phone' ? 'max-lg:px-5 max-lg:pt-7' : ''} {step === 'welcome' ? 'max-lg:pt-10' : ''}">
			{#if step === 'google'}
				<LogoMark size={64} />
				<h1 class="text-[32px] leading-[1.05] font-extrabold tracking-[-.03em] lg:text-4xl">Entra o crea tu cuenta</h1>
				<p class="text-muted-foreground leading-normal text-pretty">
					Es la misma puerta. Si es tu primera vez, te pedimos verificar tu teléfono una sola vez.
				</p>
				<ul class="flex flex-col gap-2.5 text-[15px] leading-[1.4]">
					{#each checks as c (c)}
						<li class="flex gap-2.5"><span class="font-extrabold">✓</span>{c}</li>
					{/each}
				</ul>
				<div class="flex-1 lg:h-2 lg:flex-none"></div>
				{#if sentTo}
					<div role="status" class="bg-background flex flex-col gap-1.5 rounded-tile p-4">
						<span class="font-semibold">Revisa tu correo</span>
						<span class="text-muted-foreground text-[15px] leading-normal">
							Te mandamos un enlace a <span class="text-foreground font-semibold">{sentTo}</span>. Ábrelo para entrar; vence en 1 hora.
						</span>
						<Button variant="link" size="sm" class="self-start" onclick={() => (sentTo = null)}>Usar otro correo</Button>
					</div>
				{:else}
					{#if linkError}<p role="alert" class="text-destructive-ink text-sm font-semibold">{linkError}</p>{/if}
					<form method="POST" action="/auth/login" class="contents">
						<input type="hidden" name="next" value={back} />
						<GoogleButton />
					</form>
					<div class="text-muted-foreground flex items-center gap-3 text-[13px]">
						<span class="bg-border h-px flex-1"></span>o con tu correo<span class="bg-border h-px flex-1"></span>
					</div>
					<form onsubmit={sendLink} class="flex flex-col gap-2.5">
						<input type="hidden" name="next" value={back} />
						<Label for="login-email" class="sr-only">Correo</Label>
						<Input
							id="login-email"
							name="email"
							type="email"
							required
							autocomplete="email"
							placeholder="tu@correo.cl"
							bind:value={email}
							aria-invalid={emailError ? true : undefined}
						/>
						{#if emailError}<p role="alert" class="text-destructive-ink text-sm">{emailError}</p>{/if}
						<Button type="submit" variant="outline" class="h-[52px] w-full" disabled={sending}>
							{sending ? 'Enviando…' : 'Enviarme un enlace para entrar'}
						</Button>
					</form>
				{/if}
			{:else if step === 'phone' && session.user}
				<div class="bg-background flex items-center gap-2.5 rounded-tile px-3 py-2.5 text-sm {codeSent ? 'max-lg:hidden' : ''}">
					<span class="bg-secondary flex size-7 items-center justify-center rounded-full text-xs font-extrabold">{session.user.initials}</span>
					<span class="flex-1">{session.user.email}</span>
					<span class="text-state-success-foreground font-semibold">✓</span>
				</div>
				<span class="text-muted-foreground font-mono text-xs font-medium">PASO 2 DE 3</span>
				<PhoneVerify
					title="Verifica tu teléfono"
					description="Te mandamos un código por WhatsApp. Un teléfono, una opinión por marca."
					sendLabel="Enviar código por WhatsApp"
					accountNote
					bind:sent={codeSent}
					onverified={() => ((session.phoneVerified = true), (step = 'welcome'))}
				/>
			{:else if step === 'welcome' && session.user}
				<span class="text-muted-foreground font-mono text-xs font-medium">PASO 3 DE 3</span>
				<div
					class="bg-highlight text-on-highlight flex h-[62px] w-[72px] items-center justify-center rounded-[30px_30px_30px_8px] text-[32px] font-extrabold"
				>
					✓
				</div>
				<h1 class="text-[30px] leading-[1.05] font-extrabold tracking-[-.03em] lg:text-[32px]">
					¡Listo, {session.user.first}! Ya eres usuario verificado.
				</h1>
				<p class="text-muted-foreground text-[15px] leading-normal text-pretty">
					Elige cómo apareces cuando publicas un comentario. Lo puedes cambiar en cada opinión.
				</p>
				<RadioGroup.Root
					aria-label="Cómo apareces"
					bind:value={() => (session.showName ? 'name' : 'verified'), (v) => (session.showName = v === 'name')}
					class="flex flex-col gap-2 lg:grid lg:grid-cols-2"
				>
					{#each options as o (o.value)}
						<!-- La tarjeta entera es el área clicable; el borde se marca cuando el radio está elegido. -->
						<Label
							for="display-{o.value}"
							class="cursor-pointer gap-3 rounded-[14px] px-4 py-3.5 font-normal leading-normal shadow-[inset_0_0_0_1.5px_var(--input)] has-data-checked:shadow-[inset_0_0_0_2px_var(--foreground)] has-focus-visible:focus-halo"
						>
							<RadioGroup.Item id="display-{o.value}" value={o.value} class="lg:sr-only" />
							<span class="flex flex-col gap-0.5">
								<span class="text-[15px] font-semibold">{o.title}</span>
								<span class="text-muted-foreground text-[13px]"><span class="lg:hidden">{o.hint}</span><span class="max-lg:hidden">{o.short}</span></span>
							</span>
						</Label>
					{/each}
				</RadioGroup.Root>
				<div class="flex-1 lg:hidden"></div>
				<Button class="h-[52px] w-full" onclick={() => goto(back)}>Seguir a mi opinión</Button>
			{/if}
		</div>
	</div>
</div>
