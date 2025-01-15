<script lang="ts" module>
	let shield: HTMLDivElement | null = null;

	export type DraggableProps = {
		/**
		 * Normalized value of the component.
		 */
		value?: number;

		/**
		 * The increment or decrement value for keyboard interactions.
		 * Defaults to `0.1` if not specified.
		 */
		step?: number;

		/**
		 * Initial value for the component.
		 */
		defaultValue?: number;

		/**
		 * Disables all interactivity for the component.
		 * When set to `true`, the component will be non-interactive,
		 */
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { onDestroy, onMount } from 'svelte';
	import styles from './shield.module.css';
	import { clamp } from '$lib/helpers/clamp.js';

	type Props = DraggableProps & SvelteHTMLElements['div'];

	let {
		value = $bindable(0.5),
		children,
		disabled: isDisabled,
		defaultValue = 0.5,
		step = 0.1,
		...divProps
	}: Props = $props();

	type SvelteEvent = { currentTarget: EventTarget & HTMLDivElement };

	let isDragging = $state(false);
	let startX: number;
	let startY: number;
	let startValue: number;

	const isBrowser = typeof window === 'object';

	function toMobile(handler: ({ clientY }: MouseEvent & SvelteEvent) => void | boolean) {
		return (event: TouchEvent) => {
			const touch = event.touches?.[0];
			if (!touch) return;
			const clientY = touch.clientY;
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			handler({ clientY } as MouseEvent & SvelteEvent) && event.preventDefault();
		};
	}

	function handleMouseDown(e: MouseEvent & SvelteEvent) {
		divProps?.onmousedown?.(e);
		if (isDisabled) return;

		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;

		startValue = value;

		return true;
	}

	const pickHigherDelta = (dx: number, dy: number) => (Math.abs(dy) < Math.abs(dx) ? dx : dy);
	function handleMouseMove({ clientY, clientX }: MouseEvent) {
		if (isDisabled || !isDragging) return;
		const dy = startY - clientY;
		const dx = startX - clientX;

		const delta = pickHigherDelta(-dx, dy);
		const deltaValue = delta / 200;

		value = clamp(startValue + deltaValue, 0.0, 1.0);

		return true;
	}

	function handleWheel(e: WheelEvent & SvelteEvent) {
		divProps?.onwheel?.(e);

		if (isDisabled) return;
		e.preventDefault();
		const delta = e.deltaY > 0 ? -1.0 : 1.0;

		value = clamp(value + delta * step, 0.0, 1.0);
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleDblClick(e: MouseEvent & SvelteEvent) {
		divProps?.ondblclick?.(e);
		if (isDisabled) return;
		value = defaultValue;
	}

	function handleKeyDown(e: KeyboardEvent & SvelteEvent) {
		divProps?.onkeydown?.(e);

		if (isDisabled) return;
		if (e.key === 'Escape') e.currentTarget?.blur();

		const isPointingLeft = e.key === 'ArrowLeft' || e.key === 'ArrowDown';
		const isPointingRight = e.key === 'ArrowRight' || e.key === 'ArrowUp';

		value += +isPointingRight * step - +isPointingLeft * step;
		value = clamp(value, 0.0, 1.0);
	}

	const handleTouchStart = toMobile(handleMouseDown);
	const handleTouchMove = toMobile(handleMouseMove);

	onMount(() => {
		if (isBrowser) window.addEventListener('touchmove', handleTouchMove, { passive: false });
	});

	onDestroy(() => {
		if (isBrowser) window.removeEventListener('touchmove', handleTouchMove);
		shield?.remove();
	});

	$effect(() => {
		if (isDragging) {
			if (shield === null) shield = document.createElement('div');

			shield.className = styles.shield;
			document.body.append(shield);
			document.body.style.userSelect = 'none';
		} else {
			shield?.remove();
			document.body.style.userSelect = '';
		}
	});
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} ontouchend={handleMouseUp} />

<div
	class={divProps.class}
	style={divProps.style}
	{...divProps}
	role="slider"
	aria-valuenow={divProps['aria-valuenow']}
	tabindex="0"
	draggable={false}
	onwheel={handleWheel}
	ondblclick={handleDblClick}
	onmousedown={handleMouseDown}
	ontouchstart={handleTouchStart}
	onkeydown={handleKeyDown}
>
	{@render children?.()}
</div>

<style>
	div {
		width: fit-content;
	}
</style>
