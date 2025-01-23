import { Param } from './base.js';

export class LinearParam extends Param<number> {
	min = 0.0;
	max = 1.0;

	constructor(min?: number, max?: number) {
		super();
		if (min) this.min = min;
		if (max) this.max = max;
	}

	public normalize(value: number): number {
		return (value - this.min) / (this.max - this.min);
	}

	public denormalize(value: number): number {
		return value * (this.max - this.min) + this.min;
	}
}
