<script lang="ts" module>
	/**
   Removes cache created by <VideoKnob /> component.
  */
	export async function cleanVideoKnobCache() {
		await caches.delete('svelte-knobs/cache');
	}
</script>

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
		numberOfFrames: number;
		width?: number;
		height?: number;
		cacheFrames?: boolean;
	} & SharedKnobProps;

	let {
		style,
		source,
		numberOfFrames,
		class: className,
		label = '',
		unit = '',
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
		width = 80,
		height = 80,
		disabled = false,
		draggable = true,
		cacheFrames = false,
		colors = {}
	}: Props = $props();

	// TODO Refactor
	const rotationDegrees = spring(normalize(value, param) * 270 - 135, { stiffness });
	const frames: Array<HTMLImageElement> = [];

	function draw() {
		if (!ctx) return;

		// TODO Refactor
		const normalized = ($rotationDegrees + 135) / 270;
		const i = Math.floor(normalized * numberOfFrames);
		if (i < 0) return;

		const frame = frames.at(i);
		if (!frame) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(frame, 0, 0);
	}

	$effect(() => {
		if (duration === 0) return;
		draw();
	});

	onMount(() => {
		ctx = canvas.getContext('2d');
		ctx?.fillText('Loading...', 0, canvas.height / 2);
	});

	async function loadImage(src: string) {
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const image = new Image();
			image.src = src;
			image.onerror = reject;
			image.onload = () => resolve(image);
		});
	}

	async function loadFromCache() {
		const cache = await caches.open('svelte-knobs/cache');

		let i = 0;
		let hasReadCache = false;

		while (i < numberOfFrames) {
			const response = await cache.match(`${source}:${i}`);
			if (!response) break;

			const url = URL.createObjectURL(await response.blob());
			const image = await loadImage(url);
			frames.push(image);

			if (i === 0) {
				ctx?.clearRect(0, 0, canvas.width, canvas.height);
				ctx?.drawImage(image, 0, 0);
			}

			if (i === numberOfFrames - 1) hasReadCache = true;
			i++;
		}

		return hasReadCache;
	}

	async function decodeVideo() {
		const video = document.createElement('video');
		video.src = source;

		const decoderCanvas = document.createElement('canvas');
		const dctx = decoderCanvas.getContext('2d');
		if (!dctx) throw new Error('Failed to create canvas context');

		return new Promise<void>((resolve, reject) => {
			video.onerror = reject;
			video.onloadeddata = async () => {
				if (video.duration === 0) throw new Error('Video is empty');
				duration = video.duration;
				const fps = video.duration / numberOfFrames;
				decoderCanvas.width = width;
				decoderCanvas.height = height;

				let i = -1;
				while (++i < numberOfFrames) {
					video.currentTime = i * fps;
					await new Promise((resolve) => video.requestVideoFrameCallback(resolve));

					dctx.clearRect(0, 0, decoderCanvas.width, decoderCanvas.height);
					dctx.drawImage(video, 0, 0, decoderCanvas.width, decoderCanvas.height);

					const blob = await new Promise<Blob>((resolve, reject) => {
						decoderCanvas.toBlob(
							(blob) => (blob ? resolve(blob) : reject('Failed to create canvas blob')),
							'image/webp'
						);
					});

					const url = URL.createObjectURL(blob);
					const image = await loadImage(url);
					frames.push(image);

					if (i === 0) {
						ctx?.clearRect(0, 0, canvas.width, canvas.height);
						ctx?.drawImage(image, 0, 0);
					}

					const response = new Response(blob, { headers: { 'Content-Type': 'image/webp' } });

					if (cacheFrames) {
						const cache = await caches.open('svelte-knobs/cache');
						await cache.put(`${source}:${i}`, response);
					}
				}

				resolve();
			};
		});
	}

	// @ts-expect-error oops
	onMount(async () => {
		ctx = canvas.getContext('2d');
		if (ctx) ctx.fillText('Loading...', 0, canvas.height / 2);

		console.time('Decoding video');

		if (cacheFrames) {
			const hasReadCache = await loadFromCache();
			if (hasReadCache) {
				console.log('cache hit');
				console.timeEnd('Decoding video');
				return;
			}
		}

		frames.splice(0);
		await decodeVideo();

		console.timeEnd('Decoding video');

		return () => {
			for (const { src } of frames) {
				URL.revokeObjectURL(src);
			}
		};
	});

	$effect(draw);

	let duration = $state(0);
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
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
	{style}
	{unit}
	bind:value
>
	{#snippet ui({
		handleTouchStart,
		handleMouseDown,
		handleDblClick,
		handleKeyDown,
		normalizedValue
	})}
		<canvas
			{style}
			role="slider"
			tabindex="0"
			aria-valuenow={normalizedValue}
			bind:this={canvas}
			{width}
			{height}
			class={className}
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			ondblclick={handleDblClick}
			oncontextmenu={(e) => e.preventDefault()}
			draggable={false}
			onkeydown={handleKeyDown}
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
