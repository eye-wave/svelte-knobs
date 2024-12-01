<script lang="ts">
	import { normalize } from './params.js';
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import KnobBase from './KnobBase.svelte';
	import type { SharedKnobProps } from './KnobBase.svelte';

	type Props = {
		stiffness?: number;
		class?: string;
		source: string;
		numberOfFrames?: number;
		width?: number;
		height?: number;
	} & SharedKnobProps;

	let {
		style,
		source,
		numberOfFrames = $bindable(),
		class: className,
		label = '',
		unit = '',
		onChange,
		value = $bindable(),
		step,
		acceleration,
		maxSpeed,
		initialDelay,
		defaultValue,
		param,
		stiffness = 0.5,
		decimalDigits = 0,
		snapValues = [],
		snapThreshold = 0.1,
		width = 80,
		height = 80,
		disabled = false,
		draggable = true,
		colors = {}
	}: Props = $props();

	// TODO rewrite base knob logic
	const rotationDegrees = spring(normalize(value, param) * 270 - 135, { stiffness });

	function draw() {
		if (!ctx) return;
		if (!numberOfFrames) return;
		if (!image) return;
		if (!('width' in image && 'height' in image)) return;

		const normalized = ($rotationDegrees + 135) / 270;
		const i = Math.floor(normalized * numberOfFrames);
		const y = image.width * i;

		if (i < 0) return;
		if (y >= image.height) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			image,
			0, // sx
			y, // sy
			image.width, // sWidth
			image.width, // sHeight
			0, // dx
			0, // dy
			canvas.width, // dWidth
			canvas.height // dHeight
		);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		ctx?.fillText('Loading...', 0, canvas.height / 2);
	});

	onMount(() => {
		if (!source) return;

		console.time('load image');

		image = new Image();
		image.src = source;
		image.onload = () => {
			if (!image) throw Error('What');
			if (numberOfFrames === undefined) {
				if ('width' in image && 'height' in image) {
					console.warn('Automatic estimation of numberOfFrames might be inaccurate');
					numberOfFrames = Math.floor(image.height / image.width);
				} else {
					throw Error('Failed to estimate numberOfFrames');
				}
			}

			console.timeEnd('load image');
			isLoading = false;
		};
	});

	$effect(() => {
		if (isLoading) return;
		draw();
	});

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let isLoading = $state(true);
	let image: HTMLImageElement | null = null;
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
	{snapThreshold}
	{snapValues}
	{step}
	{style}
	{unit}
	{initialDelay}
	bind:value
	{rotationDegrees}
>
	{#snippet ui({
		handleTouchStart,
		handleMouseDown,
		handleDblClick,
		handleKeyDown,
		normalizedValue
	})}
		<canvas
			role="slider"
			tabindex="0"
			aria-valuenow={normalizedValue}
			bind:this={canvas}
			{width}
			{height}
			class={className}
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			onkeydown={handleKeyDown}
			ondblclick={handleDblClick}
			oncontextmenu={(e) => e.preventDefault()}
			draggable={false}
		>
		</canvas>
	{/snippet}
</KnobBase>

<style>
	canvas {
		outline: none;
	}

	canvas:active,
	canvas:focus {
		filter: drop-shadow(2px 0 2px currentColor);
	}
</style>
