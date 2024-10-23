<script lang="ts">
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
	const freqParam = createFloatParam(createRange('log', 20, 20_000));
	const gainParam = createFloatParam(createRange('log', -30, 30, Math.E));
	const qParam = createFloatParam(createRange('log', 0.01, 30, 2));
	const smoothParam = createFloatParam(createRange('lin', 0, 100));
	const snapParam = createFloatParam(createRange('lin', 0, 2000));
	const enumParam = createEnumParam(['🍍', '🍉', '🍌', '🍎', '🥭', '🍇', '🥝', '🍋'] as const);
	const filterParam = createEnumParam(['LP 12dB', 'HP 12dB', 'HP 24dB', 'BP 24dB'] as const);
	const oscParam = createEnumParam(['Sine', 'Triangle', 'Square', 'Sawtooth', 'Noise'] as const);

	const snapPoints = Array.from({ length: 5 }, (_, i) => i * 500);

	let basicValue = 0;
	let freqValue = 20;
	let gainValue = 20;
	let qValue = 0;
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

		<p>A basic knob with a linear parameter.</p>
	</div>

	<div class="example">
		<h2>Logarithmic</h2>
		<Knob param={freqParam} bind:value={freqValue} label="Frequency" unit="hz" />
		<Knob param={gainParam} bind:value={gainValue} label="Gain" unit="dB" decimalDigits={1} />
		<Knob param={qParam} bind:value={qValue} label="Q" unit="dB" decimalDigits={2} />

		<p>A knob with logarithmic scaling (default base is 10).</p>
	</div>

	<div class="example">
		<h2>Smoothness</h2>

		<h3>Smooth</h3>
		<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={0.1} />

		<h3>Stiff</h3>
		<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={1} />

		<p>
			Knobs use <code>spring</code> function from <code>svelte/motion</code> under the hood,
			allowing you to adjust smoothness by modifying the <code>stiffness</code> property on the
			<code>{'<Knob />'}</code> component.
		</p>
		<p>
			Additionally, due to how Svelte's binding works, you can use the same parameter and value for
			multiple knobs simultaneously.
		</p>
	</div>

	<div class="example">
		<h2>Snap Points</h2>
		<Knob
			param={snapParam}
			bind:value={snapValue}
			snapValues={snapPoints}
			snapThreshold={0.1}
			label="Release"
			unit="ms"
		/>

		<p>
			You can define specific points where the knob should snap and control the snapping strength by
			adjusting the <code>snapThreshold</code> property.
		</p>
		<p><i>Note: This works only with </i><code>FloatParam</code><i> values.</i></p>
	</div>

	<div class="example">
		<h2>Enum Parameter</h2>
		<Knob param={enumParam} bind:value={enumValue} label="Fruit" />
		<Knob param={filterParam} bind:value={filterValue} label="Filter Type" />
		<Knob param={oscParam} bind:value={oscValue} label="Oscillator Type" />

		<p>
			An example of how <code>EnumParam</code> works: due to the way TypeScript functions, we need
			to use <code>readonly string[]</code> instead of <code>Enum</code>s. Since enums are a small
			subset of some strings, snap markers are added automatically for clarity.
		</p>
		<p>
			Remember to add <code>as const</code> when creating an <code>EnumParam</code> to improve editor
			IntelliSense support.
		</p>
		<p>For instance:</p>
		<code>const fruitParam = createEnumParam(['🍍', '🍉', '🍌', '🥝', '🍋'] as const);</code>
	</div>

	<div class="example">
		<h2>Disabled</h2>

		<Knob param={basicParam} value={58} disabled />

		<p>
			Just like <code>{'<button>'}</code> and other interactive HTML elements,
			<code>{'<Knob />'}</code> can also be disabled.
		</p>
	</div>

	<div class="example">
		<h2>Colors</h2>

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

		<p>
			Of course, <code>{'<Knob />'}</code> colors can be customized to look however you want.
			<b>Disclaimer</b>: Font and thumb colors are based on the current font color.
		</p>
	</div>
</div>

<div class="code">
	<h2>Code for this Demo:</h2>
	<CopyPaste>%self%</CopyPaste>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		background: #222;
		color: #fff;
		font-family: sans;
	}

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

	.example > p {
		text-align: center;
	}

	.example > h2 {
		user-select: none;
	}

	.code {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
