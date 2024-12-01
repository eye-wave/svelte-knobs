<script lang="ts">
	import { createFloatParam, VideoKnob, ImageKnob } from '$lib';
	import videoSource from '../assets/PurpleKnob2.webm';
	import imageSource from '../assets/PurpleKnob2.webp';

	const basicParam = createFloatParam('lin', 0, 100);
	let basicValue = 0;
</script>

<VideoKnob
	param={basicParam}
	bind:value={basicValue}
	label="Volume"
	unit="%"
	source={videoSource}
	numberOfFrames={79}
	cacheFrames
/>

<ImageKnob
	param={basicParam}
	bind:value={basicValue}
	label="Volume"
	unit="%"
	source={imageSource}
	numberOfFrames={79}
/>
