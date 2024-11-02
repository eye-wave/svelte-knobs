<script lang="ts">
	import { normalize, format, unnormalizeToString, unnormalizeToNumber } from './params.js';
	import { spring } from 'svelte/motion';
	import type { EnumParam, FloatParam } from './params.js';
	import { clamp } from './helpers/clamp.js';

	interface Props {
		style?: string;
		class?: string;
		label?: string;
		unit?: string;
		size?: number;
		onChange?: (value: number | string) => void;
		param: FloatParam | EnumParam<readonly string[]>;
		value: number | string;
		defaultValue?: number | string;
		stiffness?: number;
		decimalDigits?: number;
		snapValues?: Array<number>;
		snapThreshold?: number;
		disabled?: boolean;
		draggable?: boolean;
		colors?: {
			arc?: string;
			bg?: string;
			disabled?: string;
		};
	}

	let {
		style,
		class: className,
		label = '',
		unit = '',
		size = 80,
		onChange,
		value = $bindable(),
		defaultValue,
		param,
		stiffness = 0.5,
		decimalDigits = 0,
		snapValues = [],
		snapThreshold = 0.1,
		disabled = false,
		draggable = true,
		colors = {}
	}: Props = $props();

	const {
		arc: arcColor = '#ae98db',
		bg: bgColor = '#444',
		disabled: disabledColor = '#777'
	} = colors;

	const arcColor2 = $derived(disabled ? disabledColor : arcColor);

	const center = $derived(size / 2);
	const arcRadius = $derived(size * 0.4);
	const circleRadius = $derived(size * 0.32);
	const lineWidth = $derived(size * 0.04);

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
	const rotationDegrees = spring(normalize(value, param) * 270 - 135, { stiffness });
	const normalizedValue = $derived(normalize(value, param));

	const formatted = $derived(isDragging ? format(value, param, decimalDigits) : '');

	function toMobile(handler: ({ clientY }: MouseEvent) => boolean | void) {
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

	function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
		const [sx, sy] = polarToCartesian(x, y, radius, endAngle);
		const [ex, ey] = polarToCartesian(x, y, radius, startAngle);
		const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
		return ['M', sx, sy, 'A', radius, radius, 0, largeArcFlag, 0, ex, ey].join(' ');
	}

	function polarToCartesian(
		centerX: number,
		centerY: number,
		radius: number,
		angleInDegrees: number
	): [number, number] {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
		return [
			centerX + radius * Math.cos(angleInRadians),
			centerY + radius * Math.sin(angleInRadians)
		];
	}

	function drawSnapMarkers() {
		if (param.type !== 'enum-param' && snapValues.length === 0) return null;

		let paths = [];

		const values = param.type === 'enum-param' ? param.variants : snapValues;
		for (let snapValue of values) {
			const normalizedSnapValue = normalize(snapValue, param);
			const angle = normalizedSnapValue * 270 - 135;
			const [x1, y1] = polarToCartesian(center, center, arcRadius, angle);
			const [x2, y2] = polarToCartesian(center, center, size * 0.46, angle);

			paths.push(`M ${x1} ${y1} L ${x2} ${y2}`);
		}

		return paths.join(' ');
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} ontouchend={handleMouseUp} />

<div class="container" {style}>
	<svg
		class={className}
		role="slider"
		tabindex="0"
		aria-valuenow={normalizedValue}
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={lineWidth}
		onmousedown={handleMouseDown}
		ontouchstart={handleTouchStart}
		ondblclick={handleDblClick}
	>
		<circle cx={center} cy={center} r={circleRadius} fill={bgColor}></circle>
		{#if snapValues.length > 0 || param.type === 'enum-param'}
			<!-- Snap markers -->
			<path d={drawSnapMarkers()} stroke={bgColor} />
		{/if}
		<!-- Arcs -->
		<path
			d={describeArc(center, center, arcRadius, $rotationDegrees, 135)}
			fill="none"
			stroke={bgColor}
		/>
		<path
			d={describeArc(center, center, arcRadius, -135, $rotationDegrees)}
			fill="none"
			stroke={arcColor2}
		/>
		<!-- Knob indicator -->
		<line
			x1={center}
			y1={center * 0.7}
			x2={center}
			y2={center - circleRadius + 5}
			stroke="currentColor"
			transform="rotate({$rotationDegrees}, {center}, {center})"
		/>
	</svg>
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
