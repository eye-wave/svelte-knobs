type BaseRange = {
	min: number;
	max: number;
};

export type LinearRange = { type: 'lin' } & BaseRange;
export type LogRange = { type: 'log'; base: number } & BaseRange;

export type Range = LinearRange | LogRange;
export type RangeType = Range['type'];

export function createRange(type: 'lin', min: number, max: number): LinearRange;
export function createRange(type: 'log', min: number, max: number, base?: number): LogRange;
export function createRange(type: RangeType, min: number, max: number, a?: number): Range;
export function createRange(type: RangeType, min: number, max: number, a?: number): Range {
	switch (type) {
		case 'lin':
			return { type: 'lin', min, max };
		case 'log':
			return { type: 'log', min, max, base: a ?? 10 };
		default:
			throw TypeError(`RangeType: "${type}" does not exist.`);
	}
}
