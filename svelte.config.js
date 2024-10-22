import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHighlighter } from 'shiki';

const theme = 'catppuccin-macchiato';

const highlighter = await createHighlighter({
	langs: ['svelte'],
	themes: [theme]
});

function printSelf() {
	return {
		name: 'print-self',
		markup({ content }) {
			if (!content.match(/%self%/)) return { code: content };

			const altered = content
				.replace(/^\s*\/\/ remove next\n.+/gm, '')
				.replace('$lib/index.js', 'svelte-knobs')
				.replace(/<div class="code"[\S\s]+<\/div>/, '')
				.replace(/\.code {[\s\S]+\}/, '');

			const html = highlighter.codeToHtml(altered, { lang: 'svelte', theme });
			const replacement = `{@html \`${html}\`}`;

			return {
				code: content.replaceAll('%self%', replacement)
			};
		}
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [printSelf(), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
