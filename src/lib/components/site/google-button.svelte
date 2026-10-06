<script lang="ts">
	// Botón de Google de mentira: el círculo gris es el lugar del logo.
	let { onclick }: { onclick: () => void } = $props();
</script>

<button
	type="button"
	{onclick}
	class="focus-visible:focus-halo bg-card hover:bg-secondary flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full text-base font-semibold shadow-[inset_0_0_0_1.5px_var(--input)] outline-none"
>
	<span class="bg-logo-tile size-5 rounded-full shadow-[inset_0_0_0_1px_var(--input)]"></span>
	Continuar con Google
</button>

<span class="text-muted-foreground text-center text-[13px] leading-normal">
	Al continuar aceptas los <a href="#">términos</a> y la <a href="#">política de privacidad</a>.
</span>
