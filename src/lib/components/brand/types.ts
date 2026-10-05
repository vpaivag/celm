export type Confidence = 'alta' | 'media' | 'baja';

export type RankedBrand = {
	name: string;
	rating: number;
	reviews: number;
	confidence?: Confidence;
	logo?: string;
};

export type OfficialMetric = {
	label: string;
	value: string;
	period: string;
	source: string;
	sourceHref?: string;
	/** Etiqueta aclaratoria, p. ej. "TAMAÑO, NO CALIDAD". */
	tag?: string;
};
