<script lang="ts">
	import CopyPaste from './CopyPaste.svelte';
	import LazyComponent from './LazyComponent.svelte';
</script>

<div class="grid">
	<h1 class="example"># svelte-knobs</h1>

	<div class="example">
		<h2>Basic</h2>
		<LazyComponent component={() => import('./examples/BasicKnob.svelte')} />

		<p>A basic knob with a linear parameter.</p>
		<CopyPaste>%import('./examples/BasicKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Logarithmic</h2>
		<LazyComponent component={() => import('./examples/LogarithmicKnob.svelte')} />

		<p>A knob with logarithmic scaling (default base is 10).</p>
		<CopyPaste>%import('./examples/LogarithmicKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Smoothness</h2>

		<LazyComponent component={() => import('./examples/SmoothKnob.svelte')} />

		<p>
			Knobs use <code>spring</code> function from <code>svelte/motion</code> under the hood,
			allowing you to adjust smoothness by modifying the <code>stiffness</code> property on the
			<code>{'<Knob />'}</code> component.
		</p>
		<p>
			Additionally, due to how Svelte's binding works, you can use the same parameter and value for
			multiple knobs simultaneously.
		</p>

		<CopyPaste>%import('./examples/SmoothKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Snap Points</h2>

		<LazyComponent component={() => import('./examples/SnapPoints.svelte')} />

		<p>
			You can define specific points where the knob should snap and control the snapping strength by
			adjusting the <code>snapThreshold</code> property.
		</p>
		<p><i>Note: This works only with </i><code>FloatParam</code><i> values.</i></p>

		<CopyPaste>%import('./examples/SnapPoints.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Enum Parameter</h2>

		<LazyComponent component={() => import('./examples/EnumParam.svelte')} />

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

		<CopyPaste>%import('./examples/EnumParam.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Disabled</h2>

		<LazyComponent component={() => import('./examples/DisabledKnob.svelte')} />

		<p>
			Just like <code>{'<button>'}</code> and other interactive HTML elements,
			<code>{'<Knob />'}</code> can also be disabled.
		</p>

		<CopyPaste>%import('./examples/DisabledKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Colors</h2>

		<LazyComponent component={() => import('./examples/ColoredKnobs.svelte')} />

		<p>
			Of course, <code>{'<Knob />'}</code> colors can be customized to look however you want.
			<b>Disclaimer</b>: Font and thumb colors are based on the current font color.
		</p>

		<CopyPaste>%import('./examples/ColoredKnobs.svelte')%</CopyPaste>
	</div>
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
		max-width: 720px;
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
</style>
