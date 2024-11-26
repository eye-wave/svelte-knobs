<script lang="ts">
	import { normalize } from './params.js';
	import { spring } from 'svelte/motion';
	import KnobBase from './KnobBase.svelte';
	import type { SharedKnobProps } from './KnobBase.svelte';

	type Props = {
		size?: number;
		stiffness?: number;
		class?: string;
		colors?: {
			arc?: string;
			bg?: string;
			disabled?: string;
		};
	} & SharedKnobProps;

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
	{colors}
	{decimalDigits}
	{defaultValue}
	{disabled}
	{draggable}
	{label}
	{onChange}
	{param}
	{snapThreshold}
	{snapValues}
	{style}
	{unit}
	bind:value
	{rotationDegrees}
>
	{#snippet ui({ normalizedValue, handleTouchStart, handleMouseDown, handleDblClick })}
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
	{/snippet}
</KnobBase>
