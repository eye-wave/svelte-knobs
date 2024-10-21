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
			const logFunc = base === 10 ? Math.log10 : base === 2 ? Math.log2 : Math.log;
			return (logFunc(value) - logFunc(range.min)) / (logFunc(range.max) - logFunc(range.min));
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
			const logFunc = base === 10 ? Math.log10 : base === 2 ? Math.log2 : Math.log;
			const expFunc =
				base === 10 ? Math.pow.bind(null, 10) : base === 2 ? Math.pow.bind(null, 2) : Math.exp;
			return expFunc(value * (logFunc(range.max) - logFunc(range.min)) + logFunc(range.min));
		}
		default:
			throw new Error('Unsupported range type');
	}
}
