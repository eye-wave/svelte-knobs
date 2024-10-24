<script lang="ts">
	import { createFloatParam, createRange, Knob } from '$lib';

	const basicParam = createFloatParam(createRange('lin', 0, 100));
</script>

<Knob param={basicParam} value={24} label="Svelte theme" colors={{ arc: '#ff3e00' }} />
<Knob
	param={basicParam}
	value={48}
	label="Light theme"
	colors={{
		arc: '#4292d3',
		bg: '#eef'
	}}
	style="color:#000"
/>
<Knob
	onChange={console.log}
	param={basicParam}
	value={64}
	label="Disabled color"
	colors={{ disabled: '#ccc' }}
	disabled
/>
