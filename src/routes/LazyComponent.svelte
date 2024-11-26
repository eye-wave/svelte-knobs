<script>
	import { viewport } from './viewport';

	let { width = 400, height = 200, component } = $props();

	let isShowingComponent = $state(false);
	let componentPromise = $state();
</script>

{#if !isShowingComponent}
	<div
		style:width="{width}px"
		style:height="{height}px"
		use:viewport
		onenterViewport={() => {
			componentPromise = component();
			isShowingComponent = true;
		}}
	>
		Loading ...
	</div>
{:else}
	{#await componentPromise}
		<div style:width="{width}px" style:height="{height}px">Loading ...</div>
	{:then { default: Component }}
		<Component />
	{/await}
{/if}
