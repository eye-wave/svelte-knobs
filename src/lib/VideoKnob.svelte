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

	const rotationDegrees = spring(normalize(value, param) * 270 - 135, { stiffness });
	const frames: Array<HTMLImageElement> = [];

	function draw() {
		if (!ctx) return;

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

	onMount(() => {
		if (!source) return;

		frames.splice(0);

		const video = document.createElement('video');
		video.src = source;

		video.onloadeddata = async () => {
			if (video.duration === 0) throw Error('Video is empty');
			duration = video.duration;

			const fps = duration / numberOfFrames;
			const decoderCanvas = document.createElement('canvas');
			const dctx = decoderCanvas.getContext('2d');

			decoderCanvas.width = width;
			decoderCanvas.height = height;

			console.time('Decoding video');

			let i = -1;

			async function decodeFrame() {
				if (!dctx) throw Error('Failed to create canvas context');
				dctx.clearRect(0, 0, decoderCanvas.width, decoderCanvas.height);
				dctx.drawImage(video, 0, 0, decoderCanvas.width, decoderCanvas.height);

				return new Promise<void>((resolve, reject) => {
					decoderCanvas.toBlob((blob) => {
						if (!blob) return reject('Failed to create canvas blob');

						const url = URL.createObjectURL(blob);
						const image = new Image();

						image.src = url;
						image.onerror = reject;
						image.onload = () => {
							if (i === 0) {
								ctx?.clearRect(0, 0, canvas.width, canvas.height);
								ctx?.drawImage(image, 0, 0);
							}

							frames.push(image);
							resolve();
						};
					}, 'image/webp');
				});
			}

			async function waitForFrame(video: HTMLVideoElement) {
				return new Promise((resolve) => video.requestVideoFrameCallback(resolve));
			}

			while (i < numberOfFrames) {
				video.currentTime = ++i * fps;

				await waitForFrame(video);
				await decodeFrame();
			}

			console.timeEnd('Decoding video');
		};

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
	{#snippet ui({ handleTouchStart, handleMouseDown, handleDblClick })}
		<canvas
			bind:this={canvas}
			{width}
			{height}
			class={className}
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			ondblclick={handleDblClick}
			oncontextmenu={(e) => e.preventDefault()}
			draggable={false}
		>
		</canvas>
	{/snippet}
</KnobBase>
