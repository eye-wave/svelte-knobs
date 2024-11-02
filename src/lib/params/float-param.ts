import { createRange, type Range } from './range.js';

export type FloatParam = {
	type: 'float-param';
	range: Range;
};

export function createFloatParam(...args: Parameters<typeof createRange>): FloatParam {
	return {
		type: 'float-param',
		range: createRange(...args)
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

export function log(value: number, base = 10): number {
	const x = Math.abs(value) + 1;
	const sign = Math.sign(value);

	if (base === 10) return sign * Math.log10(x);
	if (base === 2) return sign * Math.log2(x);
	if (base === Math.E) return sign * Math.log(x);

	return sign * (Math.log(x) / Math.log(base));
}

export function exp(value: number, base = 10): number {
	const sign = Math.sign(value);
	const expValue = Math.abs(value);

	if (base === 10) return sign * (Math.pow(10, expValue) - 1);
	if (base === 2) return sign * (Math.pow(2, expValue) - 1);
	if (base === Math.E) return sign * (Math.exp(expValue) - 1);

	return sign * (Math.pow(base, expValue) - 1);
}
