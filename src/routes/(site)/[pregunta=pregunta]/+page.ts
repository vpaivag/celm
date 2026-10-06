import { error, redirect } from '@sveltejs/kit';
import { categoryBySlug, categoryPath } from '#lib/fake-data.js';

export const load = ({ params, url }) => {
	// El matcher ya entrega el slug: /cual-es-la-mejor-aerolinea → "aerolinea".
	const category = categoryBySlug(params.pregunta);
	if (!category) error(404, 'Esa categoría no existe');
	// "cual-es-el-mejor-aerolinea" → "cual-es-la-mejor-aerolinea"
	const canonical = categoryPath(category);
	if (url.pathname !== canonical) redirect(308, canonical);
	return { category };
};
