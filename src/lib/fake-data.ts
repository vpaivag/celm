// Datos de mentira para armar la UI. Nada de esto viene de un backend todavía.
import type { Confidence, RankedBrand } from '#lib/components/brand/types.js';

/** Bajo este total de opiniones la categoría está "en construcción". */
export const MIN_REVIEWS_TO_PUBLISH = 30;
/** Bajo este número de opiniones una marca aparece sin posición ni nota. */
export const MIN_REVIEWS_PER_BRAND = 10;

export type Brand = { slug: string; name: string };

export type OfficialIndicator = {
	title: string;
	/** Etiqueta aclaratoria, p. ej. "TAMAÑO, NO CALIDAD". */
	tag?: string;
	period: string;
	source: string;
	rows: [brand: string, value: string][];
};

type Entry = { brand: string; rating: number; reviews: number };

export type Category = {
	slug: string;
	/** En minúscula y singular, tal como va en la pregunta. */
	name: string;
	/** Para la miga de pan. */
	plural: string;
	gender: 'f' | 'm';
	/** "¿Volaste con alguna?" */
	cta: string;
	entries: Entry[];
	official: OfficialIndicator[];
};

export type Review = {
	brand: string;
	category: string;
	rating: number;
	text: string;
	author?: string;
	time: string;
};

export const brands: Brand[] = 'ABCDEFGHI'.split('').map((l) => ({
	slug: `marca-${l.toLowerCase()}`,
	name: `Marca ${l}`
}));

