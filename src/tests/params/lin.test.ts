import { LinearParam } from '$lib/params';
import { describe, expect, it } from 'bun:test';

describe('LinearParam', () => {
	it('should normalize values correctly', () => {
		const param = new LinearParam(0, 100);
		expect(param.normalize(0)).toBeCloseTo(0.0);
		expect(param.normalize(50)).toBeCloseTo(0.5);
		expect(param.normalize(100)).toBeCloseTo(1.0);
	});

	it('should denormalize values correctly', () => {
		const param = new LinearParam(0, 100);
		expect(param.denormalize(0)).toBeCloseTo(0.0);
		expect(param.denormalize(0.5)).toBeCloseTo(50);
		expect(param.denormalize(1)).toBeCloseTo(100);
	});

	it('should handle edge cases correctly', () => {
		const param = new LinearParam(-50, 50);
		expect(param.normalize(-50)).toBeCloseTo(0.0);
		expect(param.normalize(0)).toBeCloseTo(0.5);
		expect(param.normalize(50)).toBeCloseTo(1.0);
		expect(param.denormalize(0.25)).toBeCloseTo(-25);
		expect(param.denormalize(0.75)).toBeCloseTo(25);
	});
});
