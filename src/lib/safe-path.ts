// Solo rutas internas ("/algo"): evita redirecciones abiertas a otros dominios ("//evil.com").
export function safePath(value: string | null | undefined, fallback = '/'): string {
	return value?.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

// Igual, pero acepta una URL absoluta de nuestro propio origen (así llega `next` en el correo del magic link).
export function safePathFromUrl(value: string | null | undefined, origin: string, fallback = '/'): string {
	if (!value) return fallback;
	try {
		const url = new URL(value, origin);
		return url.origin === origin ? safePath(url.pathname + url.search, fallback) : fallback;
	} catch {
		return fallback;
	}
}
