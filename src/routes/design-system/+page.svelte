<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import { Label } from '#lib/components/ui/label/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import { Progress } from '#lib/components/ui/progress/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import {
		Lockup,
		LogoMark,
		LogoTile,
		OfficialData,
		Podium,
		PodiumRank,
		PodiumTie,
		QuestionSearch,
		RankingRow,
		Rating,
		RatingInput,
		ReviewCard,
		ThresholdProgress,
		VerifiedMark,
		Wordmark,
		type OfficialMetric,
		type RankedBrand
	} from '#lib/components/brand/index.js';

	const nav = [
		['logo', '01 Logo'],
		['color', '02 Color'],
		['semantic', '03 Semánticos'],
		['type', '04 Tipografía'],
		['space', '05 Espacio, radio, sombra'],
		['components', '06 Componentes']
	] as const;

	const light = [
		['--background', '#F6F6F9', ''],
		['--card', '#FFFFFF', ''],
		['--secondary', '#EEEEF4', ''],
		['--border', '#E2E3EC', ''],
		['--foreground', '#14164A', '15:1'],
		['--muted-foreground', '#5B5E80', '6:1'],
		['--highlight', '#F6C434', 'solo relleno'],
		['--highlight-ink', '#7A5A00', '6,4:1']
	];
	const dark = [
		['--background', '#0E1036', ''],
		['--card', '#1A1D55', ''],
		['--secondary', '#23266A', ''],
		['--border', '#2C2F6B', ''],
		['--foreground', '#FFFFFF', '17:1'],
		['--muted-foreground', '#A9ABD0', '8:1'],
		['--highlight', '#F6C434', ''],
		['--highlight-ink', '#F6C434', '10:1']
	];

	const typeScale = [
		['display', '34 → 56 · 800', 'lh 1.02 · -3%', 'text-display', '¿Cuál es la mejor AFP?'],
		['h1', '28 → 36 · 800', 'lh 1.1 · -2%', 'text-h1', 'Nadie ha preguntado esto todavía'],
		['h2', '22 → 26 · 600', 'lh 1.2', 'text-h2', 'Empate técnico entre las dos primeras'],
		['h3', '18 · 600', 'lh 1.3', 'text-h3', 'Lo que dicen los datos oficiales'],
		[
			'body',
			'16 · 400',
			'lh 1.5',
			'text-body max-w-[620px] text-pretty',
			'Mostramos la nota promedio de usuarios verificados con teléfono. Si hay menos de 30 opiniones, la categoría queda en construcción y no publicamos podio.'
		],
		['small', '14 · 400', 'lh 1.45', 'text-small text-muted-foreground', '1.204 opiniones · confianza alta'],
		['caption', '12 · 500 · mono', 'lh 1.4', 'text-caption font-mono text-muted-foreground', 'Q2-2026 · FUENTE: JAC']
	];

	const spacing = [4, 8, 12, 16, 24, 32, 48, 72];

	const podium: [RankedBrand, ...RankedBrand[]] = [
		{ name: 'Marca A', rating: 4.4, reviews: 1204, confidence: 'alta' },
		{ name: 'Marca B', rating: 4.1, reviews: 987 },
		{ name: 'Marca C', rating: 3.8, reviews: 642 }
	];
	const rows: RankedBrand[] = [
		{ name: 'Marca D', rating: 3.6, reviews: 318, confidence: 'media' },
		{ name: 'Marca E', rating: 3.1, reviews: 41, confidence: 'baja' },
		{ name: 'Marca F', rating: 0, reviews: 6 }
	];
	const official: OfficialMetric[] = [
		{ label: 'Puntualidad', value: '91,2%', period: 'Q2-2026', source: 'JAC', sourceHref: '#' },
		{ label: 'Reclamos por 10.000 pasajeros', value: '1,8', period: 'Q2-2026', source: 'SERNAC', sourceHref: '#' },
		{
			label: 'Pasajeros transportados',
			value: '2,1 M',
			period: 'Q2-2026',
			source: 'JAC',
			sourceHref: '#',
			tag: 'TAMAÑO, NO CALIDAD'
		}
	];

	let rating = $state(4);
	let showName = $state(false);
	let otp = $state('481');
	let email = $state('vicente@');
	let opinion = $state('');

	const card = 'bg-card rounded-card shadow-[inset_0_0_0_1px_var(--border)] p-5 flex flex-col gap-3.5';
	const label = 'font-mono text-[11px] font-medium text-muted-foreground uppercase';
	const note = 'text-sm text-muted-foreground text-pretty';
