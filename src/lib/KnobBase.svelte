<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { Spring } from 'svelte/motion';

	export type SnippetProps = {
		normalizedValue: number;
		handleTouchStart: (e: TouchEvent) => void;
		handleMouseDown: ({ clientY }: MouseEvent) => void | boolean;
		handleDblClick: () => void;
		handleKeyDown: (e: KeyboardEvent) => void;
	};

	// TODO docs
	export type SharedKnobProps = {
		style?: string;
		disabled?: boolean;
		draggable?: boolean;
		onChange?: (value: number | string) => void;
		param: FloatParam | EnumParam<readonly string[]>;
		value: number | string;

		/** normalized value from 0.0 to 1.0 */
		step?: number;
		/** multiplier for acceleration */
		acceleration?: number;
		maxSpeed?: number;

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
	import './shield.css';

	type KnobBaseProps = {
		ui: Snippet<[SnippetProps]>;
		// FIX unwanted knob jiggle
		rotationDegrees: Spring<number>;
	} & SharedKnobProps;

	let {
		ui,
		style,
		label = '',
		unit = '',
		onChange,
		value = $bindable(),
		step = 0.01,
		acceleration = 1.2,
		maxSpeed = 0.2,
		defaultValue,
		param,
		rotationDegrees,
		decimalDigits = 0,
		snapValues = [],
		snapThreshold = 0.1,
		disabled: isDisabled = false,
		draggable = true,
		colors = {}
	}: KnobBaseProps = $props();

	const { bg: bgColor = '#444' } = colors;

	let isDragging = $state(false);
	let startY: number;
	let startValue: number;

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
			if (!touch) return;
			const clientY = touch.clientY;
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			handler({ clientY } as MouseEvent) && event.preventDefault();
		};
	}

	function handleMouseDown({ clientY }: MouseEvent) {
		if (!draggable || isDisabled) return;
		isDragging = true;
		startY = clientY;
		startValue = normalizedValue;
		return true;
	}

	function handleMouseMove({ clientY }: MouseEvent) {
		if (!draggable || isDisabled || !isDragging) return;
		const deltaY = startY - clientY;
		const deltaValue = deltaY / 200;
		setValue(startValue + deltaValue);
		return true;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleDblClick() {
		const val =
			defaultValue ??
			(param as FloatParam)?.range?.min ??
			(param as EnumParam<string[]>).variants?.[0];

		if (val === undefined) return;

		setValue(normalize(val, param));
	}

	const handleTouchStart = toMobile(handleMouseDown);
	const handleTouchMove = toMobile(handleMouseMove);

	type Direction = 'left' | 'right';

	let currentSpeed = step;

	const directions: Record<string, Direction> = {
		ArrowLeft: 'left',
		ArrowDown: 'left',
		ArrowRight: 'right',
		ArrowUp: 'right'
	};

	function handleKeyDown(e: KeyboardEvent) {
		if (isDisabled || !(e.key in directions)) return;
		isDragging = true;
		const direction = directions[e.key];

		if (param.type === 'enum-param') {
			const i = param.variants.findIndex((v) => v === value) ?? 0;
			const step = direction === 'right' ? 1 : -1;

			value = param.variants[clamp(i + step, 0, param.variants.length - 1)];
			onChange?.(value);

			return;
		}

		const delta = direction === 'right' ? currentSpeed : -currentSpeed;
		setValue(normalizedValue + delta);
		currentSpeed = Math.min(maxSpeed, currentSpeed * acceleration);
	}

	function handleKeyUp() {
		isDragging = false;
		currentSpeed = step;
	}

	$effect(() => {
		rotationDegrees.set(normalizedValue * 270 - 135);
		window.addEventListener('touchmove', handleTouchMove, { passive: false });

		return () => window.removeEventListener('touchmove', handleTouchMove);
	});

	function setValue(newNormalizedValue: number) {
		if (param.type === 'enum-param') {
			const newValue = unnormalizeToString(clamp(newNormalizedValue, 0, 1), param);
			if (value !== newValue) {
				value = newValue;
				onChange?.(value);
			}
			return;
		}

		let newValue = unnormalizeToNumber(clamp(newNormalizedValue, 0, 1), param);
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
			if (isNaN(newValue)) {
				newValue = 0;
				console.warn('newValue is NaN');
			}
			value = newValue;
			onChange?.(value);
		}
	}

	let shield: HTMLDivElement | null = null;

	$effect(() => {
		if (isDragging) {
			if (shield === null) shield = document.createElement('div');

			shield.className = 'shield tf68Uh';
			document.body.append(shield);
			document.body.style.userSelect = 'none';
		} else {
			shield?.remove();
			document.body.style.userSelect = '';
		}
	});
</script>

<svelte:window
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	ontouchend={handleMouseUp}
	onkeyup={handleKeyUp}
/>

<div class="container" {style}>
	{@render ui?.({
		normalizedValue,
		handleTouchStart,
		handleMouseDown,
		handleDblClick,
		handleKeyDown
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
