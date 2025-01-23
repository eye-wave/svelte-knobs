import { clamp } from '$lib/helpers/clamp.js';
import { Param } from './base.js';

export type VariantsOf<T> = T extends EnumParam<infer U> ? U[number] : never;
export class EnumParam<T extends readonly string[]> extends Param<T[number]> {
	private variants: T;
	private dictionary: Record<T[number], number>;
	private dictSize: number;

	get snapPoints(): number[] {
		return this.variants.map((v) => this.normalize(v));
	}

	get snapThreshold(): number {
		return 1.0 / (this.variants.length - 1.0);
	}

	constructor(variants: T) {
		super();

		this.variants = variants;
		this.dictionary = {} as Record<T[number], number>;
		this.dictSize = variants.length;

		for (let i = 0; i < variants.length; i++) {
			const name: T[number] = variants[i];

			this.dictionary[name] = i;
		}
	}

	public normalize(value: T[number]): number {
		const index = this.dictionary[value];
		if (index === undefined) throw new Error(`Value "${value}" is not a valid variant.`);

		return index / (this.dictSize - 1);
	}

	public denormalize(value: number): T[number] {
		const clampedValue = clamp(value, 0.0, 1.0);
		const index = Math.floor(clampedValue * (this.dictSize - 1));

		return this.variants[index];
	}
}