export const categories: Category[] = [
	{
		slug: 'aerolinea',
		name: 'aerolínea',
		plural: 'Aerolíneas',
		gender: 'f',
		cta: '¿Volaste con alguna?',
		entries: [
			{ brand: 'marca-a', rating: 4.4, reviews: 1204 },
			{ brand: 'marca-b', rating: 4.1, reviews: 702 },
			{ brand: 'marca-c', rating: 3.7, reviews: 512 },
			{ brand: 'marca-d', rating: 3.6, reviews: 388 },
			{ brand: 'marca-e', rating: 3.2, reviews: 212 },
			{ brand: 'marca-f', rating: 4.8, reviews: 4 }
		],
		official: [
			{
				title: 'Puntualidad',
				period: 'Q2-2026',
				source: 'JAC',
				rows: [
					['Marca A', '91,2%'],
					['Marca B', '88,7%'],
					['Marca C', '93,0%']
				]
			},
			{
				title: 'Pasajeros transportados',
				tag: 'TAMAÑO, NO CALIDAD',
				period: 'Q2-2026',
				source: 'JAC',
				rows: [
					['Marca A', '2,1 M'],
					['Marca B', '1,4 M']
				]
			},
			{
				title: 'Reclamos cada 100.000 pasajeros',
				period: 'Q2-2026',
				source: 'SERNAC',
				rows: [
					['Marca A', '4,1'],
					['Marca B', '6,3'],
					['Marca C', '3,8']
				]
			},
			{
				title: 'Equipaje extraviado',
				period: 'Q2-2026',
				source: 'JAC',
				rows: [
					['Marca A', '0,4%'],
					['Marca B', '0,7%'],
					['Marca C', '0,5%']
				]
			}
		]
	},
	{
		slug: 'afp',
		name: 'AFP',
		plural: 'AFP',
		gender: 'f',
		cta: '¿Estás en alguna?',
		entries: [
			{ brand: 'marca-g', rating: 4.2, reviews: 880 },
			{ brand: 'marca-h', rating: 4.0, reviews: 650 },
			{ brand: 'marca-i', rating: 3.7, reviews: 420 },
			{ brand: 'marca-b', rating: 3.4, reviews: 154 }
		],
		official: [
			{
				title: 'Rentabilidad fondo C · 12 meses',
				period: 'Ago-2026',
				source: 'Superintendencia de Pensiones',
				rows: [
					['Marca G', '9,8%'],
					['Marca H', '9,1%'],
					['Marca I', '8,7%']
				]
			}
		]
	},
	{
		slug: 'telefonia-movil',
		name: 'telefonía móvil',
		plural: 'Telefonía móvil',
		gender: 'f',
		cta: '¿Eres cliente de alguna?',
		entries: [
			{ brand: 'marca-a', rating: 4.4, reviews: 1204 },
			{ brand: 'marca-b', rating: 3.9, reviews: 640 },
			{ brand: 'marca-c', rating: 3.8, reviews: 510 },
			{ brand: 'marca-d', rating: 3.5, reviews: 402 },
			{ brand: 'marca-e', rating: 3.3, reviews: 250 },
			{ brand: 'marca-f', rating: 3.1, reviews: 96 },
			{ brand: 'marca-g', rating: 2.9, reviews: 40 },
			{ brand: 'marca-h', rating: 3.5, reviews: 7 }
		],
		official: [
			{
				title: 'Reclamos cada 10.000 clientes',
				period: 'Q2-2026',
				source: 'SUBTEL',
				rows: [
					['Marca A', '3,2'],
					['Marca B', '5,9'],
					['Marca C', '4,4']
				]
			}
		]
	},
	{
		slug: 'internet-hogar',
		name: 'internet hogar',
		plural: 'Internet hogar',
		gender: 'm',
		cta: '¿Tienes alguno?',
		entries: [
			{ brand: 'marca-b', rating: 4.0, reviews: 1010 },
			{ brand: 'marca-c', rating: 3.9, reviews: 640 },
			{ brand: 'marca-d', rating: 3.7, reviews: 520 },
			{ brand: 'marca-a', rating: 3.6, reviews: 815 },
			{ brand: 'marca-e', rating: 3.4, reviews: 96 },
			{ brand: 'marca-f', rating: 3.0, reviews: 23 },
			{ brand: 'marca-g', rating: 4.1, reviews: 7 },
			{ brand: 'marca-h', rating: 2.0, reviews: 3 },
			{ brand: 'marca-i', rating: 5.0, reviews: 1 }
		],
		official: []
	},
	{
		slug: 'internet-movil',
		name: 'internet móvil',
		plural: 'Internet móvil',
		gender: 'm',
		cta: '¿Lo has usado?',
		entries: [
			{ brand: 'marca-b', rating: 4.0, reviews: 5 },
			{ brand: 'marca-c', rating: 3.5, reviews: 4 },
			{ brand: 'marca-d', rating: 3.0, reviews: 3 }
		],
		official: []
	},
	{
		slug: 'app-de-delivery',
		name: 'app de delivery',
		plural: 'Apps de delivery',
		gender: 'f',
		cta: '¿Lo has usado?',
		entries: [
			{ brand: 'marca-e', rating: 4.0, reviews: 5 },
			{ brand: 'marca-f', rating: 3.5, reviews: 4 },
			{ brand: 'marca-g', rating: 3.0, reviews: 2 },
			{ brand: 'marca-h', rating: 4.0, reviews: 1 }
		],
		official: []
	},
	{
		slug: 'television-de-pago',
		name: 'televisión de pago',
		plural: 'Televisión de pago',
		gender: 'f',
		cta: '¿Eres cliente de alguna?',
		entries: [
			{ brand: 'marca-a', rating: 3.8, reviews: 6 },
			{ brand: 'marca-b', rating: 3.2, reviews: 4 },
			{ brand: 'marca-c', rating: 2.5, reviews: 2 }
		],
		official: []
	}
];

export const reviews: Review[] = [
	{
		brand: 'marca-a',
		category: 'telefonia-movil',
		rating: 4,
		text: 'Buena señal en Santiago, pero en la playa se cae a cada rato.',
		time: 'hace 2 días'
	},
	{
		brand: 'marca-a',
		category: 'internet-hogar',
		rating: 3,
		author: 'Camila R.',
		text: 'El técnico llegó, pero tuve que esperar dos semanas.',
		time: 'hace 5 días'
	},
	{
		brand: 'marca-a',
		category: 'aerolinea',
		rating: 5,
		text: 'Llegó a la hora y el personal fue amable.',
		time: 'hace 1 semana'
	},
	{
		brand: 'marca-b',
		category: 'aerolinea',
		rating: 2,
		author: 'Vicente P.',
		text: 'Me cambiaron el vuelo dos veces sin avisar.',
		time: 'hace 1 semana'
	}
];

/** Lo que aparece en "Lo más consultado" y en los chips. */
export const popular = ['afp', 'aerolinea', 'app-de-delivery'];
export const homeChips = ['afp', 'aerolinea', 'telefonia-movil', 'internet-hogar', 'app-de-delivery'];

// ── helpers ──────────────────────────────────────────────────────────────────

