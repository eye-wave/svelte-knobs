import { Param } from './base.js';

export class LogParam extends Param<number> {
	#min: number;
	#max: number;

	#logMin: number;
	#logMax: number;
	#logBase = Math.E;

	#log(value: number): number {
		const x = Math.abs(value) + 1;
		const sign = Math.sign(value);

		if (this.#logBase === 10) return sign * Math.log10(x);
		if (this.#logBase === 2) return sign * Math.log2(x);
		if (this.#logBase === Math.E) return sign * Math.log(x);

		return sign * (Math.log(x) / Math.log(this.#logBase));
	}

	#exp(value: number): number {
		const sign = Math.sign(value);
		const expValue = Math.abs(value);

		if (this.#logBase === 10) return sign * (Math.pow(10, expValue) - 1);
		if (this.#logBase === 2) return sign * (Math.pow(2, expValue) - 1);
		if (this.#logBase === Math.E) return sign * (Math.exp(expValue) - 1);

		return sign * (Math.pow(this.#logBase, expValue) - 1);
	}

	set min(v: number) {
		this.#min = v;
		this.#logMin = this.#log(v);
	}

	get min() {
		return this.#min;
	}

	set max(v: number) {
		this.#max = v;
		this.#logMax = this.#log(v);
	}

	get max() {
		return this.#max;
	}

	constructor(min: number, max: number, base?: number) {
		super();

		if (base !== undefined) this.#logBase = base;

		this.min = min;
		this.max = max;
	}

	public normalize(value: number): number {
		return (this.#log(value) - this.#logMin) / (this.#logMax - this.#logMin);
	}

	public denormalize(value: number): number {
		return this.#exp(value * (this.#logMax - this.#logMin) + this.#logMin);
	}
}
