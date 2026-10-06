import { redirect } from '@sveltejs/kit';
import { categoryPath, searchCategories } from '#lib/fake-data.js';

export const load = ({ url }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	const [hit] = searchCategories(q);
	// Si la categoría existe y calza completa, se va directo a ella.
	if (hit && !hit.before && !hit.after) redirect(307, categoryPath(hit.category));
	return { q };
};
