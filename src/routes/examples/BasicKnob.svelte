<script>
	import { SvgKnob } from '$lib';

	let value = $state(0.0);
</script>

<div>
	<SvgKnob bind:value />
	<span>{value.toFixed(2)}</span>

	<SvgKnob bind:value disabled />
</div>

<style>
	div {
		color: #22bfee;
	}
</style>
