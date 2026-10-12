import { json } from '@sveltejs/kit';
import { safePath } from '#lib/safe-path.js';
import type { RequestHandler } from './$types';

// POST desde el formulario de correo: Supabase manda el magic link (plantilla supabase/templates/magic_link.html).
// Si el correo no tiene cuenta, la crea: entrar y crear cuenta son la misma puerta.
export const POST: RequestHandler = async ({ request, url, locals }) => {
	const form = await request.formData();
	const email = form.get('email')?.toString().trim().toLowerCase() ?? '';
	const next = safePath(form.get('next')?.toString());

	if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'invalid_email' }, { status: 400 });

	// `emailRedirectTo` llega a la plantilla como {{ .RedirectTo }} y /auth/confirm lo usa como `next`.
	const { error } = await locals.supabase.auth.signInWithOtp({
		email,
		options: { emailRedirectTo: new URL(next, url.origin).href }
	});

	if (error) {
		const rateLimited = error.status === 429;
		return json({ error: rateLimited ? 'rate_limited' : 'send_failed' }, { status: rateLimited ? 429 : 500 });
	}

	return json({ ok: true });
};
