<script lang="ts">
	import { valueToAngle, Draggable } from '$lib';

	let valueSmoothed = $state(0.5);
	let angle = $derived(valueToAngle(valueSmoothed, -135, 135));
</script>

<Draggable bind:valueSmoothed>
	<div class="knob">
		<div
			class="glow"
			style="filter: blur({valueSmoothed * 5}px);transform: scale({valueSmoothed})"
		></div>
		<div class="thumb" style="transform: rotate({angle}deg) translateY(-10px)"></div>
		<span>{valueSmoothed.toFixed(2)}</span>
	</div>
</Draggable>

<style>
	.knob {
		z-index: 0;
		user-select: none;
		width: 60px;
		height: 60px;
		border-radius: 100px;
		background: #000;
		position: relative;
		display: grid;
		place-items: center;
	}

	.glow,
	.thumb {
		z-index: -1;
		position: absolute;
		background: red;
		border-radius: 30px;
	}

	.glow {
		width: 30px;
		height: 30px;
	}

	.thumb {
		width: 10px;
		height: 20px;
	}
</style>
