import { redirect } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';
import { safePathFromUrl } from '#lib/safe-path.js';
import type { RequestHandler } from './$types';

// Enlace del correo → aquí con ?token_hash=…&type=email ; lo cambiamos por una sesión (cookies) y seguimos a `next`.
export const GET: RequestHandler = async ({ url, locals }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = safePathFromUrl(url.searchParams.get('next'), url.origin);

	if (token_hash && type) {
		const { error } = await locals.supabase.auth.verifyOtp({ token_hash, type });
		if (!error) redirect(303, next);
	}

	redirect(303, `/entrar?error=email&volver=${encodeURIComponent(next)}`);
};
