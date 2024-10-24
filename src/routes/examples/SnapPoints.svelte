<script lang="ts">
	import { createFloatParam, createRange, Knob } from '$lib';

	const snapParam = createFloatParam(createRange('lin', 0, 2000));

	const snapPoints = Array.from({ length: 5 }, (_, i) => i * 500);

	let snapValue = 0;
</script>

<Knob
	param={snapParam}
	bind:value={snapValue}
	snapValues={snapPoints}
	snapThreshold={0.1}
	label="Release"
	unit="ms"
/>