</script>

<svelte:head>
	<title>Sistema de marca · cualeslamejor.cl</title>
</svelte:head>

{#snippet sectionTitle(n: string, title: string, intro?: string)}
	<div class="flex flex-col gap-1.5">
		<span class="text-muted-foreground font-mono text-[13px] font-medium">{n}</span>
		<h2 class="text-[32px] leading-[1.1] font-extrabold tracking-[-.02em]">{title}</h2>
		{#if intro}<p class="text-muted-foreground max-w-[680px] text-pretty">{intro}</p>{/if}
	</div>
{/snippet}

{#snippet swatches(list: string[][], title: string)}
	<span class={label}>{title}</span>
	<div class="grid grid-cols-4 gap-2.5 font-mono text-[11px] leading-[1.35] text-muted-foreground">
		{#each list as [name, hex, extra] (name)}
			<div class="flex flex-col gap-1.5">
				<div class="h-14 rounded-[10px] shadow-[inset_0_0_0_1px_var(--border)]" style:background={hex}></div>
				<b class="text-foreground font-medium break-all">{name}</b>{hex}{extra ? ` · ${extra}` : ''}
			</div>
		{/each}
	</div>
{/snippet}

<div class="mx-auto flex max-w-[1120px] flex-col gap-[72px] px-6 pt-12 pb-24">
	<header class="flex flex-col gap-5">
		<Lockup height={44} />
		<h1 class="text-[clamp(34px,6vw,56px)] leading-[1.02] font-extrabold tracking-[-.03em]">Sistema de marca</h1>
		<p class="text-muted-foreground max-w-[680px] text-lg text-pretty">
			Logo, color, tipografía y componentes de cualeslamejor.cl, versión 0.1. Tokens en
			<code class="font-mono text-sm">src/routes/layout.css</code>, primitivas en
			<code class="font-mono text-sm">#lib/components/ui</code> y piezas de marca en
			<code class="font-mono text-sm">#lib/components/brand</code>.
		</p>
		<nav class="flex flex-wrap gap-2">
			{#each nav as [id, text] (id)}
				<a
					href="#{id}"
					data-slot="nav"
					class="bg-card rounded-full px-3 py-1.5 font-mono text-[13px] font-medium shadow-[inset_0_0_0_1px_var(--border)] hover:bg-secondary"
					>{text}</a
				>
			{/each}
		</nav>
	</header>

	<!-- 01 Logo -->
	<section id="logo" class="flex flex-col gap-6">
		{@render sectionTitle('01', 'Logo')}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
			<div class="{card} min-h-[200px] justify-between">
				<span class={label}>Wordmark · fondo claro</span>
				<Wordmark height={52} class="max-w-full self-center" />
				<span class="text-muted-foreground font-mono text-[11px]">"cualesla" + ".cl" #5B5E80 · "mejor" #14164A</span>
			</div>
			<div class="dark bg-background flex min-h-[200px] flex-col justify-between rounded-card p-5" style:background="#14164A">
				<span class={label}>Wordmark · fondo oscuro</span>
				<Wordmark height={52} class="max-w-full self-center" />
				<span class="text-muted-foreground font-mono text-[11px]">blanco · "mejor" #F6C434</span>
			</div>
			<div class="bg-highlight flex min-h-[200px] flex-col justify-between rounded-card p-5 text-[#14164A]">
				<span class="font-mono text-[11px] font-medium">WORDMARK · SOBRE AMARILLO (USO ESPECIAL)</span>
				<Wordmark height={52} tone="mono" class="max-w-full self-center" />
				<span class="font-mono text-[11px]">monocromo navy · solo piezas de campaña</span>
			</div>
		</div>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
			<div class={card}>
				<span class={label}>Ícono de app</span>
				<div class="flex items-end gap-4">
					<LogoMark size={96} />
					<LogoMark size={48} variant="yellow" />
				</div>
				<span class={note}>
					Globo de diálogo (la opinión) con check (verificada). Esquina inferior izquierda recta, como un mensaje enviado. La
					versión amarilla es la alternativa.
				</span>
			</div>
			<div class={card}>
				<span class={label}>Favicon</span>
				<div class="flex items-end gap-4">
					<LogoMark size={32} check={false} />
					<LogoMark size={16} />
				</div>
				<span class={note}>Bajo 32px se quita el check: queda solo el globo, que se lee mejor en la pestaña.</span>
			</div>
			<div class={card}>
				<span class={label}>Espacio y tamaño mínimo</span>
				<div class="self-start rounded-official border-[1.5px] border-dashed border-[#B9BBD3] p-4">
					<Wordmark height={30} />
				</div>
				<span class={note}>
					Margen libre = alto de la "m" en todos los lados. Wordmark mínimo 120px de ancho; en el header móvil, 140px.
				</span>
			</div>
		</div>
		<div class="{card} px-6">
			<span class="font-mono text-[11px] font-medium text-[#B3261E]">NO HACER</span>
			<ul class="flex list-disc flex-col gap-1.5 pl-[18px] text-[15px] leading-snug">
				<li>"mejor" en amarillo sobre fondo claro (contraste 1,6:1).</li>
				<li>Poner el logo sobre colores de marcas rankeadas, ni junto a sus logos sin su contenedor neutro.</li>
				<li>Agregar sellos, estrellas o medallas al logo. Sugieren "premio" o "auspicio".</li>
				<li>Escribirlo en camel case (CualEsLaMejor). En texto corrido se escribe cualeslamejor.cl.</li>
			</ul>
		</div>
	</section>

	<!-- 02 Color -->
	<section id="color" class="flex flex-col gap-6">
		{@render sectionTitle(
			'02',
			'Color base',
			'Navy para confianza, amarillo para "lo que dice la gente". El amarillo nunca es texto sobre fondo claro; para eso existe --highlight-ink.'
		)}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-4">
			<div class="bg-background flex flex-col gap-3 rounded-card p-5 shadow-[inset_0_0_0_1px_var(--border)]">
				{@render swatches(light, 'Tema claro')}
			</div>
			<div class="dark bg-background text-foreground flex flex-col gap-3 rounded-card p-5">
				{@render swatches(dark, 'Tema oscuro')}
			</div>
		</div>
	</section>

	<!-- 03 Semánticos -->
	<section id="semantic" class="flex flex-col gap-6">
		{@render sectionTitle(
			'03',
			'Colores semánticos',
			'Cada uno significa una sola cosa. La comunidad usa formas redondeadas y el amarillo; los datos oficiales, un gris frío, esquinas rectas y números en mono. Nunca se mezclan en una misma tarjeta.'
		)}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
			<div class={card}>
				<span class={label}>Nota (estrellas)</span>
				<div class="flex flex-wrap gap-4">
					<div class="bg-card rounded-tile px-3.5 py-2.5 shadow-[inset_0_0_0_1px_var(--border)]">
						<Rating value={4.3} size={20} />
						<span class="ml-2 text-lg font-extrabold">4,3</span>
					</div>
					<div class="dark bg-card text-foreground rounded-tile px-3.5 py-2.5">
						<Rating value={4.3} size={20} />
						<span class="ml-2 text-lg font-extrabold">4,3</span>
					</div>
				</div>
				<span class={note}>En claro, la estrella baja a #B07F00 para llegar a 3:1. La cifra siempre acompaña a las estrellas.</span>
			</div>

			<div class={card}>
				<span class={label}>Podio</span>
				<div class="flex items-center gap-2.5">
					<PodiumRank rank={1} />
					<PodiumRank rank={2} />
					<PodiumRank rank={3} />
					<PodiumRank rank={4} />
					<PodiumRank rank="1–2 empate" tied class="text-sm!" />
				</div>
				<span class={note}>
					Sin oro, plata ni bronce. Solo el #1 lleva amarillo. En un empate técnico nadie lo lleva: los empatados comparten el
					contorno.
				</span>
			</div>

			<OfficialData metrics={official.slice(1)} />

			<div class="{card} col-span-full">
				<span class={label}>Estados · claro</span>
				<div class="flex flex-wrap gap-2.5">
					<Badge variant="verified"><VerifiedMark />Usuario verificado</Badge>
					<Badge variant="building">Ranking en construcción</Badge>
					<Badge variant="nodata">Sin datos suficientes</Badge>
					<Badge variant="review">En revisión</Badge>
					<Badge variant="error">No pudimos guardar tu opinión</Badge>
					<Badge variant="success">¡Listo! Gracias por contarnos</Badge>
				</div>
				<div class="flex max-w-[420px] flex-col gap-1.5">
					<div class="text-muted-foreground flex justify-between font-mono text-[13px] font-medium">
						<span>12 de 30 opiniones</span><span>faltan 18</span>
					</div>
					<Progress value={40} />
				</div>
				<span class="{label} mt-1.5">Estados · oscuro</span>
				<div class="dark bg-background flex flex-wrap gap-2.5 rounded-tile p-3.5">
					<Badge variant="verified"><VerifiedMark />Usuario verificado</Badge>
					<Badge variant="building">Ranking en construcción</Badge>
					<Badge variant="nodata">Sin datos suficientes</Badge>
					<Badge variant="review">En revisión</Badge>
					<Badge variant="error">No pudimos guardar tu opinión</Badge>
					<Badge variant="success">¡Listo! Gracias por contarnos</Badge>
				</div>
				<span class={note}>
					"En construcción" es el único estado con borde punteado: algo que aún se está armando. "En revisión" usa un azul
					lavanda apagado, lejos del azul de las telcos.
				</span>
			</div>

			<div class="{card} col-span-full">
				<span class={label}>Contenedor de logos de terceros</span>
				<div class="flex flex-wrap gap-3">
					<LogoTile />
					<LogoTile />
					<LogoTile />
					<div class="dark bg-card rounded-tile p-2"><LogoTile /></div>
				</div>
				<span class={note}>
					El fondo es el mismo claro también en tema oscuro, para que los logos a color se vean iguales en los dos y ninguno
					"gane" por su fondo.
				</span>
			</div>
		</div>
	</section>

	<!-- 04 Tipografía -->
	<section id="type" class="flex flex-col gap-6">
		{@render sectionTitle('04', 'Tipografía')}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
			<div class="{card} gap-2.5 p-6">
				<span class={label}>Familia principal</span>
				<span class="text-[56px] leading-none font-extrabold tracking-[-.03em]">Bricolage Grotesque</span>
				<span class="text-xl">¿Cuál? ¡Cuéntanos! á é í ó ú ü ñ Ñ · 0123456789</span>
				<span class={note}>Pesos 400, 600 y 800. Tiene eje óptico: en tamaños grandes se cierra y gana carácter.</span>
			</div>
			<div class="bg-official flex flex-col gap-2.5 rounded-official p-6 shadow-[inset_0_0_0_1px_var(--official-line)]">
				<span class="text-official-ink font-mono text-[11px] font-medium">FAMILIA DE DATOS</span>
				<span class="font-mono text-[44px] leading-none font-medium tracking-[-.02em]">IBM Plex Mono</span>
				<span class="font-mono text-lg">Q2-2026 · 98,4% · 1.204</span>
				<span class="text-official-ink text-sm text-pretty">
					Pesos 400 y 500. Para datos oficiales, fuentes, periodos, contadores y el backoffice.
				</span>
			</div>
		</div>
		<div class="{card} gap-0 px-6 py-2">
			{#each typeScale as [name, size, lh, cls, sample] (name)}
				<div class="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-baseline gap-4 border-b border-secondary py-[18px]">
					<span class="text-muted-foreground font-mono text-xs leading-normal">{name}<br />{size}<br />{lh}</span>
					<span class={cls}>{sample}</span>
				</div>
			{/each}
			<div class="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-baseline gap-4 py-[18px]">
				<span class="text-muted-foreground font-mono text-xs leading-normal">score<br />18 → 28 · 800</span>
				<span class="text-[28px] leading-none font-extrabold">4,3 <span class="text-muted-foreground text-base font-normal">de 5</span></span>
			</div>
		</div>
		<span class="{note} max-w-[680px]">
			El primer valor es para móvil (360px) y el segundo para escritorio (≥1024px), interpolados con clamp(). Las cifras usan
			coma decimal y punto de miles (4,3 · 1.204): usa <code class="font-mono">formatScore</code> y
			<code class="font-mono">formatCount</code> de <code class="font-mono">#lib/format</code>.
		</span>
	</section>

	<!-- 05 Espacio -->
	<section id="space" class="flex flex-col gap-6">
		{@render sectionTitle('05', 'Espacio, radio y sombra')}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
			<div class="{card} gap-2.5">
				<span class={label}>Espacio · base 4</span>
				{#each spacing as px, i (px)}
					<div class="text-muted-foreground flex items-center gap-2.5 font-mono text-xs">
						<span class="w-[52px]">s-{i + 1}</span>
						<div class="bg-foreground h-3 rounded-[2px]" style:width="{px}px"></div>
						{px}
					</div>
				{/each}
			</div>
			<div class={card}>
				<span class={label}>Radio</span>
				<div class="text-muted-foreground grid grid-cols-3 gap-3 font-mono text-[11px] leading-snug">
					<div class="flex flex-col gap-1.5"><div class="bg-secondary h-[52px] rounded-official shadow-[inset_0_0_0_1.5px_var(--foreground)]"></div>rounded-official 6<br />datos oficiales</div>
					<div class="flex flex-col gap-1.5"><div class="bg-secondary h-[52px] rounded-tile shadow-[inset_0_0_0_1.5px_var(--foreground)]"></div>rounded-tile 12<br />inputs, logos</div>
					<div class="flex flex-col gap-1.5"><div class="bg-secondary h-[52px] rounded-card shadow-[inset_0_0_0_1.5px_var(--foreground)]"></div>rounded-card 18<br />tarjetas</div>
					<div class="flex flex-col gap-1.5"><div class="bg-highlight h-[52px] rounded-bubble"></div>rounded-bubble<br />#1, reseñas</div>
					<div class="flex flex-col gap-1.5"><div class="bg-secondary h-[52px] rounded-full shadow-[inset_0_0_0_1.5px_var(--foreground)]"></div>rounded-full<br />badges, búsqueda</div>
				</div>
			</div>
			<div class="bg-background flex flex-col gap-3.5 rounded-card p-5 shadow-[inset_0_0_0_1px_var(--border)]">
				<span class={label}>Sombra</span>
				<div class="text-muted-foreground grid grid-cols-2 gap-4 font-mono text-[11px] leading-snug">
					<div class="flex flex-col gap-2"><div class="bg-card shadow-1 h-16 rounded-tile"></div>shadow-1<br />tarjetas en reposo</div>
					<div class="flex flex-col gap-2"><div class="bg-card shadow-2 h-16 rounded-tile"></div>shadow-2<br />búsqueda, menús, modales</div>
				</div>
				<span class={note}>En oscuro las sombras no se ven; la elevación se marca con bg-secondary.</span>
			</div>
		</div>
	</section>

	<!-- 06 Componentes -->
	<section id="components" class="flex flex-col gap-8">
		{@render sectionTitle(
			'06',
			'Componentes',
			'Pensados primero para móvil (360 px). Las marcas son genéricas a propósito.'
		)}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-start gap-4">
			<div class="{card} gap-[18px] p-6">
				<span class={label}>Botones</span>
				<div class="flex flex-wrap items-center gap-2.5">
					<Button>Cuéntanos</Button>
					<Button variant="outline">Proponer categoría</Button>
					<Button variant="link">Cómo calculamos</Button>
				</div>
				<div class="flex flex-wrap items-center gap-2.5">
					<Button size="sm">Aprobar</Button>
					<Button size="sm" variant="destructive">Rechazar</Button>
					<Button size="sm" disabled>Enviar</Button>
				</div>
				<span class={note}>
					Primario navy (uno por pantalla), secundario contorno, terciario como enlace. Destructivo solo en contorno rojo y
					siempre con confirmación. 48 px en público, 36 px en backoffice. Ningún botón es amarillo: el amarillo es de la gente.
				</span>
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Búsqueda</span>
				<QuestionSearch />
				<div class="flex flex-wrap gap-2">
					{#each ['AFP', 'Aerolínea', 'Internet hogar', 'App de delivery'] as c (c)}
						<Badge variant="chip" href="#">{c}</Badge>
					{/each}
				</div>
				<span class={note}>La pregunta es fija y el usuario la completa. En móvil, si no cabe, la parte fija baja a 16 px.</span>
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Estrellas · lectura</span>
				<div class="flex flex-col gap-3">
					<div class="flex items-baseline gap-2.5">
						<span class="text-[40px] leading-none font-extrabold">4,3</span>
						<Rating value={4.3} size={22} />
						<span class="text-muted-foreground text-sm">1.204 opiniones</span>
					</div>
					<div class="flex items-center gap-2">
						<Rating value={4.3} showValue />
						<span class="text-muted-foreground text-[13px]">(1.204)</span>
					</div>
					<div class="flex items-center gap-2">
						<Rating value={null} />
						<span class="text-muted-foreground text-[13px]">Aún sin nota</span>
					</div>
				</div>
				<span class="{label} mt-1.5">Estrellas · entrada</span>
				<RatingInput bind:value={rating} />
				<span class={note}>
					La nota en número siempre va primero; las estrellas la acompañan. En la entrada, cada estrella mide 48 px de área
					táctil y la frase cambia según la nota.
				</span>
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Podio</span>
				<Podium entries={podium} />
				<span class="{label} mt-1.5">Podio · empate técnico</span>
				<PodiumTie
					entries={[
						{ name: 'Marca A', rating: 4.2, reviews: 811 },
						{ name: 'Marca B', rating: 4.2, reviews: 790 }
					]}
				/>
			</div>

			<div class="{card} p-6">
				<span class={label}>Fila de listado</span>
				<div>
					{#each rows as brand, i (brand.name)}
						<RankingRow rank={i + 4} {brand} />
					{/each}
				</div>
				<span class={note}>
					Con menos de 10 opiniones la marca aparece, pero sin posición ni nota. Va al final de la lista, en orden alfabético.
				</span>
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Progreso hasta el umbral</span>
				<ThresholdProgress count={12} threshold={30}>
					{#snippet action()}<Button>¿Lo has usado? Cuéntanos</Button>{/snippet}
				</ThresholdProgress>
				<span class={note}>Barra en navy, no en amarillo: todavía no hay "nota de la gente" que mostrar.</span>
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Panel de datos oficiales</span>
				<OfficialData metrics={official} />
				<OfficialData />
			</div>

			<div class="{card} p-6">
				<span class={label}>Tarjeta de reseña</span>
				<ReviewCard
					rating={4}
					time="hace 3 días"
					text="Llegó a la hora y el personal fue amable. Me cobraron extra por la maleta de mano y eso no me lo esperaba."
					onreport={() => {}}
				/>
				<ReviewCard rating={2} author="Vicente P." time="hace 1 semana" text="Me cambiaron el vuelo dos veces sin avisar." onreport={() => {}} />
				<ReviewCard pending text="Buen precio, pero el embarque fue un desorden." onedit={() => {}} />
			</div>

			<div class="{card} gap-[18px] p-6">
				<span class={label}>Formularios</span>
				<div class="flex flex-col gap-1.5">
					<Label for="ds-cat" class="text-sm font-semibold">Nombre de la categoría</Label>
					<Input id="ds-cat" placeholder="Ej.: clínica dental" />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="ds-op" class="text-sm font-semibold">
						Tu opinión <span class="text-muted-foreground font-normal">(opcional)</span>
					</Label>
					<Textarea id="ds-op" rows={3} maxlength={500} bind:value={opinion} placeholder="¿Qué le dirías a un amigo que lo está pensando?" />
					<span class="text-muted-foreground self-end font-mono text-xs">{opinion.length} / 500</span>
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="ds-mail" class="text-sm font-semibold">Correo</Label>
					<Input id="ds-mail" type="email" bind:value={email} aria-invalid={!email.includes('.')} aria-describedby="ds-mail-err" />
					{#if !email.includes('.')}
						<span id="ds-mail-err" class="text-destructive-ink text-[13px]">Revisa el correo, parece que falta algo.</span>
					{/if}
				</div>
				<div class="border-secondary flex items-center justify-between gap-4 border-t py-3">
					<span class="flex flex-col gap-0.5">
						<Label for="ds-name" class="text-[15px] font-semibold">Mostrar mi nombre (Vicente P.)</Label>
						<span class="text-muted-foreground text-[13px]">
							Tu reseña dirá "{showName ? 'Vicente P.' : 'Usuario verificado'}"
						</span>
					</span>
					<Switch id="ds-name" bind:checked={showName} />
				</div>
				<div class="border-secondary flex flex-col gap-2 border-t pt-3">
					<span class="text-sm font-semibold">Código que te enviamos por WhatsApp</span>
					<InputOTP.Root maxlength={6} bind:value={otp}>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells as cell, i (i)}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
					<span class="text-muted-foreground text-[13px]">¿No te llegó? <a href="#components">Enviar de nuevo</a> en 0:42</span>
				</div>
				<span class={note}>El foco usa un halo amarillo suave sobre el borde navy: es visible sin ser texto amarillo.</span>
			</div>

			<div class="dark bg-background text-foreground flex flex-col gap-3.5 rounded-card p-6">
				<span class={label}>En tema oscuro</span>
				<div class="bg-card rounded-card px-4">
					<RankingRow rank={1} brand={podium[0]} />
				</div>
				<ReviewCard text="Llegó a la hora y el personal fue amable." />
				<OfficialData metrics={official.slice(0, 1)} />
				<div class="flex flex-wrap gap-2.5">
					<Button>Cuéntanos</Button>
					<Button variant="outline">Proponer categoría</Button>
				</div>
				<span class={note}>En oscuro el botón primario se invierte a blanco. Los logos de terceros mantienen su contenedor claro.</span>
			</div>
		</div>

		<div class="{card} gap-4 p-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<span class={label}>Tabla de backoffice · cola de moderación</span>
				<span class="text-muted-foreground font-mono text-xs font-medium">3 pendientes</span>
			</div>
			<div class="overflow-x-auto">
				<div class="flex min-w-[760px] flex-col text-sm">
					<div
						class="bg-background text-muted-foreground grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.5fr)_240px] gap-4 rounded-official px-3 py-2.5 font-mono text-[11px] font-medium tracking-[.04em]"
					>
						<span>CONTENIDO</span><span>TIPO</span><span>CLASIFICADOR</span><span>ACCIÓN</span>
					</div>
					{#snippet classifier(decision: string, score: number, tone = '')}
						<span class="flex flex-col gap-1">
							<span class="font-semibold {tone}">{decision}</span>
							<span class="text-muted-foreground flex items-center gap-2 font-mono text-xs font-medium">
								<span class="bg-secondary block h-1.5 w-16 overflow-hidden rounded-[3px]">
									<span class="bg-foreground block h-full" style:width="{score}%"></span>
								</span>
								{score}%{score < 70 ? ' · revisar' : ''}
							</span>
						</span>
					{/snippet}
					<div class="border-secondary grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.5fr)_240px] items-center gap-4 border-b px-3 py-3.5">
						<span class="flex flex-col gap-0.5">
							<span class="text-pretty">"Me cobraron dos veces y nadie responde el chat."</span>
							<span class="text-muted-foreground font-mono text-[11px]">Reseña · App de delivery · Marca A</span>
						</span>
						<span>Reseña</span>
						{@render classifier('Aprobar', 96)}
						<span class="flex gap-1.5"><Button size="sm">Aprobar</Button><Button size="sm" variant="destructive">Rechazar</Button></span>
					</div>
					<div class="border-secondary bg-highlight-soft grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.5fr)_240px] items-center gap-4 border-b px-3 py-3.5">
						<span class="flex flex-col gap-0.5">
							<span>"Marca A Empresas"</span>
							<span class="text-muted-foreground font-mono text-[11px]">Marca sugerida · Telefonía móvil · 14 pedidos</span>
						</span>
						<span>Marca nueva</span>
						{@render classifier('Fusionar con "Marca A"', 81)}
						<span class="flex gap-1.5">
							<AlertDialog.Root>
								<AlertDialog.Trigger>
									{#snippet child({ props })}<Button size="sm" {...props}>Fusionar…</Button>{/snippet}
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>¿Fusionar "Marca A Empresas" con "Marca A"?</AlertDialog.Title>
									</AlertDialog.Header>
									<div class="bg-state-error flex flex-col gap-1 rounded-tile p-3.5">
										<span class="text-state-error-foreground text-[15px] font-semibold">Esto moverá 43 votos de 38 usuarios.</span>
										<AlertDialog.Description class="text-foreground/80 text-left text-[13px] leading-snug">
											La nota de "Marca A" en Telefonía móvil puede cambiar. Queda en el registro de auditoría y se puede deshacer
											por 30 días.
										</AlertDialog.Description>
									</div>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
										<AlertDialog.Action variant="destructive-solid">Fusionar y mover 43 votos</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
							<Button size="sm" variant="outline">Crear marca</Button>
						</span>
					</div>
					<div class="grid grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1.5fr)_240px] items-center gap-4 px-3 py-3.5">
						<span class="flex flex-col gap-0.5">
							<span class="text-muted-foreground">"[contenido ofensivo oculto]" <a href="#components" class="text-xs">ver</a></span>
							<span class="text-muted-foreground font-mono text-[11px]">Reseña · Internet hogar · Marca C</span>
						</span>
						<span>Reseña</span>
						{@render classifier('Rechazar · insultos', 58, 'text-destructive-ink')}
						<span class="flex gap-1.5"><Button size="sm" variant="outline">Aprobar</Button><Button size="sm" variant="destructive">Rechazar</Button></span>
					</div>
				</div>
			</div>
			<span class={note}>
				La decisión del clasificador es una sugerencia, nunca una acción automática. Bajo 70% de confianza la fila dice
				"revisar" y ningún botón aparece como primario. Las filas con impacto alto (fusiones) se marcan con un fondo amarillo
				muy suave. Prueba "Fusionar…".
			</span>
		</div>
	</section>
</div>
