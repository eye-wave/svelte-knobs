<script lang="ts">
	import { createFloatParam, Knob } from '$lib';

	const basicParam = createFloatParam('lin', 0, 100);
	let basicValue = 0;
</script>

<Knob param={basicParam} bind:value={basicValue} label="Volume" unit="%" />
