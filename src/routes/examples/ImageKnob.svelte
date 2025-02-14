<script lang="ts">
	import { ImageKnob } from '$lib';
	import imageSource from '../assets/PurpleKnob2.webp';

	let value = $state(0.0);
</script>

<ImageKnob bind:value src={imageSource} width={90} height={90} />
