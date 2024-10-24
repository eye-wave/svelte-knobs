<script lang="ts">
	import { createFloatParam, createRange, Knob } from '$lib';

	const smoothParam = createFloatParam(createRange('lin', 0, 100));
	let smoothValue = 0;
</script>

<h3>Smooth</h3>
<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={0.1} />

<h3>Stiff</h3>
<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={1} />
