import { Param } from './base.js';

export class BoolParam extends Param<boolean> {
	constructor() {
		super();
	}

	public normalize(value: boolean): number {
		return value ? 1.0 : 0.0;
	}

	public denormalize(value: number): boolean {
		return value > 0.5;
	}
}
