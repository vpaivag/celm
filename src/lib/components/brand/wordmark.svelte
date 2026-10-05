<script lang="ts">
	import { cn } from '#lib/utils.js';

	// Wordmark inline (no <img>): así usa la Bricolage cargada por la app.
	// Geometría de static/wordmark-claro.svg. Mínimo 120px de ancho; 140px en el header móvil.
	//   auto  → claro: "cualesla"+".cl" muted, "mejor" navy · oscuro: blanco, "mejor" amarillo
	//   mono  → todo navy, solo sobre amarillo (piezas de campaña)
	// Nunca "mejor" en amarillo sobre fondo claro (1,6:1).
	let {
		height = 32,
		tone = 'auto',
		class: className
	}: { height?: number; tone?: 'auto' | 'mono'; class?: string } = $props();
</script>

<svg
	viewBox="0 0 660 110"
	width={(height * 660) / 110}
	{height}
	role="img"
	aria-label="cualeslamejor.cl"
	class={cn('shrink-0 overflow-visible', className)}
>
	<text
		x="0"
		y="84"
		font-size="80"
		font-weight="800"
		letter-spacing="-2.4"
		class={cn('font-sans', tone === 'mono' ? 'fill-[#14164A]' : 'fill-muted-foreground dark:fill-foreground')}
		>cualesla<tspan class={tone === 'mono' ? 'fill-[#14164A]' : 'fill-foreground dark:fill-highlight'}>mejor</tspan
		>.cl</text
	>
</svg>
