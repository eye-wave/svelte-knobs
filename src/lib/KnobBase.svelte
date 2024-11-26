<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { Spring } from 'svelte/motion';

	export type SnippetProps = {
		normalizedValue: number;
		handleTouchStart: (e: TouchEvent) => void;
		handleMouseDown: ({ clientY }: MouseEvent) => void | boolean;
		handleDblClick: () => void;
	};

	export type SharedKnobProps = {
		style?: string;
		disabled?: boolean;
		draggable?: boolean;
		onChange?: (value: number | string) => void;
		param: FloatParam | EnumParam<readonly string[]>;
		value: number | string;
		defaultValue?: number | string;
		label?: string;
		unit?: string;
		decimalDigits?: number;
		snapValues?: Array<number>;
		snapThreshold?: number;
		colors?: {
			bg?: string;
		};
	};
</script>

<script lang="ts">
	import { clamp } from './helpers/clamp.js';
	import { normalize, format, unnormalizeToString, unnormalizeToNumber } from './params.js';
	import type { EnumParam, FloatParam } from './params.js';

	type KnobBaseProps = {
		ui: Snippet<[SnippetProps]>;
		rotationDegrees: Spring<number>;
	} & SharedKnobProps;

	let {
		ui,
		style,
		label = '',
		unit = '',
		onChange,
		value = $bindable(),
		defaultValue,
		param,
		rotationDegrees,
		decimalDigits = 0,
		snapValues = [],
		snapThreshold = 0.1,
		disabled = false,
		draggable = true,
		colors = {}
	}: KnobBaseProps = $props();

	const { bg: bgColor = '#444' } = colors;

	let isDragging = $state(false);
	let startY: number;
	let startValue: number;

	// This is needed in case some snap value is very close to the min or max range
	// preventing the user from selecting that value
	function completeFixedSnapValues(snapValues: number[]) {
		if (param.type === 'enum-param') return [];
		if (snapValues.length < 1) return [];

		const { min: start, max: end } = param.range;
		const clone = [...snapValues];

		if (!snapValues.includes(start)) clone.push(start);
		if (!snapValues.includes(end)) clone.push(end);

		return clone;
	}

	const fixedSnapValues = $derived(completeFixedSnapValues(snapValues));
	const normalizedValue = $derived(normalize(value, param));

	const formatted = $derived(isDragging ? format(value, param, decimalDigits) : '');

	function toMobile(handler: ({ clientY }: MouseEvent) => void | boolean) {
		return (event: TouchEvent) => {
			const touch = event.touches?.[0];
			if (touch === undefined) return;

			const clientY = touch.clientY;

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			handler({ clientY } as MouseEvent) && event.preventDefault();
		};
	}

	function handleMouseDown({ clientY }: MouseEvent) {
		if (!draggable) return;
		isDragging = true;
		startY = clientY;
		startValue = normalizedValue;

		return true;
	}

	function handleMouseMove({ clientY }: MouseEvent) {
		if (!draggable) return;
		if (disabled) return;
		if (!isDragging) return;
		const deltaY = startY - clientY;
		const deltaValue = deltaY / 200;
		setValue(clamp(startValue + deltaValue, 0, 1));

		return true;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleDblClick() {
		const val =
			defaultValue ??
			(param as FloatParam)?.range.min ??
			(param as EnumParam<string[]>).variants?.[0];
		if (val === undefined) return;

		setValue(clamp(normalize(val, param), 0, 1));
	}

	const handleTouchStart = toMobile(handleMouseDown);
	const handleTouchMove = toMobile(handleMouseMove);

	$effect(() => {
		rotationDegrees.set(normalizedValue * 270 - 135);

		// this was easier in svelte 4 :/
		window.addEventListener('touchmove', handleTouchMove, { passive: false });
		return () => window.removeEventListener('touchmove', handleTouchMove);
	});

	function setValue(newNormalizedValue: number) {
		if (param.type === 'enum-param') {
			const newValue = unnormalizeToString(newNormalizedValue, param);

			if (value !== newValue) {
				value = newValue;
				onChange?.(value);
			}

			return;
		}

		let newValue = unnormalizeToNumber(newNormalizedValue, param);

		if (fixedSnapValues.length > 0) {
			const nearestSnapValue = fixedSnapValues.reduce((prev, curr) => {
				const currNormalized = normalize(curr, param);
				const prevNormalized = normalize(prev, param);
				return Math.abs(currNormalized - newNormalizedValue) <
					Math.abs(prevNormalized - newNormalizedValue)
					? curr
					: prev;
			});

			const nearestSnapNormalized = normalize(nearestSnapValue, param);
			if (Math.abs(nearestSnapNormalized - newNormalizedValue) <= snapThreshold) {
				newValue = nearestSnapValue;
			}
		}

		if (value !== newValue) {
			value = newValue;
			onChange?.(value);
		}
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} ontouchend={handleMouseUp} />

<div class="container" {style}>
	{@render ui?.({
		normalizedValue,
		handleTouchStart,
		handleMouseDown,
		handleDblClick
	})}
	{#if label}
		<div class="label" style:background={bgColor}>{label}</div>
	{/if}
	{#if isDragging}
		<div style:background={bgColor} class="value">
			<span>{formatted}</span>
			{#if unit}
				<span>{unit}</span>
			{/if}
		</div>
	{/if}
</div>

<style lang="postcss">
	span {
		user-select: none;
	}

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: fit-content;
	}

	.label {
		border-radius: 999px;
		padding: 0 16px;
		font-size: 14px;
		user-select: none;
	}
	.value {
		position: absolute;
		bottom: 5%;
		pointer-events: none;
		user-select: none;
		text-wrap: nowrap;
		border: 2px solid currentColor;
		font-size: 12px;
		padding: 0 16px;
		border-radius: 999px;
	}
</style>
