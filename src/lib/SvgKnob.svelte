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

		/**
		 * "svelte/motion" class instance used to animate the knob.
		 * Default motion in Spring with stiffness of 0.2
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
	import { describeArc, valueToAngle } from './arc.js';

	type Props = SvelteHTMLElements['svg'] & SvgKnobProps;
	let {
		value = $bindable(0),
		size = 80,
		motion = new Spring(0.0, { stiffness: 0.2 }),
		bgColor = '#222',
		minAngle = -135,
		maxAngle = 135,
		step,
		defaultValue,
		...svgProps
	}: Props = $props();

	let center = $derived(size / 2);
	let arcRadius = $derived(size * 0.4);
	let circleRadius = $derived(size * 0.32);

	$effect(() => {
		motion.set(value);
	});
</script>

<Draggable bind:value {step} {defaultValue}>
	<svg
		width="{size}px"
		height="{size}px"
		viewBox="0 0 {size} {size}"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={size * 0.06}
		{...svgProps}
	>
		<circle cx={center} cy={center} r={circleRadius} fill={bgColor}></circle>
		<!-- Arcs -->
		<path
			class="knob_line"
			d={describeArc(center, center, arcRadius, 1.0, minAngle, maxAngle)}
			stroke={bgColor}
			fill="none"
		/>
		<path
			class="knob_line"
			d={describeArc(center, center, arcRadius, motion.current, minAngle, maxAngle)}
			stroke="currentColor"
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
			transform="rotate({valueToAngle(motion.current, minAngle, maxAngle)}, {center}, {center})"
		/>
	</svg>
</Draggable>
