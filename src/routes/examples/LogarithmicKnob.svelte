<script lang="ts">
	import { createFloatParam, createRange, Knob } from '$lib';

	const freqParam = createFloatParam(createRange('log', 20, 20_000));
	const gainParam = createFloatParam(createRange('log', -30, 30, Math.E));
	const qParam = createFloatParam(createRange('log', 0.01, 30, 2));

	let freqValue = 20;
	let gainValue = 0;
	let qValue = 0;
</script>

<Knob param={freqParam} bind:value={freqValue} label="Frequency" unit="hz" />
<Knob
	param={gainParam}
	bind:value={gainValue}
	label="Gain"
	unit="dB"
	decimalDigits={1}
	defaultValue={0}
/>
<Knob param={qParam} bind:value={qValue} label="Q" unit="dB" decimalDigits={2} />
