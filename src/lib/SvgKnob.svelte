<script lang="ts">
	import { normalize } from './params.js';
	import { spring } from 'svelte/motion';
	import KnobBase from './KnobBase.svelte';
	import type { SharedKnobProps } from './KnobBase.svelte';
	import './svgknob.css';

	type Props = {
		size?: number;
		stiffness?: number;
		class?: string;
		strokeWidth?: number;
		colors?: {
			arc?: string;
			bg?: string;
			disabled?: string;
		};
	} & SharedKnobProps;

	let {
		style,
		strokeWidth,
		class: className,
		label = '',
		unit = '',
		size = 80,
		onChange,
		value = $bindable(),
		step,
		acceleration,
		maxSpeed,
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

	const rotationDegrees = spring(normalize(value, param) * 270 - 135, { stiffness });

	const center = $derived(size / 2);
	const arcRadius = $derived(size * 0.4);
	const circleRadius = $derived(size * 0.32);
	const lineWidth = $derived(size * 0.04);

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

<KnobBase
	{acceleration}
	{colors}
	{decimalDigits}
	{defaultValue}
	{disabled}
	{draggable}
	{label}
	{maxSpeed}
	{onChange}
	{param}
	{rotationDegrees}
	{snapThreshold}
	{snapValues}
	{step}
	{unit}
	{style}
	bind:value
>
	{#snippet ui({
		normalizedValue,
		handleTouchStart,
		handleMouseDown,
		handleDblClick,
		handleKeyDown
	})}
		<svg
			style="--stroke-width:{strokeWidth ?? lineWidth}px;{style}"
			class="dK3qx2 {className}"
			width={size}
			height={size}
			viewBox="0 0 {size} {size}"
			stroke-linecap="round"
			stroke-linejoin="round"
			role="slider"
			tabindex="0"
			aria-valuenow={normalizedValue}
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			ondblclick={handleDblClick}
			onkeydown={handleKeyDown}
		>
			<circle cx={center} cy={center} r={circleRadius} fill={bgColor}></circle>
			{#if snapValues.length > 0 || param.type === 'enum-param'}
				<!-- Snap markers -->
				<path d={drawSnapMarkers()} stroke={bgColor} stroke-width={strokeWidth ?? lineWidth} />
			{/if}
			<!-- Arcs -->
			<path
				class="knob_line"
				d={describeArc(center, center, arcRadius, $rotationDegrees, 135)}
				stroke={bgColor}
				fill="none"
			/>
			<path
				class="knob_line"
				d={describeArc(center, center, arcRadius, -135, $rotationDegrees)}
				stroke={arcColor2}
				fill="none"
			/>
			<!-- Knob indicator -->
			<line
				class="knob_line"
				x1={center}
				y1={center * 0.7}
				x2={center}
				y2={center - circleRadius + 5}
				stroke="currentColor"
				transform="rotate({$rotationDegrees}, {center}, {center})"
			/>
		</svg>
	{/snippet}
</KnobBase>
