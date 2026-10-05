// Cifras con coma decimal y punto de miles (4,3 · 1.204).
const decimal = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

export const formatScore = (value: number) => decimal.format(value);
export const formatCount = (value: number) => integer.format(value);
