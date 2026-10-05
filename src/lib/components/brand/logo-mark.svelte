<script lang="ts">
	// Globo de diálogo (la opinión) con check (verificada). Geometría de static/icono.svg.
	// Bajo 32px se quita el check: queda solo el globo, que se lee mejor (static/favicon.svg).
	let {
		size = 48,
		variant = 'navy',
		check = size >= 32,
		decorative = false,
		class: className
	}: {
		size?: number;
		/** navy = principal · yellow = alternativa (static/icono-alt.svg) */
		variant?: 'navy' | 'yellow';
		check?: boolean;
		/** true cuando va junto al wordmark, que ya lleva el nombre accesible */
		decorative?: boolean;
		class?: string;
	} = $props();

	const NAVY = '#14164A';
	const YELLOW = '#F6C434';
	const bg = $derived(variant === 'navy' ? NAVY : YELLOW);
	const fg = $derived(variant === 'navy' ? YELLOW : NAVY);
</script>

<svg
	viewBox="0 0 96 96"
	width={size}
	height={size}
	role={decorative ? undefined : 'img'}
	aria-label={decorative ? undefined : 'cualeslamejor.cl'}
	aria-hidden={decorative || undefined}
	class={className}
>
	<rect width="96" height="96" rx={check ? 24 : 22} fill={bg} />
	<path d="M43 23H53A24 24 0 0 1 77 47V49A24 24 0 0 1 53 73H25A6 6 0 0 1 19 67V47A24 24 0 0 1 43 23Z" fill={fg} />
	{#if check}
		<path
			d="M35 48.5L44.5 58L61 39"
			fill="none"
			stroke={bg}
			stroke-width="7"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}
</svg>