export const brandBySlug = (slug: string) => brands.find((b) => b.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const question = (c: Pick<Category, 'gender' | 'name'>) =>
	`¿Cuál es ${c.gender === 'm' ? 'el mejor' : 'la mejor'} ${c.name}?`;

/** La URL es la pregunta: /cual-es-la-mejor-aerolinea · /cual-es-el-mejor-internet-hogar */
export const categoryPath = (c: Pick<Category, 'gender' | 'slug'>) =>
	`/cual-es-${c.gender === 'm' ? 'el' : 'la'}-mejor-${c.slug}`;

export const QUESTION_PATH = /^cual-es-(?:la|el)-mejor-(.+)$/;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const totalReviews = (c: Category) => c.entries.reduce((n, e) => n + e.reviews, 0);
export const isBuilding = (c: Category) => totalReviews(c) < MIN_REVIEWS_TO_PUBLISH;

const confidenceFor = (reviews: number): Confidence =>
	reviews >= 300 ? 'alta' : reviews >= 50 ? 'media' : 'baja';

export type RankedEntry = RankedBrand & { slug: string };

const toRanked = (e: Entry): RankedEntry => ({
	slug: e.brand,
	name: brandBySlug(e.brand)?.name ?? e.brand,
	rating: e.rating,
	reviews: e.reviews,
	confidence: confidenceFor(e.reviews)
});

/** Marcas con opiniones suficientes, de mejor a peor. */
export const ranked = (c: Category) =>
	c.entries
		.filter((e) => e.reviews >= MIN_REVIEWS_PER_BRAND)
		.sort((a, b) => b.rating - a.rating)
		.map(toRanked);

/** Marcas que aún no llegan a 10 opiniones, de más a menos. */
export const unranked = (c: Category) =>
	c.entries
		.filter((e) => e.reviews < MIN_REVIEWS_PER_BRAND)
		.sort((a, b) => b.reviews - a.reviews)
		.map(toRanked);

/** Todas las marcas en orden alfabético (estado en construcción). */
export const alphabetical = (c: Category) =>
	c.entries.map(toRanked).sort((a, b) => a.name.localeCompare(b.name, 'es'));

export type BrandStanding = {
	category: Category;
	/** null si la categoría está en construcción o la marca no tiene opiniones suficientes. */
	rank: number | null;
	of: number;
	rating: number;
	reviews: number;
};

export const standings = (brandSlug: string): BrandStanding[] =>
	categories
		.filter((c) => c.entries.some((e) => e.brand === brandSlug))
		.map((c) => {
			const list = ranked(c);
			const entry = c.entries.find((e) => e.brand === brandSlug)!;
			const i = list.findIndex((r) => r.slug === brandSlug);
			return {
				category: c,
				rank: isBuilding(c) || i === -1 ? null : i + 1,
				of: list.length,
				rating: entry.rating,
				reviews: entry.reviews
			};
		})
		.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

// ── búsqueda ─────────────────────────────────────────────────────────────────

// Carácter a carácter para que los índices calcen con el texto original.
const fold = (s: string) =>
	[...s].map((ch) => ch.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()).join('');

export type SearchHit = { category: Category; before: string; match: string; after: string };

export function searchCategories(query: string): SearchHit[] {
	const q = fold(query.trim().replace(/\?$/, ''));
	if (!q) return [];
	const hits: SearchHit[] = [];
	for (const category of categories) {
		const i = fold(category.name).indexOf(q);
		if (i === -1) continue;
		const n = category.name;
		hits.push({ category, before: n.slice(0, i), match: n.slice(i, i + q.length), after: n.slice(i + q.length) });
	}
	// Primero las que empiezan con lo escrito.
	return hits.sort((a, b) => a.before.length - b.before.length);
}

/** Sugerencias para una búsqueda sin resultado. */
export function didYouMean(query: string): string[] {
	const q = fold(query);
	if (/perr|gat|masc|canin|felin|vet/.test(q)) return ['Veterinaria', 'Tienda de mascotas'];
	if (/banc|cuenta|tarjeta|credit/.test(q)) return ['Banco', 'Tarjeta de crédito'];
	if (/vuel|viaj|avion/.test(q)) return ['Aerolínea'];
	return [];
}

/** Número estable a partir del texto, para cifras de mentira. */
export const fakeCount = (s: string, max = 40) =>
	([...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % max) + 3;
