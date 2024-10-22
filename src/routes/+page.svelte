<script lang="ts">
	// remove next
	import './style.css';
	// remove next
	import CopyPaste from './CopyPaste.svelte';
	import {
		createEnumParam,
		createFloatParam,
		createRange,
		type Variant,
		Knob
	} from '$lib/index.js';

	const basicParam = createFloatParam(createRange('lin', 0, 100));
	const logParam = createFloatParam(createRange('log', 20, 20_000));
	const smoothParam = createFloatParam(createRange('lin', 0, 100));
	const snapParam = createFloatParam(createRange('lin', 0, 2000));
	const enumParam = createEnumParam(['🍍', '🍉', '🍌', '🍎', '🥭', '🍇', '🥝', '🍋'] as const);
	const filterParam = createEnumParam(['LP 12dB', 'HP 12dB', 'HP 24dB', 'BP 24dB'] as const);
	const oscParam = createEnumParam(['Sine', 'Triangle', 'Square', 'Sawtooth', 'Noise'] as const);

	const snapPoints = Array.from({ length: 5 }, (_, i) => i * 500);

	let basicValue = 0;
	let logValue = 20;
	let smoothValue = 0;
	let snapValue = 0;
	let enumValue: Variant<typeof enumParam> = '🍎';
	let filterValue: Variant<typeof filterParam> = 'HP 24dB';
	let oscValue: Variant<typeof oscParam> = 'Square';
</script>

<div class="grid">
	<h1 class="example"># svelte-knobs</h1>

	<div class="example">
		<h2>Basic</h2>
		<Knob param={basicParam} bind:value={basicValue} label="Volume" unit="%" />

		<p>Basic knob with linear param.</p>
	</div>

	<div class="example">
		<h2>Logarithmic</h2>
		<Knob param={logParam} bind:value={logValue} label="Frequency" unit="hz" />
	</div>

	<div class="example">
		<h2>Smoothness</h2>

		<h3>Smooth</h3>
		<Knob param={smoothParam} bind:value={smoothValue} label="Ammount" unit="%" stiffness={0.1} />

		<h3>Stiff</h3>
		<Knob param={smoothParam} bind:value={smoothValue} label="Ammount" unit="%" stiffness={1} />
	</div>

	<div class="example">
		<h2>Snap points</h2>
		<Knob
			param={snapParam}
			bind:value={snapValue}
			snapValues={snapPoints}
			snapThreshold={0.1}
			label="Release"
			unit="ms"
		/>
	</div>

	<div class="example">
		<h2>Enum param</h2>
		<Knob param={enumParam} bind:value={enumValue} label="Fruit" />
		<Knob param={filterParam} bind:value={filterValue} label="Filter type" />
		<Knob param={oscParam} bind:value={oscValue} label="Oscillator type" />
	</div>
</div>

<div class="code">
	<h2>Code for this Demo:</h2>
	<CopyPaste>%self%</CopyPaste>
</div>

<style>
	.grid {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		max-width: 600px;
		margin: 0 auto;
		gap: 8px;
	}

	.example {
		position: relative;
		width: 100%;
		padding: 1rem;
		display: flex;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		border-bottom: solid 2px #333;
	}

	.example > h2 {
		user-select: none;
	}

	.code {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
