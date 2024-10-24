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
npm install svelte-knobs
```

## Usage

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
const snapPoints = [0, 500, 1000, 1500, 2000];

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

#### Disabled Knob

Disable knob interactivity

```svelte
<Knob param={basicParam} value={58} disabled />
```

## License

MIT License
