export type EnumParam<T extends readonly string[]> = {
	type: 'enum-param';
	variants: T;
};

export type Variant<T> = T extends EnumParam<infer V> ? V[number] : never;

export function createEnumParam<V extends readonly string[]>(variants: V): EnumParam<V> {
	return {
		type: 'enum-param',
		variants
	};
}

export function normalize<V extends readonly string[]>(value: V[number], param: EnumParam<V>) {
	const index = param.variants.findIndex((v) => v === value);
	if (index === -1)
		throw Error(
			`EnumParam does not have "${value}" in its variants. Possible options are: ${param.variants.toString()}`
		);

	return index / (param.variants.length - 1);
}

export function unnormalizeToNumber<V extends readonly string[]>(
	value: number,
	param: EnumParam<V>
): number {
	if (value < 0 || value > 1)
		throw RangeError(`Invalid param range. Expected 0 >= value <= 1, got: ${value}`);

	const index = Math.floor(value * (param.variants.length - 1));
	const variant = param.variants[index];

	if (variant === undefined) throw Error(`Counldn't find a variant for value: ${value}`);
	return index / (param.variants.length - 1);
}

export function unnormalizeToString<V extends readonly string[]>(
	value: number,
	param: EnumParam<V>
): V[number] {
	if (value < 0 || value > 1)
		throw RangeError(`Invalid param range. Expected 0 >= value <= 1, got: ${value}`);

	const index = Math.floor(value * (param.variants.length - 1));
	const variant = param.variants[index];

	if (variant === undefined) throw Error(`Counldn't find a variant for value: ${value}`);
	return variant;
}
