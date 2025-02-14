<script lang="ts">
	import CopyPaste from './CopyPaste.svelte';
	import LazyComponent from './LazyComponent.svelte';
</script>

<div class="grid">
	<h1 class="example"># svelte-knobs</h1>

	<div class="example">
		<h2>Basic</h2>
		<LazyComponent component={() => import('./examples/BasicKnob.svelte')} />

		<p>Basic styled svg knob</p>
		<CopyPaste>%import('./examples/BasicKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Image</h2>
		<LazyComponent component={() => import('./examples/ImageKnob.svelte')} />

		<p>You can use an image strip for a knob too.</p>
		<CopyPaste>%import('./examples/ImageKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Custom knob</h2>

		<LazyComponent component={() => import('./examples/CustomKnob.svelte')} />

		<p>
			In reality, svgknob and image knob are both based from a <code>{'<Draggable/>'}</code> component,
			that you can use as well, creating your very own custom made knob.
		</p>
		<CopyPaste>%import('./examples/CustomKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Param knobs</h2>

		<LazyComponent component={() => import('./examples/ParamKnob.svelte')} />

		<p>
			Since all knobs operate on values between 0 and 1 any type of scaling is done outside of the
			scope of a knob with parameter objects.
		</p>
		<CopyPaste>%import('./examples/ParamKnob.svelte')%</CopyPaste>
	</div>

	<div class="example">
		<h2>Enum-param knobs</h2>

		<LazyComponent component={() => import('./examples/EnumParam.svelte')} />

		<p>
			Enums or, in typescript realm <code>readonly string[]</code> parameter are a special type of
			parameter that don't denormalize into a number, instead into a string. <code>EnumParam</code> class
			comes with helpful properties for knob ui with already calcualted snap points and snap threshold
			to make value changes 'instant'.
		</p>
		<CopyPaste>%import('./examples/EnumParam.svelte')%</CopyPaste>
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
