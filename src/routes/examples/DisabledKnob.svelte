<script lang="ts">
	import { createFloatParam, createRange, Knob } from '$lib';

	const basicParam = createFloatParam(createRange('lin', 0, 100));
</script>

<Knob param={basicParam} value={58} disabled />
