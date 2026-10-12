import { redirect } from '@sveltejs/kit';
import { safePath } from '#lib/safe-path.js';
import type { RequestHandler } from './$types';

// Google → Supabase Auth → aquí con ?code=… ; lo cambiamos por una sesión (cookies) y seguimos a `next`.
export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = safePath(url.searchParams.get('next'));

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) redirect(303, next);
	}

	redirect(303, `/entrar?error=google&volver=${encodeURIComponent(next)}`);
};
