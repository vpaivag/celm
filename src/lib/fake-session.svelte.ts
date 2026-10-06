// Sesión y estado de UI de mentira, en memoria. Se pierde al recargar.

export type RateOption = { brand: string; category: string };

class FakeSession {
	user = $state<{ first: string; short: string; initials: string; email: string } | null>(null);
	/** El teléfono se verifica una sola vez por cuenta. */
	phoneVerified = $state(false);
	showName = $state(false);

	login() {
		this.user = { first: 'Vicente', short: 'Vicente P.', initials: 'VP', email: 'vicente.p•••@gmail.com' };
	}
	logout() {
		this.user = null;
	}
}

class Ui {
	searchOpen = $state(false);
	/** Slugs de categorías, la más reciente primero. */
	recent = $state<string[]>(['aerolinea']);
	/** Opciones del flujo para opinar; null = cerrado. */
	rate = $state<RateOption[] | null>(null);
	welcomeBack = $state(false);

	remember(slug: string) {
		this.recent = [slug, ...this.recent.filter((s) => s !== slug)].slice(0, 3);
	}
}

export const session = new FakeSession();
export const ui = new Ui();
