import { redirect } from '@sveltejs/kit';
import { SUPABASE_URL } from '$app/env/public';
import { safePath } from '#lib/safe-path.js';
import type { RequestHandler } from './$types';

// POST desde el botón "Continuar con Google". El cliente de servidor usa PKCE:
// guarda el code verifier en una cookie que /auth/callback lee después.
export const POST: RequestHandler = async ({ request, url, locals }) => {
	const form = await request.formData();
	const next = safePath(form.get('next')?.toString());

	const callback = new URL('/auth/callback', url.origin);
	callback.searchParams.set('next', next);

	const { data, error } = await locals.supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo: callback.href }
	});

	if (error || !data.url) redirect(303, `/entrar?error=google&volver=${encodeURIComponent(next)}`);

	// data.url apunta a Supabase Auth (/auth/v1/authorize), otro origen: solo permitimos ese.
	redirect(303, data.url, { external: [new URL(SUPABASE_URL).origin] });
};
