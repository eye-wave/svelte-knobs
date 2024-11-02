<script lang="ts">
	import { createFloatParam, Knob } from '$lib';

	const basicParam = createFloatParam('lin', 0, 100);
</script>

<Knob param={basicParam} value={58} disabled />
