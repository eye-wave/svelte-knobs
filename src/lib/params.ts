import type { EnumParam } from './params/enum-param.js';
import type { FloatParam } from './params/float-param.js';

import * as ENUM from './params/enum-param.js';
import * as FLOAT from './params/float-param.js';

export { createEnumParam, type EnumParam, type Variant } from './params/enum-param.js';
export { createFloatParam, type FloatParam } from './params/float-param.js';

export * from './params/range.js';

export type Param = EnumParam<readonly string[]> | FloatParam;

export function normalize<V extends readonly string[]>(value: string, param: EnumParam<V>): number;
export function normalize(value: number, param: FloatParam): number;
export function normalize(value: string | number, param: Param): number;
export function normalize(value: string | number, param: Param): number {
	switch (param.type) {
		case 'enum-param': {
			if (typeof value !== 'string')
				throw new TypeError(`Expected a string for enum-param, but received ${typeof value}`);
			return ENUM.normalize(value, param);
		}
		case 'float-param': {
			if (typeof value !== 'number')
				throw new TypeError(`Expected a number for float-param, but received ${typeof value}`);
			return FLOAT.normalize(value, param);
		}
		default:
			//@ts-expect-error just in case
			throw new TypeError(`Unsupported param type: ${param.type}`);
	}
}

export function unnormalizeToNumber<V extends readonly string[]>(
	value: number,
	param: EnumParam<V>
): number;
export function unnormalizeToNumber(value: number, param: FloatParam): number;
export function unnormalizeToNumber(value: number, param: Param): number;
export function unnormalizeToNumber(value: number, param: Param): number {
	switch (param.type) {
		case 'enum-param':
			return ENUM.unnormalizeToNumber(value, param);
		case 'float-param':
			return FLOAT.unnormalize(value, param);
		default:
			//@ts-expect-error just in case
			throw new TypeError(`Unsupported param type: ${param.type}`);
	}
}

export function unnormalizeToString<V extends readonly string[]>(
	value: number,
	param: EnumParam<V>
): V[number];
export function unnormalizeToString(value: number, param: FloatParam): string;
export function unnormalizeToString(value: number, param: Param): string;
export function unnormalizeToString(value: number, param: Param): string {
	switch (param.type) {
		case 'enum-param':
			return ENUM.unnormalizeToString(value, param);
		case 'float-param':
			return FLOAT.unnormalize(value, param).toString();
		default:
			//@ts-expect-error just in case
			throw new TypeError(`Unsupported param type: ${param.type}`);
	}
}

export function format<V extends readonly string[]>(
	value: V[number],
	param: EnumParam<V>
): V[number];
export function format(value: number, param: FloatParam, precision?: number): number;
export function format(value: unknown, param: Param, precision?: number): unknown;
export function format(value: unknown, param: Param, precision?: number): unknown {
	switch (param.type) {
		case 'enum-param':
			if (typeof value !== 'string')
				throw new TypeError(`Expected a string for enum-param, but received ${typeof value}`);
			return value;
		case 'float-param':
			if (typeof value !== 'number')
				throw new TypeError(`Expected a number for float-param, but received ${typeof value}`);
			return value.toFixed(precision ?? 2);
		default:
			//@ts-expect-error just in case
			throw new TypeError(`Unsupported param type: ${param.type}`);
	}
}
