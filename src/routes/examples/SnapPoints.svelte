<script>
	import { SvgKnob } from '$lib';

	let value = $state(0.0);
</script>

<div>
	<SvgKnob bind:value snapPoints={[0.5]} />
	<span>{value.toFixed(2)}</span>
</div>
