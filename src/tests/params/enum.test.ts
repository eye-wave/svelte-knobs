import { EnumParam, type VariantsOf } from '$lib/params';
import { describe, expect, it } from 'bun:test';

describe('EnumParam', () => {
	const param = new EnumParam(['red', 'green', 'blue'] as const);
	type Variant = VariantsOf<typeof param>;

	it('should normalize a value correctly', () => {
		const case1: Variant = 'red';
		const case2: Variant = 'green';
		const case3: Variant = 'blue';

		expect(param.normalize(case1)).toBeCloseTo(0.0);
		expect(param.normalize(case2)).toBeCloseTo(0.5);
		expect(param.normalize(case3)).toBeCloseTo(1.0);
	});

	it('should denormalize a value correctly', () => {
		expect(param.denormalize(0.0)).toBe('red');
		expect(param.denormalize(0.5)).toBe('green');
		expect(param.denormalize(1.0)).toBe('blue');
	});

	it('should handle values near boundaries correctly', () => {
		expect(param.denormalize(0.24)).toBe('red');
		expect(param.denormalize(0.74)).toBe('green');
	});

	it('should throw an error for invalid input in normalize', () => {
		expect(() => param.normalize('yellow' as Variant)).toThrow(
			'Value "yellow" is not a valid variant.'
		);
	});
});
