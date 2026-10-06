import { error } from '@sveltejs/kit';
import { brandBySlug } from '#lib/fake-data.js';

export const load = ({ params }) => {
	const brand = brandBySlug(params.slug);
	if (!brand) error(404, 'Esa marca no existe');
	return { brand };
};
