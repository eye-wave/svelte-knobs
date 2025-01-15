<script lang="ts" module>
	import type { DraggableProps } from './Draggable.svelte';
	import { Spring, type Tween } from 'svelte/motion';

	type Motion<T> = Spring<T> | Tween<T>;

	export type ImageKnobProps = DraggableProps & {
		/**
		 * Source for the knob image strip.
		 */
		src: string;

		/**
		 * Number of animation frames in the image.
		 * By default the component will try to guess.
		 */
		numberOfFrames?: number;

		/**
		 * Width of the image in pixels.
		 * Default width is 80;
		 */
		width?: number;

		/**
		 * Height of the image in pixels.
		 * Default height is 80;
		 */
		height?: number;

		/**
		 * "svelte/motion" class instance used to animate the knob.
		 * Default motion in Spring with stiffness of 0.2
		 */
		motion?: Motion<number>;
	};
</script>

<script lang="ts">
	import Draggable from './Draggable.svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { onMount } from 'svelte';

	type Props = SvelteHTMLElements['div'] & ImageKnobProps;
	let {
		value = $bindable(0),
		width = 80,
		height = 80,
		numberOfFrames,
		src,
		motion = new Spring(0.0, { stiffness: 0.2 }),
		...defaultProps
	}: Props = $props();

	onMount(() => {
		const image = new Image();
		image.src = src;
		image.onload = () => {
			if ('width' in image && 'height' in image) {
				console.warn('Automatic estimation of numberOfFrames might be inaccurate');
				numberOfFrames = Math.floor(image.height / image.width) - 1;
			} else {
				throw Error('Failed to estimate numberOfFrames');
			}
		};
	});

	let transform = $derived(Math.floor(motion.current * (numberOfFrames ?? 0)));

	$effect(() => {
		motion.set(value);
	});
</script>

<Draggable
	bind:value
	style="width:{width}px;height:{height}px;{defaultProps.style}"
	{...defaultProps}
>
	<div
		style:background-image="url({src})"
		style:background-position="0 {-transform * height}px"
	></div>
</Draggable>

<style>
	div {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
