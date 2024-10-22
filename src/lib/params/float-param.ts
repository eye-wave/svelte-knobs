import { type Range } from './range.js';

export type FloatParam = {
	type: 'float-param';
	range: Range;
};

export function createFloatParam(range: Range): FloatParam {
	return {
		type: 'float-param',
		range
	};
}
export function normalize(value: number, param: FloatParam): number {
	const { range } = param;
	switch (range.type) {
		case 'lin':
			return (value - range.min) / (range.max - range.min);
		case 'log': {
			const base = range.base ?? 10;
			const min = log(range.min, base);
			const max = log(range.max, base);

			return (log(value, base) - min) / (max - min);
		}
		default:
			throw new Error('Unsupported range type');
	}
}

export function unnormalize(value: number, param: FloatParam): number {
	const { range } = param;
	switch (range.type) {
		case 'lin':
			return value * (range.max - range.min) + range.min;
		case 'log': {
			const base = range.base ?? 10;
			const min = log(range.min, base);
			const max = log(range.max, base);

			return exp(value * (max - min) + min, base);
		}
		default:
			throw new Error('Unsupported range type');
	}
}

function log(value: number, base = 10): number {
	if (value === 0) return 0;

	const x = value < 0 ? -value : value;
	const sign = Math.sign(value);

	if (base === 10) return sign * Math.log10(x);
	if (base === 2) return sign * Math.log2(x);
	if (base === Math.E) return sign * Math.log(x);

	return sign * (Math.log(x) / Math.log(base));
}

function exp(value: number, base = 10): number {
	const x = value < 0 ? -value : value;

	return Math.pow(base, x) * Math.sign(value);
}
