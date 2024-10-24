<script lang="ts">
	import { createEnumParam, Knob, type Variant } from '$lib';

	const enumParam = createEnumParam(['🍍', '🍉', '🍌', '🍎', '🥭', '🍇', '🥝', '🍋'] as const);
	const filterParam = createEnumParam(['LP 12dB', 'HP 12dB', 'HP 24dB', 'BP 24dB'] as const);
	const oscParam = createEnumParam(['Sine', 'Triangle', 'Square', 'Sawtooth', 'Noise'] as const);

	let enumValue: Variant<typeof enumParam> = '🍎';
	let filterValue: Variant<typeof filterParam> = 'HP 24dB';
	let oscValue: Variant<typeof oscParam> = 'Square';
</script>

<Knob param={enumParam} bind:value={enumValue} label="Fruit" />
<Knob param={filterParam} bind:value={filterValue} label="Filter Type" />
<Knob param={oscParam} bind:value={oscValue} label="Oscillator Type" />
