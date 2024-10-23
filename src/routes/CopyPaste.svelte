<script lang="ts">
	import type { Snippet } from 'svelte';

	let ref: HTMLPreElement;
	let copied = $state(false);
	let timeoutId = -1;

	let { children }: { children: Snippet } = $props();

	function copyToClipboard() {
		const code = ref.textContent?.trim();
		if (code === undefined) return;

		navigator.clipboard.writeText(code).then(() => {
			copied = true;
			clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				copied = false;
			}, 2000);
		});
	}
</script>

<div class="code-container">
	<button onclick={copyToClipboard} class="copy-button" aria-label="Copy code to clipboard">
		{#if copied}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="clipboard-icon"
				><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
				></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg
			>
		{/if}
	</button>
	<pre bind:this={ref}>
    {@render children?.()}
  </pre>
</div>

<style>
	:global(pre.shiki) {
		box-sizing: border-box;
		padding: 1rem;
	}

	:global(.shiki > code) {
		text-wrap: wrap;
	}

	.code-container {
		position: relative;
		margin-bottom: 1rem;
	}

	.copy-button {
		position: absolute;
		top: 2.5rem;
		right: 1rem;
		padding: 0.5rem;
		border: none;
		border-radius: 0.375rem;
		background: #00000020;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.copy-button:hover {
		background-color: #ffffff20;
	}

	.copy-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
	}

	.clipboard-icon,
	.check-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.clipboard-icon {
		color: #6b7280;
	}

	.check-icon {
		color: #10b981;
	}
</style>
