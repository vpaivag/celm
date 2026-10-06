<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';

	// Teléfono → código por WhatsApp. En móvil son dos pantallas; en escritorio,
	// número y código van en el mismo paso.
	// De mentira: cualquier código sirve, salvo 000000, que muestra el error.
	let {
		step,
		title,
		description,
		sendLabel = 'Enviar código',
		accountNote = false,
		sent = $bindable(false),
		onverified
	}: {
		/** "PASO 2 DE 3"; se omite si no hay pasos. */
		step?: string;
		title: string;
		description: string;
		sendLabel?: string;
		/** Aviso de "¿Este número ya tiene cuenta?" cuando el código falla. */
		accountNote?: boolean;
		/** true cuando ya se envió el código. */
		sent?: boolean;
		onverified: () => void;
	} = $props();

	let phone = $state('');
	let code = $state('');
	let attempts = $state(3);
	let wrong = $state(false);
	let seconds = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;
	let otp = $state<HTMLElement | null>(null);
	let done: ReturnType<typeof setTimeout> | undefined;

	const digits = $derived(phone.replace(/\D/g, ''));
	const pretty = $derived(digits.replace(/^(\d)(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' ')));

	async function send() {
		sent = true;
		code = checked = '';
		wrong = false;
		attempts = 3;
		seconds = 42;
		clearInterval(timer);
		timer = setInterval(() => {
			seconds = Math.max(seconds - 1, 0);
			if (!seconds) clearInterval(timer);
		}, 1000);
		// El botón que tenía el foco desaparece: lo pasamos al código.
		await tick();
		otp?.querySelector('input')?.focus();
	}

	// onComplete puede dispararse más de una vez con el mismo valor: se revisa una sola vez.
	let checked = '';

	function setCode(value: string) {
		code = value;
		if (value.length < 6) {
			checked = '';
			wrong = false;
		}
	}

	function check(value: string) {
		if (value.length < 6 || value === checked || !attempts) return;
		checked = value;
		if (value === '000000') {
			wrong = true;
			attempts = Math.max(attempts - 1, 0);
			return;
		}
		// Avisar desmonta el campo. PinInput (bits-ui) se resincroniza hasta 50ms después
		// de cada cambio y lee su propio estado: esperamos a que termine.
		done = setTimeout(onverified, 120);
	}

	onDestroy(() => {
		clearInterval(timer);
		clearTimeout(done);
	});
</script>

<div class="flex flex-1 flex-col gap-[18px] lg:gap-4">
	{#if step}<span class="text-muted-foreground font-mono text-xs font-medium lg:hidden">{step}</span>{/if}

	<h2 class="text-[26px] leading-[1.1] font-extrabold tracking-[-.02em] lg:text-[30px]">
		{#if sent}<span class="lg:hidden">Escribe el código</span><span class="max-lg:hidden">{title}</span>{:else}{title}{/if}
	</h2>
	{#if sent}
		<p class="text-muted-foreground text-[15px] leading-normal lg:hidden">
			Lo enviamos al +56 {pretty}.
			<button type="button" class="cursor-pointer underline underline-offset-3" onclick={() => (sent = false)}>Cambiar</button>
		</p>
	{/if}
	<p class="text-muted-foreground text-[15px] leading-normal text-pretty lg:text-base {sent ? 'max-lg:hidden' : ''}">
		{description}
	</p>

	<div class="flex flex-col gap-1.5 {sent ? 'max-lg:hidden' : ''}">
		<Label for="phone-verify-number" class="text-sm font-semibold">Número de celular</Label>
		<div class="flex gap-2">
			<span class="flex h-[52px] items-center rounded-tile px-3.5 font-mono font-medium shadow-[inset_0_0_0_1.5px_var(--input)]"
				>+56</span
			>
			<Input
				id="phone-verify-number"
				type="tel"
				inputmode="numeric"
				autocomplete="tel-national"
				placeholder="9 1234 5678"
				bind:value={() => pretty, (v) => (phone = v)}
				class="placeholder:text-disabled-foreground h-[52px] flex-1 font-mono font-medium"
			/>
		</div>
	</div>

	{#if sent}
		<div class="flex flex-col gap-2 lg:pt-1">
			<span class="text-sm font-semibold max-lg:hidden">Código</span>
			<InputOTP.Root bind:ref={otp} maxlength={6} bind:value={() => code, setCode} onComplete={check}>
				{#snippet children({ cells })}
					<InputOTP.Group class="gap-2">
						{#each cells as cell, i (i)}
							<InputOTP.Slot
								{cell}
								aria-invalid={wrong || undefined}
								class="h-14 w-12 rounded-tile! border-[1.5px]! text-2xl aria-invalid:border-2 lg:h-[60px] lg:w-[52px] lg:text-[26px]"
							/>
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
			{#if wrong}
				<span role="alert" class="bg-state-error text-state-error-foreground rounded-tile px-3 py-2.5 text-sm font-semibold">
					{attempts
						? `Ese código no coincide. Te quedan ${attempts} ${attempts === 1 ? 'intento' : 'intentos'}.`
						: 'Se acabaron los intentos. Pide un código nuevo.'}
				</span>
			{/if}
			<span class="text-muted-foreground text-sm">
				¿No te llegó?
				{#if seconds}Enviar de nuevo en 0:{String(seconds).padStart(2, '0')}{:else}
					<button type="button" class="cursor-pointer underline underline-offset-3" onclick={send}>Enviar de nuevo</button>
				{/if}
			</span>
		</div>
		<div class="flex-1"></div>
		{#if wrong && accountNote}
			<div class="text-muted-foreground rounded-tile p-3.5 text-[13px] leading-normal shadow-[inset_0_0_0_1px_var(--border)]">
				<b class="text-foreground">¿Este número ya tiene cuenta?</b> Te avisaremos y podrás entrar con esa cuenta. Un número no
				se puede usar en dos.
			</div>
		{/if}
	{:else}
		<div class="flex-1"></div>
		<Button class="h-[52px] w-full" disabled={digits.length < 9} onclick={send}>{sendLabel}</Button>
	{/if}
</div>
