import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHighlighter } from 'shiki';
import * as path from 'node:path';
import * as fs from 'node:fs';

const theme = 'one-dark-pro';

const highlighter = await createHighlighter({
	langs: ['svelte'],
	themes: [theme]
});

function highlight(code) {
	const html = highlighter.codeToHtml(code, {
		lang: 'svelte',
		theme
	});

	return html;
}

function printComponent() {
	return {
		name: 'print-self',
		markup({ content, filename }) {
			const replacement = content.replace(/%import\('([^']+)'\)%/g, (match, pth) => {
				const currentDir = path.dirname(filename);
				const compPath = path.join(currentDir, pth);

				try {
					const content = fs.readFileSync(compPath, 'utf-8').replace('$lib', 'svelte-knobs');
					const html = highlight(content);

					return `{@html \`${html}\`}`;
				} catch {
					return match;
				}
			});

			return {
				code: replacement
			};
		}
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [printComponent(), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};

export default config;
