<script lang="ts">
	import { createFloatParam, Knob } from '$lib';

	const basicParam = createFloatParam('lin', 0, 100);
</script>

<div>
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

	<Knob param={basicParam} value={24} label="Chubby" strokeWidth={6} colors={{ arc: '#ff3e00' }} />
	<Knob param={basicParam} value={24} label="Elegant" strokeWidth={2} colors={{ arc: '#ff3e00' }} />
</div>

<style>
	div {
		display: flex;
		gap: 1rem;
	}
</style>
