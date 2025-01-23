import { BoolParam } from '$lib/params';
import { describe, expect, it } from 'bun:test';

describe('BoolParam', () => {
	it('should normalize a boolean value correctly', () => {
		const param = new BoolParam();
		expect(param.normalize(true)).toBe(1.0);
		expect(param.normalize(false)).toBe(0.0);
	});

	it('should denormalize a numeric value correctly', () => {
		const param = new BoolParam();
		expect(param.denormalize(0.0)).toBe(false);
		expect(param.denormalize(0.5)).toBe(false);
		expect(param.denormalize(1.0)).toBe(true);
	});

	it('should handle boundary conditions correctly', () => {
		const param = new BoolParam();
		expect(param.denormalize(0.49)).toBe(false);
		expect(param.denormalize(0.5)).toBe(false);
		expect(param.denormalize(0.51)).toBe(true);
	});
});
