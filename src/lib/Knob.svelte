<script lang="ts">
	import { spring } from 'svelte/motion';
	import { createEventDispatcher } from 'svelte';
	import type { EnumParam, FloatParam } from './params.js';
	import { normalize, format, unnormalizeToString, unnormalizeToNumber } from './params.js';

	const size = 80;

	export let label = '';
	export let unit = '';
	export let param: FloatParam | EnumParam<readonly string[]>;
	export let value: number | string;
	export let stiffness = 0.5;
	export let decimalDigits = 0;
	export let snapValues: number[] = [];
	export let snapThreshold = 0.1;

	export let arcColor = '#ae98db';
	export let bgColor = '#444';

	$: if (param.type === 'enum-param') snapValues = [];

	$: center = size / 2;
	$: arcRadius = size * 0.4;
	$: circleRadius = size * 0.32;
	$: lineWidth = size * 0.04;

	$: rotationDegrees = spring(0, { stiffness });

	let isDragging = false;
	let startY: number;
	let startValue: number;

	const dispatch = createEventDispatcher();

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

	$: fixedSnapValues = completeFixedSnapValues(snapValues);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	$: normalizedValue = normalize(value as any, param as any);
	$: rotationDegrees.set(normalizedValue * 270 - 135);

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		startY = event.clientY;
		startValue = normalizedValue;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		const deltaY = startY - event.clientY;
		const deltaValue = deltaY / 200;
		setValue(Math.max(0, Math.min(1, startValue + deltaValue)));
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function setValue(newNormalizedValue: number) {
		if (param.type === 'enum-param') {
			const newValue = unnormalizeToString(newNormalizedValue, param);

			if (value !== newValue) {
				value = newValue;
				dispatch('change', { value });
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
			dispatch('change', { value });
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
		if (snapValues.length === 0 || param.type !== 'float-param') return '';

		let paths = [];

		for (let snapValue of snapValues) {
			const normalizedSnapValue = normalize(snapValue, param);
			const angle = normalizedSnapValue * 270 - 135;
			const [x1, y1] = polarToCartesian(center, center, arcRadius, angle);
			const [x2, y2] = polarToCartesian(center, center, size * 0.46, angle);

			paths.push(`M ${x1} ${y1} L ${x2} ${y2}`);
		}

		return paths.join(' ');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	$: formatted = isDragging ? format(value as any, param as any, decimalDigits) : '';
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<div class="container">
	<svg
		role="slider"
		tabindex="0"
		aria-valuenow={normalizedValue}
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={lineWidth}
		on:mousedown={handleMouseDown}
	>
		<circle cx={center} cy={center} r={circleRadius} fill={bgColor}></circle>
		{#if snapValues.length > 0}
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
			stroke={arcColor}
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
