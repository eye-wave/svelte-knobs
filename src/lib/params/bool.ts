import { Param } from './base.js';

export class BoolParam extends Param<boolean> {
	constructor() {
		super();
	}

	public readonly snapPoints = [0.0, 1.0];
	public readonly snapThreshold = 0.5;
	public readonly step = 1.0;

	public get knobProps() {
		return {
			snapPoints: this.snapPoints,
			snapThreshold: this.snapThreshold,
			step: this.step
		};
	}

	public normalize(value: boolean): number {
		return value ? 1.0 : 0.0;
	}

	public denormalize(value: number): boolean {
		return value > 0.5;
	}
}
