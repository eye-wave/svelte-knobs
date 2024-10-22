# svelte-knobs

![Version](https://img.shields.io/npm/v/svelte-knobs)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

`svelte-knobs` is a Svelte component library for building customizable knob controls.

Inspired by:

- [solid-knobs](https://github.com/tahti-studio/solid-knobs)
- [nih-plug](https://github.com/robbert-vdh/nih-plug)

[Web demo](https://eye-wave.github.io/svelte-knobs)

## Installation

Add the library to your project:

```bash
npm install svelte-knobs
```

## Usage

Import the `Knob` component and use it in your Svelte application:

```svelte
<script>
	import { Knob } from 'svelte-knobs';
	let volume = 50;
</script>

<Knob bind:value={volume} label="Volume" unit="%" />
```

### Examples

#### Basic Knob

```typescript
import { createFloatParam, createRange } from 'svelte-knobs';

const basicParam = createFloatParam(createRange('lin', 0, 100));
let basicValue = 0;
```

```svelte
<Knob param={basicParam} bind:value={basicValue} label="Volume" unit="%" />
```

A basic knob control with linear scaling.

#### Logarithmic Knob

```typescript
import { createFloatParam, createRange } from 'svelte-knobs';

const logParam = createFloatParam(createRange('log', 20, 20_000));
let logValue = 20;
```

```svelte
<Knob param={logParam} bind:value={logValue} label="Frequency" unit="Hz" />
```

Knob with logarithmic scaling (default base is 10).

#### Smoothness Control

Control the knob's smoothness by adjusting the `stiffness` property.

```svelte
<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={0.1} />
<Knob param={smoothParam} bind:value={smoothValue} label="Amount" unit="%" stiffness={1} />
```

#### Snap Points

Set specific snap points and adjust snapping sensitivity using `snapThreshold`.

```typescript
import { createFloatParam, createRange } from 'svelte-knobs';

const snapParam = createFloatParam(createRange('lin', 0, 2000));
const snapPoints = Array.from({ length: 5 }, (_, i) => i * 500);

let snapValue = 0;
```

```svelte
<Knob
	param={snapParam}
	bind:value={snapValue}
	snapValues={snapPoints}
	snapThreshold={0.1}
	label="Release"
	unit="ms"
/>
```

#### Enum Parameter

Example usage of `EnumParam` for working with enumerated options.

```typescript
import { createEnumParam, type Variant } from 'svelte-knobs';

const fruitParam = createEnumParam(['🍍', '🍉', '🍌', '🍋'] as const);
let fruitValue: Variant<typeof fruitParam> = '🍉';
```

```svelte
<Knob param={fruitParam} bind:value={fruitValue} label="Fruit" />
```

## License

MIT License
