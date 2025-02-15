# svelte-knobs

![Version](https://img.shields.io/npm/v/svelte-knobs)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

`svelte-knobs` is a Svelte component library for building customizable knob controls.

Inspired by:

- [vital](https://vital.audio)
- [solid-knobs](https://github.com/tahti-studio/solid-knobs)
- [nih-plug](https://github.com/robbert-vdh/nih-plug)

[Web demo](https://eye-wave.github.io/svelte-knobs)

## Installation

Add the library to your project:

```bash
npm install svelte-knobs@1.0.0-beta.1
```

## Usage

#### Basic Knob

```svelte
<script>
	import { SvgKnob } from 'svelte-knobs';

	let value = $state(0.0);
</script>

<SvgKnob bind:value />
<span>{value.toFixed(2)}</span>
```

A basic knob control with parameter scaling.
```svelte
<script lang="ts">
	import { LinearParam, LogParam } from 'svelte-knobs/params';
	import { SvgKnob } from 'svelte-knobs';

	let value = $state(0.0);

	const freqParam = new LogParam(20, 20_000, 10);
	const linParam = new LinearParam(0, 100);
</script>

<SvgKnob bind:value />
<span>{freqParam.denormalize(value) | 0}hz</span>

<SvgKnob bind:value />
<span>{linParam.denormalize(value) | 0}%</span>
```

#### Snap Points

Set specific snap points and adjust snapping sensitivity using `snapThreshold`.

```svelte
<script>
	import { SvgKnob } from 'svelte-knobs';

	let value = $state(0.0);
</script>

<div>
	<SvgKnob bind:value snapPoints={[0.5]} />
	<span>{value.toFixed(2)}</span>
</div>

```

#### Enum Parameter

Example usage of `EnumParam` for working with enumerated options.

```typescript
import { BoolParam, EnumParam } from 'svelte-knobs/params';
import { SvgKnob } from 'svelte-knobs';

let value = $state(0);

const fruitParam = new EnumParam(['🍍', '🍉', '🍌', '🍋', '🍇'] as const);
const filterTypeParam = new EnumParam([
  'Low pass',
  'High pass',
  'Low shelf',
  'High shelf',
  'Bell',
  'Notch',
  'Allpass'
] as const);

const booleanParam = new BoolParam();
```

```svelte
<SvgKnob
	bind:value
	snapPoints={fruitParam.snapPoints}
	snapThreshold={fruitParam.snapThreshold}
/>
<p>{fruitParam.denormalize(value)}</p>

<SvgKnob bind:value {...filterTypeParam.knobProps} />
<p>{filterTypeParam.denormalize(value)}</p>

<SvgKnob bind:value {...booleanParam.knobProps} />
<p>{booleanParam.denormalize(value)}</p>
```

#### Disabled Knob

Disable knob interactivity

```svelte
<SvgKnob disabled />
<ImageKnob disabled />
<Draggable disabled />
```

## License

MIT License
