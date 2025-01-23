<script lang="ts" module>
	import type { DraggableProps } from './Draggable.svelte';
	import { Spring, type Tween } from 'svelte/motion';

	type Motion<T> = Spring<T> | Tween<T>;

	export type SvgKnobProps = DraggableProps & {
		/**
		 * Size of the knob in pixels.
		 * Default size is 80.
		 */
		size?: number;

		snapPointLength?: number;
		circleRadius?: number;
		arcRadius?: number;

		pointerLength?: number;

		/**
		 * "svelte/motion" class instance used to animate the knob.
		 * Default motion in Spring with stiffness of 0.5
		 */
		motion?: Motion<number>;

		/**
		 * Background color of the knob.
		 * Default color is #333
		 */
		bgColor?: string;

		/**
		 * Starting angle for the knob in degrees ( when the value is 0.0 ).
		 * Default minAngle is -135
		 */
		minAngle?: number;

		/**
		 * Ending angle for the knob in degrees ( when the value is 1.0 ).
		 * Default maxAngle is 135
		 */
		maxAngle?: number;
	};
</script>

<script lang="ts">
	import Draggable from './Draggable.svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { describeArc, polarToCartesian, valueToAngle } from './helpers/arc.js';

	type Props = SvelteHTMLElements['svg'] & SvgKnobProps;
	let {
		value = $bindable(0),
		size = 80,
		motion = new Spring(0.0, { stiffness: 0.5 }),
		bgColor = '#222',
		minAngle = -135,
		maxAngle = 135,
		snapPointLength = 0.44,
		circleRadius: cr = 0.32,
		arcRadius: ar = 0.4,
		pointerLength = 0,
		step,
		disabled: isDisabled,
		defaultValue,
		snapPoints,
		snapThreshold,
		weight,
		...svgProps
	}: Props = $props();

	let draggableProps = $derived({ step, defaultValue, snapPoints, snapThreshold, weight });

	let c = $derived(size / 2);
	let arcRadius = $derived(size * ar);
	let circleRadius = $derived(size * cr);
	let snapRadius = $derived(size * snapPointLength);

	$effect(() => {
		motion.set(value);
	});
</script>

<Draggable bind:value {...draggableProps}>
	<svg
		width="{size}px"
		height="{size}px"
		viewBox="0 0 {size} {size}"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={size * 0.06}
		{...svgProps}
	>
		<circle cx={c} cy={c} r={circleRadius} fill={bgColor}></circle>
		<!-- Arcs -->
		<path
			class="knob_line"
			d={describeArc(c, c, arcRadius, 1.0, minAngle, maxAngle)}
			stroke={bgColor}
			fill="none"
		/>
		<path
			class="knob_line"
			d={describeArc(c, c, arcRadius, motion.current, minAngle, maxAngle)}
			stroke="currentColor"
			fill="none"
		/>
		<!-- Knob indicator -->
		{@render indicator()}
		<!-- Snap points -->
		{#each snapPoints ?? [] as p}
			{@const [x1, y1] = polarToCartesian(c, c, arcRadius, valueToAngle(p, minAngle, maxAngle))}
			{@const [x2, y2] = polarToCartesian(c, c, snapRadius, valueToAngle(p, minAngle, maxAngle))}
			{@const stroke = value >= p ? 'currentColor' : bgColor}

			<line class="knob_line" {x1} {y1} {x2} {y2} {stroke} />
		{/each}
	</svg>
</Draggable>

{#snippet indicator()}
	{@const [x1, y1] = polarToCartesian(
		c,
		c,
		circleRadius * 0.8,
		valueToAngle(motion.current, minAngle, maxAngle)
	)}
	{@const [x2, y2] = polarToCartesian(
		c,
		c,
		circleRadius * 0.8 - pointerLength * size * 0.52,
		valueToAngle(motion.current, minAngle, maxAngle)
	)}
	<line class="knob_line" {x1} {y1} {x2} {y2} stroke="currentColor" />
{/snippet}
