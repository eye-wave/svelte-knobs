<script lang="ts">
	import imageSource from '../assets/PurpleKnob2.webp';
	import { SvgKnob, ImageKnob } from '$lib';
	import { BoolParam, EnumParam, LogParam } from '$lib/params';
	import Draggable from '$lib/Draggable.svelte';

	let value = $state(0.0);

	const logParam = new LogParam(20, 20_000, 10);
	const enumParam = new EnumParam(['🍍', '🍉', '🍌', '🍋', '🍇'] as const);
	const boolParam = new BoolParam();
</script>

<main>
  <Draggable bind:value>
    <div style="user-select: none">{value.toFixed(2)}</div>
  </Draggable>

	<SvgKnob bind:value />
	<ImageKnob bind:value src={imageSource} width={90} height={90} />

	<SvgKnob bind:value snapPoints={[0.1, 0.2, 0.3, 0.8]} size={200} />

	<div>
		<SvgKnob bind:value defaultValue={0.5} />
		<span>{logParam.denormalize(value) | 0}hz</span>
	</div>

	<div>
		<SvgKnob
			bind:value
			snapPoints={enumParam.snapPoints}
			snapThreshold={enumParam.snapThreshold}
			step={enumParam.snapThreshold}
		/>
		<span>{enumParam.denormalize(value)}</span>
	</div>

	<div>
		<SvgKnob bind:value snapPoints={[0, 1]} snapThreshold={1} step={1} />
		<span>{boolParam.denormalize(value) ? 'on' : 'off'}</span>
	</div>

	<div>
		<SvgKnob bind:value />
		<span>{boolParam.denormalize(value) ? 'Truth' : 'Lies'}</span>
	</div>
</main>

<style>
	:global(body) {
		background: #333;
	}

	main {
		padding: 200px;
		color: #4080fe;
	}
</style>
