<script lang="ts">
	import imageSource from '../assets/PurpleKnob2.webp';
	import { SvgKnob, ImageKnob } from '$lib';

	let value = $state(0.0);
</script>

<main>
	<SvgKnob bind:value />
	<ImageKnob bind:value src={imageSource} width={90} height={90} />
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
