<script lang="ts">
	// La pregunta es fija y el usuario la completa. En móvil la parte fija baja a 16px.
	let {
		value = $bindable(''),
		placeholder = 'aerolínea?',
		name = 'q',
		action = '/buscar'
	}: { value?: string; placeholder?: string; name?: string; action?: string } = $props();
</script>

<form
	{action}
	role="search"
	class="bg-card flex h-[60px] items-center gap-2 rounded-full pr-1.5 pl-[22px] shadow-[0_0_0_2px_var(--foreground),var(--shadow-2)] has-focus-visible:shadow-[0_0_0_2px_var(--foreground),0_0_0_6px_rgb(246_196_52/.45)]"
>
	<label for="question-search-{name}" class="text-base font-extrabold whitespace-nowrap sm:text-lg">
		¿Cuál es la mejor
	</label>
	<input
		id="question-search-{name}"
		{name}
		bind:value
		{placeholder}
		autocomplete="off"
		class="placeholder:text-muted-foreground min-w-0 flex-1 border-0 bg-transparent p-0 text-base outline-none focus:ring-0 sm:text-lg"
	/>
	<button
		type="submit"
		aria-label="Buscar"
		class="bg-primary text-primary-foreground hover:bg-primary-hover size-12 shrink-0 cursor-pointer rounded-full text-xl font-semibold"
		>→</button
	>
</form>
